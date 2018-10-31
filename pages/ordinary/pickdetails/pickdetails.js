const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oheigth: false,
    ohide: false,
    id: 0,
    lookmore: "",
    give: [{
        selected: true,
        day: '只工作日送货'
      },
      {
        selected: false,
        day: '只双休日、节假日送货'
      },
      {
        selected: false,
        day: '工作日、双休日与节假日送货'
      }
    ],
    days: '只工作日送货',
    // hide:1显示 0:隐藏，删除
    orderlist: [],
    // 判断显示隐藏地址与邮费和其他信息
    caseNum: null,
    showModal: false,
  },
  select_give(e) {
    let index = e.currentTarget.dataset.index;
    let give = this.data.give;
    for (let i = 0; i < give.length; i++) {
      give[i].selected = false;
    }
    give[index].selected = true;
    var days = give[index].day
    this.setData({
      give: give,
      days: days
    })
  },

  remod_order(e) {
    let index = e.currentTarget.dataset.index;
    let orderlist = this.data.orderlist;
    let ohide = this.data.ohide;
    let _this = this;
    if (orderlist.length == 1) {
      wx.showToast({
        title: '提货时最少要有一件商品',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '是否删除该商品',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          orderlist.splice(index, 1)
          var goods = ''
          var num = 0
          var freight = 0
          for (var i = 0; i < orderlist.length; i++) {
            num = num + orderlist[i].num
            if (i == 0) {
              goods = orderlist[i].goods_id + '-' + orderlist[i].num
            } else {
              goods += '/' + orderlist[i].goods_id + '-' + orderlist[i].num
            }
            if (orderlist[i].freight > freight) {
              freight = orderlist[i].freight
            }
          }
          var lists = _this.data.lists
          lists.num = num
          lists.freight = freight
          _this.setData({
            orderlist: orderlist,
            goods: goods,
            lists: lists
          });
          console.log(lists)
        }
      },
    })
  },
  jump_pickupgoods() {
    var data = [];
    var that = this
    var lists = that.data.lists
    var caseNum = that.data.caseNum;
    var showModal = that.data.showModal;
    data['goods'] = that.data.goods
    data['uid'] = app.globalData.uid
    data['working'] = that.data.days
    data['logistics'] = parseFloat(lists.freight)
    data['total_p'] = parseFloat(lists.freight)
    data['price_h'] = parseFloat(lists.freight)
    data['receiver'] = lists.a_name
    data['tel'] = lists.a_tel
    data['address_xq'] = lists.a_address_xq
    data['order_type'] = 3
    data['goods_num'] = lists.num
    data['openid'] = app.globalData.myopenid
    data['is_receive'] = caseNum
    // 提货
    if (lists.is_freight == false && caseNum == 2) {
      wx.showToast({
        title: '商品不在可配送范围内',
        icon: 'none',
      })
      return false;
    }
    if (lists.a_id == 0 && caseNum == 2) {
      wx.showToast({
        title: '亲，你还未选择地址',
        icon: 'none',
      })
      return false;
    }
    wx.request({
      url: app.globalData.servsersip + 'api.php/Wxfans/thorder',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.data > 0) {
          var id = res.data.data
          that.setData({
            id: id
          })
          if (data['price_h'] > 0) {
            var datas = []
            datas['id'] = res.data.data
            datas['openid'] = app.globalData.myopenid
            wx.request({
              url: app.globalData.servsersip + 'api.php/Weixinpay/pays',
              data: datas,
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function(res) {
                if (res.data.msg == 'success') {
                  console.log(res.data.data);
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
                        });
                        if (caseNum == 1) {
                          // 送礼 支付
                          // 支付后 弹窗
                          showModal = true;
                          that.setData({
                            showModal: showModal
                          })
                        } else if (caseNum == 2) {
                          wx.redirectTo({
                            url: '../../us/pickupgoods/pickupgoods'
                          })
                        }
                      },
                      'fail': function(res) {
                        wx.showToast({
                          title: '支付失败',
                          icon: 'none',
                        })
                        wx.redirectTo({
                          url: '../../us/pickupgoods/pickupgoods'
                        })
                        //console.log(res);
                      },
                      'complete': function(res) {
                        //console.log(res);
                      }
                    });
                  } else {
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
          } else {
            if (caseNum == 1) {
              // 送礼 支付
              // 支付后 弹窗
              showModal = true;
              that.setData({
                showModal: showModal
              })
            } else if (caseNum == 2) {
              wx.redirectTo({
                url: '../../us/pickupgoods/pickupgoods'
              })
            }
          }
        } else {
          wx.showToast({
            title: '提货失败',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }
    });
  },
  // 提货
  jump_coladdress() {
    wx.navigateTo({
      url: '../../ordinary/coladdress/coladdress?goods=' + this.data.goods + '&types=2',
    })
  },
  // 赠送盆友
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
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
          caseNum: options.caseNum,
          lists: res.data.data,
          orderlist: res.data.data.goods
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

  /**
   * 用户点击右上角分享
   */
  hiedModal() {
    let that = this;
    // 这是获取是否显示的弹框
    let showModal = this.data.showModal;
    this.setData({
      showModal: false
    })
  },
  // onShareAppMessage: function(res) {
  //   console.log(res)
  //   if (res.from === "button") {

  //     var id =this.data.id
  //     return {
  //       title: "领取礼品",
  //       path: "/pages/obtaingift/obtaingift?id=" + id,
  //       imageUrl: app.globalData.lpimg /*图片比例500：400*/ ,
  //       success: function(ress) {
  //         console.log(ress)
  //         wx.switchTab({
  //           url: '../../index/index',
  //         })
  //       } ,
  //       fail: function (ress) {
  //         console.log(113)
  //         // 转发失败
  //         wx.redirectTo({
  //           url: '../../us/pickupgoods/pickupgoods'
  //         })
  //       }
  //     }
  //   } 
  // }
  onShareAppMessage: function(ops) {
    var id = this.data.id
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
      return {
        title: '领取礼品',
        path: "/pages/obtaingift/obtaingift?id=" + id,
        imageUrl: app.globalData.lpimg /*图片比例500：400*/,
        success: function(res) {
          console.log(123132)
          wx.switchTab({
            url: '../../index/index',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        },
        fail: function(res) {
          // 分享失败
          console.log(13213)
          wx.redirectTo({
            url: '../../us/pickupgoods/pickupgoods'
          })
        }
      }
    }
  }
})