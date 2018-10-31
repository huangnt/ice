const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist: []
  },
  //   选择默认；
  select_default(e) {
    var _this = this;
    const index = e.currentTarget.dataset.index;
    var addresslist = this.data.addresslist;
    if (addresslist[index].defaultsel == false) {
      wx.showModal({
        title: '提示',
        content: '是否设为默认',
        success: function (res) {
          if (res.confirm) {
            var addrId = addresslist[index].id;
            console.log(addrId);
            wx.request({
              url: app.globalData.servsersip + 'api.php/wxfans/set_default',
              data: {
                uid: app.globalData.uid,
                id: addrId
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: { // 设置请求的 header
                'Content-Type': 'application/x-www-form-urlencoded'
              },

              success: function (res) {
                // success
                var status = res.data.data;
                if (status == 1) {
                  for (let i = 0; i < addresslist.length; i++) {
                    addresslist[i].defaultsel = false;
                  }
                  addresslist[index].defaultsel = true;
                  let str = addresslist.splice(index, 1);
                  addresslist.unshift(str[0]);
                  _this.setData({
                    addresslist: addresslist
                  })
                  wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 1000
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
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }

  },
  jump_collect(e) {
    let _this = this;
    let caseNum=2;
    let index = e.currentTarget.dataset.index;
   
    var addresslist = _this.data.addresslist;
    let addid = addresslist[index].id;
    var goods = _this.data.goods
    var types = _this.data.types
    if (types==1){
      wx.redirectTo({
        url: '../../receive/fillin/fillin?a_id=' + addid + "&goods=" + goods,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (types == 2){
      wx.redirectTo({
          url: '../../ordinary/pickdetails/pickdetails?a_id=' + addid + "&goods=" + goods + "&caseNum=" + caseNum,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.redirectTo({
        url: '../../incollage/incollage?a_id=' + addid + "&goods=" + goods,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  // 进入修改地址；
  modify(e) {
    var _this = this;
    const index = e.currentTarget.dataset.index;
    var id = this.data.addresslist[index].id;
    wx.navigateTo({
      url: '../../receive/modify/modify?id=' + id,
    })
  },
  del(e) {
    var _this = this;
    const index = e.currentTarget.dataset.index;
    var addresslist = this.data.addresslist;
    wx.showModal({
      title: '提示',
      content: '是否删除地址',
      success: function(res) {
        if (res.confirm) {
          var addrId = addresslist[index].id
          wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/del_adds',
            data: {
              id: addrId
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { // 设置请求的 header
              'Content-Type': 'application/x-www-form-urlencoded'
            },

            success: function(res) {
              // success
              var status = res.data.data;
              if (status == 1) {
                var l = _this.data.addresslist
                l.splice(index, 1)
                _this.setData({
                  addresslist: l
                });
              } else {
                wx.showToast({
                  title: res.data.data,
                  duration: 2000
                });
              }
            },
            fail: function() {
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
    });

  },
  // 新增地址
  jump_addAddress() {
    wx.navigateTo({
      url: '../../receive/add/add',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    that.setData({
      goods: options.goods,
      types: options.types,
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
    var that = this;
    console.log(app.globalData.uid);
    that.DataonLoad();
  },
  DataonLoad: function() {
    var that = this;
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/address',
      data: {
        uid: app.globalData.uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        // success

        var address = []
        if (res.data.data.length > 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            address.push(res.data.data[i])
          }
        }

        that.setData({
          addresslist: address,
        })
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
    return {
      title: "全球鲜品",
      path: "/pages/index/index",
      imageUrl: "" /*图片比例500：400*/
    }
  }
})