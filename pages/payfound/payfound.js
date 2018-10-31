const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    seemode: false,
    userlist: []
  },
  //   更多
  mode() {
    let seemode = this.data.seemode;
    seemode = !seemode;
    this.setData({
      seemode: seemode
    })
  },
  //付款
  payment() {
    var data = []
    data['openid'] = app.globalData.myopenid
    data['id'] = this.data.id
    data['uid'] = app.globalData.uid
    wx.request({
      url: app.globalData.servsersip + 'api.php/Weixinpay/payt',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {

        if (res.data.msg == 'success') {
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

                // wx.showToast({
                //   title: '付款成功',
                //   icon: 'success',
                // });
                wx.showToast({
                  title: '付款中',
                  icon: 'loading',
                  success: function(res) {
                    wx.showToast({
                      title: '支付完成',
                      icon: 'success',
                      success: function(res) {
                        wx.redirectTo({
                          url: '../receive/payment/payment?id=' + data['id'],
                        })
                      },
                    })
                  },
                })
                // setTimeout(function () {
                //   wx.reLaunch({
                //     url: '../../../us/orderDetails/orderDetails?id=' + data['id'],
                //   })
                // }, 2000)
              },
              'fail': function(res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                })
                // setTimeout(function () {
                //   wx.reLaunch({
                //     url: '../../../us/orderDetails/orderDetails?id=' + id,
                //   })
                // }, 2000)
                //console.log(res);
              },
              'complete': function(res) {
                //console.log(res);
              }
            });
          } else if (res.data.data.goodscode == 2) {
            wx.showToast({
              title: '该团人数已到达上线',
              icon: 'none',
              duration: 2000
            });
            setTimeout(function() {
              wx.switchTab({
                url: '../index/index'
              })
            }, 2000)

          } else {
            wx.showToast({
              title: '您已参与过该团，不可再次参与',
              icon: 'none',
              duration: 2000
            });
            setTimeout(function() {
              wx.switchTab({
                url: '../index/index'
              })
            }, 2000)
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
    });

  },
  cancel() {
    wx.showToast({
      title: '活动已取消',
      icon: 'none',
      success: function(res) {

        setTimeout(function() {
          wx.switchTab({
            url: '../index/index'
          })
        }, 2000)
      },
    })
  },
  jiesu() {
    wx.showToast({
      title: '活动已结束',
      icon: 'none',
      success: function(res) {
        setTimeout(function() {
          wx.switchTab({
            url: '../index/index'
          })
        }, 2000)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var id = options.id
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
          list: res.data.data,
          goods: res.data.data.goods,
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
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/order_pay',
      data: {
        orderid: id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          userlist: res.data.data,
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
  onShareAppMessage: function() {

  }
})