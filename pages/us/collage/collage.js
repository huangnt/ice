const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTapCurrent: 0,
    pagenum: 1,
    //   state 状态 1-未付款,2-待发货，3-已发货 ,4-待拼单,-1-取消
    // seeAssess 评论   true 已评论   false 未评论
    goodsList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  menuTap: function(e) {
    var current = e.currentTarget.dataset.current; //获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current,
      pagenum: 1,
    });
    this.DataonLoad();
  },
  jump_coldetails(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.goodsList[index].id;
    wx.navigateTo({
      url: '../../coldetails/coldetails?id=' + id,
    })
  },
  pay(e){
    let index = e.currentTarget.dataset.index;
    let id = this.data.goodsList[index].id;
    // wx.navigateTo({
    //   url: '../../coldetails/coldetails?id=' + id,
    // })
    var data = []
    data['openid'] = app.globalData.myopenid
    data['id'] = id
    data['uid'] = app.globalData.uid
    wx.request({
      url: app.globalData.servsersip + 'api.php/Weixinpay/payt',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {

        if (res.data.msg == 'success') {
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

                // wx.showToast({
                //   title: '付款成功',
                //   icon: 'success',
                // });
                wx.showToast({
                  title: '付款中',
                  icon: 'loading',
                  success: function (res) {
                    wx.showToast({
                      title: '支付完成',
                      icon: 'success',
                      success: function (res) {
                        wx.navigateTo({
                          url: '../../coldetails/coldetails?id=' + id,
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
              'fail': function (res) {
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
              'complete': function (res) {
                //console.log(res);
              }
            });
          } else if (res.data.data.goodscode == 2) {
            wx.showToast({
              title: '该团人数已到达上线',
              icon: 'none',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: '您已参与过该团，不可再次参与',
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
  },
  // 去评价
  jump_goodsComment(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.goodsList[index].id;
    wx.navigateTo({
      url: '../../receive/goodsComment/goodsComment?id=' + id,
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
          goodsList[index].state = -1;
          _this.setData({
            goodsList: goodsList
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  gengduo(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    goodsList[index].maxheigrh = !goodsList[index].maxheigrh;
    _this.setData({
      goodsList: goodsList
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
      url: app.globalData.servsersip + 'api.php/wxfans/orders',
      data: {
        uid: app.globalData.uid,
        //   uid: 8,
        pagenum: that.data.pagenum,
        order_type: 2,
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.DataonLoad();
  },
  onShareAppMessage: function(res) {
    let _this = this;
    if (res.from === "button") {
      let index = res.target.dataset.id;
      let id = _this.data.goodsList[index].id;
      let state = res.target.dataset.status;
      //   state 2-已完成 是分享优惠卷的传值
      if (state == 1) {
        return {
          title: "分享优惠卷",
          path: "/pages/coupon/coupon?orderid=" + id,
          imageUrl: app.globalData.yhimg /*图片比例500：400*/
        }
      } else if (state == 2) {
        return {
          title: "与好友参与AA团吧~",
          path: "/pages/payfound/payfound?id=" + id,
          imageUrl: app.globalData.ptimg /*图片比例500：400*/
        }
      }

    }
    return {
      title: "全球鲜品",
      path: "/pages/index/index",
      imageUrl: "" /*图片比例500：400*/
    }
  }
})