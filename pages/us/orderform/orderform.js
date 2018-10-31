const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTapCurrent: 0,
    //   state 状态 1-未付款,2已完成 -1已取消
    // seeAssess 评论   true 已评论   false 未评论
    goodsList: [],
  },
  // 更多列表
  gengduo(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    goodsList[index].maxheigrh = !goodsList[index].maxheigrh;
    _this.setData({
      goodsList: goodsList
    })
  },
  menuTap: function(e) {
    var current = e.currentTarget.dataset.current; //获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
    this.setData({
      menuTapCurrent: current,
      pagenum: 1,
    });
    this.DataonLoad();
  },
  jump_coldetails(e) {
    let index = e.currentTarget.dataset.index;
    let orderNum = this.data.goodsList[index].id;
    let _this = this;
    wx.navigateTo({
      url: '../../receive/comdetails/comdetails?id=' + orderNum,
    });
  },
  pay(e) {
    let index = e.currentTarget.dataset.index;
    let orderNum = this.data.goodsList[index].id;
    let _this = this;
    wx.showModal({
      title: '是否确认付款？',
      success: function(res) {
        if (res.confirm) {
          var data = []
          data['id'] = orderNum
          data['openid'] = app.globalData.myopenid
          wx.request({
            url: app.globalData.servsersip + 'api.php/Weixinpay/pays',
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
                      });
                      setTimeout(function() {
                        wx.navigateTo({
                          url: '../../receive/comdetails/comdetails?id=' + orderNum,
                        });
                      }, 2000)
                    },
                    'fail': function(res) {
                      wx.showToast({
                        title: '支付失败',
                        icon: 'none',
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      }
    })

  },
  // 这函数本来是跳转提货详情，因为改稿，所以没有触发。
  jump_pickdetails(e) {
    let index = e.currentTarget.dataset.index;
    let orderNum = this.data.goodsList[index].id;
    wx.navigateTo({
      url: '../../ordinary/pickdetails/pickdetails?id=' + id,
    });
  },
  // 去评价
  jump_goodsComment(e) {
    let index = e.currentTarget.dataset.index;
    let orderNum = this.data.goodsList[index].id;
    wx.navigateTo({
      url: '../../receive/goodsComment/goodsComment?id=' + orderNum,
    })

  },
  cancel(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    wx.showModal({
      title: '警告',
      content: '是否取消订单',
      success: function(res) {
        if (res.confirm) {
          
          wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/orders_edit',
            method: 'post',
            data: {
              id: goodsList[index].id,
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
                goodsList[index].status = -1;
                _this.setData({
                  goodsList: goodsList
                })
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
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    var that = this;
    that.setData({
      pagenum: 1,
    })
    that.DataonLoad();
  },
  DataonLoad: function() {
    var that = this;
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/order',
      data: {
        uid: app.globalData.uid,
        //   uid: 8,
        pagenum: that.data.pagenum,
        order_type: 1,
        status: that.data.menuTapCurrent,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          if (that.data.pagenum == 1) {
            var l = []
          } else {
            var l = that.data.goodsList
          }
          for (var i = 0; i < res.data.data.length; i++) {
            l.push(res.data.data[i])
          }
          that.setData({
            goodsList: l,
            pagenum: that.data.pagenum + 1
          });
        } else {
          if (that.data.pagenum == 1) {
            wx.showToast({
              title: '没有任何订单',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              goodsList: [],
              pagenum: that.data.pagenum + 1
            });
          } else {
            wx.showToast({
              title: '已加载完全部订单',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              pagenum: that.data.pagenum + 1
            });
          }
        }
        // that.setData({
        //   collectList: collectList,
        // })
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
    var that = this
    that.DataonLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let _this = this;
    let index = res.target.dataset.id;
    let id = _this.data.goodsList[index].id
    if (res.from === "button") {
      return {
        title: "分享优惠卷",
        path: "/pages/coupon/coupon?orderid=" + id,
        imageUrl: "app.globalData.yhimg" /*图片比例500：400*/
      }
    }
    return {
      title: "全球鲜品",
      path: "/pages/index/index",
      imageUrl: "" /*图片比例500：400*/
    }
  }
})