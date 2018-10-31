const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allmomey: 0,
    allNum: 0,
    goodsList: [],
    freight: 0,
    // 储存
    storage: true,
    //发货
    delivery: false,
    isShow: false,
    show: false, //显示隐藏
    carClick: null, //判断显示的是1为 优惠券，2为现金券
    couponlist: [],
    coupon_title:'',
    coupon_id:0,
    coupon_money: 0,
  },
  select_storage() {
    let storage = this.data.storage;
    var list = this.data.lists;
    var coupon_money = this.data.coupon_money;
    var freight = this.data.freight
    let delivery = this.data.delivery;
    if (storage == true) {
      return false;
    } else {
      storage = true;
      delivery = false;
      list.total_p = parseFloat(list.price) + parseFloat(list.freight) - parseFloat(coupon_money)
      freight = list.freight
      if (list.total_p < 0) {
        list.total_p == 0
      }
      list.total_p = list.total_p.toFixed(2)
    }
    this.setData({
      storage: storage,
      delivery: delivery,
      freight: freight,
      lists: list
    })
  },
  select_delivery() {
    let storage = this.data.storage;
    let delivery = this.data.delivery;
    var list = this.data.lists;
    var coupon_money = this.data.coupon_money;
    var freight = this.data.freight
    if (delivery == true) {
      return false;
    } else {
      delivery = true;
      storage = false;
      list.total_p = parseFloat(list.price) - parseFloat(coupon_money)
      freight = 0
      if (list.total_p < 0) {
        list.total_p == 0
      }
      list.total_p = list.total_p.toFixed(2)
      freight = freight.toFixed(2)
    }
    this.setData({
      storage: storage,
      delivery: delivery,
      freight: freight,
      lists: list
    })
  },
  getTotalPrice() {
    let goodsList = this.data.goodsList; // 获取购物车列表
    let total = 0;
    let allNum = 0;
    for (let i = 0; i < goodsList.length; i++) { // 循环列表得到每个数据
      total += goodsList[i].momey * goodsList[i].num;
      allNum += goodsList[i].num;
    }
    this.setData({ // 最后赋值到data中渲染到页面
      goodsList: goodsList,
      allmomey: total.toFixed(2),
      allNum: allNum,
    });
  },
  jump_payment() {
    wx.showToast({
      title: '付款成功',
      icon: 'success',
      mask: true,
      success: function() {
        setTimeout(function() {
          wx.reLaunch({
            url: '../payment/payment',
          })
        }, 2000);
      }
    })
  },
  // // 使用优惠卷
  // youhuiquan() {
  //   let carClick = this.data.carClick;
  //   let show = this.data.show;
  //   show = true;
  //   carClick = 1;
  //   this.setData({
  //     carClick: carClick,
  //     show: show
  //   })
  //   this.stopanimation();

  // },
  // 使用现金卷
  xianjinquan() {
    let carClick = this.data.carClick;
    let show = this.data.show;
    show = true;
    carClick = 2;
    this.setData({
      carClick: carClick,
      show: show
    })
    this.stopanimation();
  },
  //选中的优惠券
  selecticon(e) {
    let _this = this;
    const index = e.currentTarget.dataset.index;
    let couponlist = _this.data.couponlist;
    for (let i = 0; i < couponlist.length; i++) {
      couponlist[i].select = false;
    }
    couponlist[index].select = true;
    var coupon_id = couponlist[index].id
    var coupon_title = couponlist[index].title
    var coupon_money = couponlist[index].money
    var list = _this.data.lists;
    var storage = _this.data.storage;
    if (storage){
      list.total_p = parseFloat(list.price) + parseFloat(list.freight) - parseFloat(couponlist[index].money)
    }else{
      list.total_p = parseFloat(list.price) - parseFloat(couponlist[index].money)
    }
    if (list.total_p<0){
      list.total_p==0
    }
    list.total_p = list.total_p.toFixed(2)
    _this.setData({
      couponlist: couponlist,
      coupon_title: coupon_title,
      coupon_id: coupon_id,
      coupon_money: coupon_money,
      lists:list
    })
  },

  stopanimation() {
    let show = this.data.show;
    if (show == true) {
      this.animation.bottom(0).step();
    } else {
      this.animation.bottom(-800 + 'rpx').step();
    }

    this.setData({
      animation: this.animation.export()
    })
  },
  show_modal() {
    let show = this.data.show;
    let carClick = this.data.carClick;
    let _this = this;
    carClick = 2;
    show = true;
    _this.setData({
      show: show,
      carClick: carClick
    })
    this.stopanimation();
  },
  close_modal() {
    let show = this.data.show;
    let _this = this;
    let carClick = this.data.carClick;
    show = false;
    carClick = null;
    _this.setData({
      carClick: carClick,
      show: show,
    })
    this.stopanimation();
  },
  // 修改地址
  jump_address() {
    var goods = this.data.goods
    wx.navigateTo({
      url: '../../ordinary/coladdress/coladdress?goods=' + goods + '&types=1',
    })
  },
  // 表单提交获取信息
  bindFormSubmit: function(e) {
    console.log(e.detail.value.textarea)
    var that = this
    var list = that.data.lists
    var data = []
    data['goods'] = that.data.goods
    data['openid'] = app.globalData.myopenid
    data['uid'] = app.globalData.uid
    data['price'] = parseFloat(list.price) //商品价格
    data['logistics'] = parseFloat(that.data.freight) //邮费
    data['coupon_id'] = parseInt(that.data.coupon_id)
    data['coupon_price'] = parseFloat(that.data.coupon_money) //优惠券金额
    data['price_h'] = parseFloat(list.total_p)
    data['remark'] = e.detail.value.textarea //备注
    data['goods_num'] = list.num
    data['receiver'] = list.a_name
    data['tel'] = list.a_tel
    data['address_xq'] = list.a_address_xq
    if (that.data.storage == true){
      data['pickup'] = 0
    }else{
      data['pickup'] = 1
    }
    data['order_type'] = 1
    console.log(data)
    if (list.a_id==0 && data['pickup'] == 0) {
      wx: wx.showToast({
        title: '请选择联系人及电话',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: function (res) {
        },
      })
    } else if (list.is_freight == false && data['pickup'] == 0){
      wx: wx.showToast({
        title: '商品中有不可配送地区，无法下单',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: function (res) {
        },
      })
    } else {
      wx.request({
        url: app.globalData.servsersip + 'api.php/Weixinpay/pay',
        data: data,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {

          if (res.data.msg == 'success') {
            console.log(res.data.data);
            var id = res.data.data.id
            //console.log('调起支付');
            if (res.data.data.goodscode == 1) {
              wx.requestPayment({
                'timeStamp': res.data.data.timeStamp,
                'nonceStr': res.data.data.nonceStr,
                'package': res.data.data.package,
                'signType': res.data.data.signType,
                'paySign': res.data.data.paySign,
                'success': function (res) {
                  console.log(res);
                  wx.showToast({
                    title: '付款成功',
                    icon: 'success',
                    mask: true,
                    success: function () {
                      setTimeout(function () {
                          wx.navigateTo({
                          url: '../payment/payment?id='+id,
                        })
                      }, 1000);
                    }
                  })
                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                  })
                  setTimeout(function () {
                      wx.navigateTo({
                      url: '../../us/orderform/orderform',
                    })
                    // wx.navigateTo({
                    //   url: '../payment/payment?id=' + id,
                    // })
                  }, 1000)
                  //console.log(res);
                },
                'complete': function (res) {
                  //console.log(res);
                }
              });
            } else if (res.data.data.goodscode == 3){
              wx.showToast({
                title: res.data.data.remark,
                icon: 'none',
              });
            } else if (res.data.data.goodscode == 2) {
              wx.showToast({
                title: '下单成功',
                icon: 'success',
                mask: true,
                success: function () {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../payment/payment?id=' + id,
                    })
                  }, 1000);
                }
              })
            }else {
              wx.showToast({
                title: '下单失败',
                icon: 'none',
                duration: 2000
              });
            }

          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0,
    })
    var that = this;
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/good',
      data: {
        goods: options.goods,
        a_id: options.a_id,
        uid: app.globalData.uid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          goods: options.goods,
          lists: res.data.data,
          goodsList: res.data.data.goods,
          couponlist: res.data.data.coupon,
          freight:res.data.data.freight
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // onPageScroll: function (e) { // 获取滚动条当前位置
  //     console.log(e)

  // },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function(res) {
  //   return {
  //     title: "全球鲜品",
  //     path: "/pages/index/index",
  //     imageUrl: "" /*图片比例500：400*/
  //   }
  // }
})