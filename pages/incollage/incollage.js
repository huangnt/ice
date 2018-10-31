const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    peopleNum: 2,
    personalmoney: 0,
    summoney: 0,
    show: false, //显示隐藏
    carClick: null, //判断显示的是1为 优惠券，2为现金券
    couponlist: [],
    coupon_title: '',
    coupon_id: 0,
    coupon_money: 0,
  },

  jump_address() {
    var goods = this.data.goods
    wx.navigateTo({
      url: '../ordinary/coladdress/coladdress?goods=' + goods + '&types=3',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 减
  jian_tianchong() {
    let _this = this;
    let peopleNum = this.data.peopleNum;
    if (peopleNum <= 2) {
      wx.showToast({
        title: '拼团人数最少2人',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      peopleNum--;
    };
    _this.setData({
      peopleNum: peopleNum
    });
    this.sum();
  },
  // 加
  jia_tianchong() {
    let _this = this;
    let peopleNum = this.data.peopleNum;
    if (peopleNum >= 5) {
      wx.showToast({
        title: '拼团人数最多5人',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      peopleNum++;
    };
    _this.setData({
      peopleNum: peopleNum
    });
    this.sum();
  },
  sum() {
    // 拼单人数
    let peopleNum = this.data.peopleNum;
    // 总价格
    let summoney = parseFloat(this.data.total_p);
    let personalmoney = summoney / peopleNum;
    this.setData({
      summoney: summoney,
      personalmoney: personalmoney.toFixed(2)
    })
  },
  jump_found() {
    var that = this
    var list = that.data.lists
    var data = []
    data['goods'] = that.data.goods
    data['openid'] = app.globalData.myopenid
    data['uid'] = app.globalData.uid
    data['price'] = parseFloat(list.price) //商品价格
    data['logistics'] = parseFloat(list.freight) //邮费
    data['coupon_id'] = parseInt(that.data.coupon_id)
    data['coupon_price'] = parseFloat(that.data.coupon_money) //优惠券金额
    data['price_h'] = parseFloat(list.price) + parseFloat(list.freight) - parseFloat(that.data.coupon_money)
    data['goods_num'] = list.num
    data['receiver'] = list.a_name
    data['tel'] = list.a_tel
    data['order_type'] = 2
    data['p_num'] = that.data.peopleNum
    data['p_price'] = that.data.personalmoney
    data['address_xq'] = list.a_address_xq
    console.log(data)
    if (list.a_id == 0) {
      wx: wx.showToast({
        title: '请选择联系人及电话',
        icon: 'none',
        duration: 1500,
      })
    } else if (list.is_freight == false) {
      wx: wx.showToast({
        title: '订单中的商品暂时不配送到该城市',
        icon: 'none',
        duration: 1500,
      })
    }
    else {
      wx.request({
        url: app.globalData.servsersip + 'api.php/Weixinpay/pay',
        data: data,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {

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
                'success': function(res) {
                  //console.log(res);
                  wx.showToast({
                    title: '付款成功',
                    icon: 'success',
                    mask: true,
                    success: function() {
                      setTimeout(function() {
                        wx.navigateTo({
                          url: '../receive/found/found?id=' + id,
                        })
                      }, 1000);
                    }
                  })
                },
                'fail': function(res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                  })
                  setTimeout(function() {
                    // wx.navigateTo({
                    //   url: '../receive/found/found?id=' + id,
                    // })
                    wx.reLaunch({
                      url: '../us/collage/collage',
                    })
                  }, 1000)
                  //console.log(res);
                },
                'complete': function(res) {
                  //console.log(res);
                }
              });
            } else if (res.data.data.goodscode == 3) {
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
                      url: '../receive/found/found?id=' + id,
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
  // 选择优惠券
  jump_selectcoupon() {
    let carClick = this.data.carClick;
    let show = this.data.show;
    show = true;
    carClick = 1;
    this.setData({
      carClick: carClick,
      show: show
    })
    this.stopanimation();

  },
  // 选择现金券
  jump_selectcash() {
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
    list.total_p = parseFloat(list.price) + parseFloat(list.freight) - parseFloat(couponlist[index].money)
    if (list.total_p < 0) {
      list.total_p == 0
    }
    list.total_p = list.total_p.toFixed(2)
    _this.setData({
      couponlist: couponlist,
      coupon_title: coupon_title,
      coupon_id: coupon_id,
      coupon_money: coupon_money,
      lists: list,
      total_p: list.total_p
    })
    this.sum();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0,
    })
    console.log(options);
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
          total_p: res.data.data.total_p,
          couponlist: res.data.data.coupon,
        });
        that.sum();
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function(option) {
  //   return {
  //     title: '冻感世界，这个夏天我做主',
  //     path: 'pages/index/index',
  //     //   imageUrl: '这个是显示的图片，不写就默认当前页面的截图',
  //   }
  // }
})