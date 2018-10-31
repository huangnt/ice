const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTapCurrent: 1,
    pagenum: 1,
    //   state 状态 1-待发货，2-已发货
    // seeAssess 评论   true 已评论   false 未评论
    goodsList: [],
    firstTopX: 0,
    lastTopX: 0,
    showModal: false,
    oid: null,
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
  jump_confirm(e) {
    let evenindex = e.currentTarget.dataset.index;
    console.log(evenindex)
    let orderNum = this.data.goodsList[evenindex].id;
    wx.navigateTo({
      url: '../../receive/confirm/confirm?id=' + orderNum,
    })
  },
  // 去评价
  jump_goodsComment(e) {
    let index = e.currentTarget.dataset.index;
    let orderNum = this.data.goodsList[index].id;
    wx.navigateTo({
      url: '../../receive/goodsComment/goodsComment?id=' + orderNum,
    })
  },
  //   取消订单
  cancel(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let goodsList = _this.data.goodsList;
    wx.showModal({
      title: '提示',
      content: '亲！是否确认取消该订单！',
      success(res) {
        if (res.confirm) {
          console.log(goodsList[index].id)
          wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/thorders_edits',
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
  // 支付。。。。
  payment(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let goodsList = _this.data.goodsList;
    wx.showModal({
      title: '是否确认付款？',
      success: function (res) {
        if (res.confirm) {
          var data = []
          data['id'] = goodsList[index].id
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
                          url: '../../receive/confirm/confirm?id=' + goodsList[index].id,
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
  // 点击触发移动位置；
  left_move(e) {
    let index = e.currentTarget.dataset.index;
    let firstTopX = this.data.firstTopX;
    let lastTopX = this.data.lastTopX;
    // console.log(e.changedTouches[0].pageX)
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    wx.hideShareMenu()
    // if (options.id){
    //     let id = options.id;
    //     let menuTapCurrent ;
    //     menuTapCurrent = id;
    //     this.setData({
    //         menuTapCurrent: menuTapCurrent,
    //     })
    // }else{
    //     let menuTapCurrent = 0;
    //     this.setData({
    //         menuTapCurrent: menuTapCurrent,
    //     })
    // }
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
        pagenum: that.data.pagenum,
        order_type: 3,
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
  onReachBottom: function() {
    var that = this
    that.DataonLoad();
  },
  jump_pickupgoods(e) {
    var that = this;
    let oid = e.currentTarget.dataset.oid;
    var showModal = that.data.showModal;
    showModal = true;
    that.setData({
      showModal: showModal,
      oid: oid
    })
  },
  onShareAppMessage: function(res) {
    let that = this;
    if (res.from === "button") {
      let oid = that.data.oid;
      console.log(oid)
      return {
        title: "领取礼品",
        path: "/pages/obtaingift/obtaingift?id=" + oid,
        imageUrl: app.globalData.lpimg /*图片比例500：400*/ ,
        success: function(res) {
          wx.switchTab({
            url: '../../index/index',
          })
        },
        fail: function(res) {
          // 转发失败
          wx.redirectTo({
            url: '../../us/pickupgoods/pickupgoods'
          })
        }
      }
    }
    console.log(res)
  }
})