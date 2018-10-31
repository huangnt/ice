const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //    state:1-待付款  2-已完成 -1取消订单
    pickupgoods: {
      orderNum: "201871112541671",
      state: 2,
      placetime: "2018-5-23  12:25:36",
      postage: 0,
      courierNun: "215483123456",
      goodsList: [],
      goodsHeigth: false,
    },

  },
  // 复制订单号
  copyText() {
    let orderNum = this.data.pickupgoods.order_sn;
    wx.setClipboardData({
      data: orderNum,
      success: function(res) {
        console.log(res)
      }
    })
  },
  // 复制快递单号
  copycourierNun() {
    let courierNun = this.data.pickupgoods.kuaidi_num;
    wx.setClipboardData({
      data: courierNun,
      success: function(res) {
        console.log(res)
      }
    })
  },
  // 改变高度
  changeHeight() {
    let pickupgoods = this.data.pickupgoods;
    pickupgoods.goodsHeigth = !pickupgoods.goodsHeigth;
    this.setData({
      pickupgoods: pickupgoods,
    })
  },
  confirm_btn() {
    let pickupgoods = this.data.pickupgoods;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/orders_edit',
            method: 'post',
            data: {
              id: _this.data.id,
              uid: app.globalData.uid,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //--init data
              var status = res.data.data;
              if (status == 1) {
                wx.showToast({
                  title: '操作成功！',
                  duration: 2000
                });
                pickupgoods.status = -1;
                _this.setData({
                  pickupgoods: pickupgoods,
                });
              } else {
                wx.showToast({
                  title: res.data.err,
                  duration: 2000
                });
              }
            },
            fail: function () {
              // fail
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            }
          });
         
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  lookfun() {
    let select = this.data.select;
    select = !select;
    this.setData({
      select: select,
    });
  },
  payment() {
    let _this = this;
    wx.showModal({
      title: '是否确认付款？',
      success: function (res) {
        if (res.confirm) {
          var data = []
          data['id'] = _this.data.id
          data['openid'] = app.globalData.myopenid
          wx.request({
            url: app.globalData.servsersip + 'api.php/Weixinpay/pays',
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
                      //console.log(res);
                      wx.showToast({
                        title: '付款成功',
                        icon: 'success',
                      });
                      setTimeout(function () {
                        wx.navigateTo({
                          url: '../../us/orderform/orderform',
                        });
                      }, 2000)
                    },
                    'fail': function (res) {
                      wx.showToast({
                        title: '支付失败',
                        icon: 'none',
                      })
                      //console.log(res);
                    },
                    'complete': function (res) {
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      }
    })
  },
  onLoad: function(options) {
    wx.hideShareMenu()
    console.log(options);
    var id = options.id;
    var that = this
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/order_details',
      data: {
        id: id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          pickupgoods: res.data.data,
          id: id
        });
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
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
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      return {
        title: "分享优惠卷",
        path: "/pages/coupon/coupon?orderid=" + this.data.id,
        imageUrl: "../../../img/honbao.png" /*图片比例500：400*/
      }
    }
    // return {
    //   title: "全球鲜品",
    //   path: "/pages/index/index",
    //   imageUrl: "" /*图片比例500：400*/
    // }
  }
})