const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gift_goods: [],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    formbtn: false,
    // 展示更多
    clickMore: false,
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  translate() {
    let _this = this;
    let clickMore = _this.data.clickMore;
    clickMore = !clickMore;
    _this.setData({
      clickMore: clickMore,
    })
  },
  // 领取礼品
  formSubmit: function(e) {
    if (e.detail.value.name.length == 0 || e.detail.value.name == 'undefined'){
      wx.showToast({
        title: '请填写收货人姓名',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.tel.length == 0 || e.detail.value.tel == 'undefined'){
      wx.showToast({
        title: '请填写收货人电话',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.detaddress.length == 0 || e.detail.value.detaddress == 'undefined'){
      wx.showToast({
        title: '请填写收货地址',
        icon: 'none',
        duration: 2000
      })
    }else{
      var that = this
      var region = that.data.region
      var address_xq = region[0] + region[1] + region[2] + e.detail.value.detaddress
      wx.request({
        url: app.globalData.servsersip + 'api.php/wxfans/r_th',
        data: {
          id: that.data.id,
          uid: app.globalData.uid,
          receiver: e.detail.value.name,
          tel: e.detail.value.tel,
          address_xq: address_xq
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { // 设置请求的 header
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (ress) {
          console.log(ress.data.data)
          if (ress.data.data > 0) {
            wx.showModal({
              title: '领取礼物',
              content: '领取成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              }
            })
           
          } else if (ress.data.data == -1) {
            wx.showModal({
              title: '领取失败',
              content: '该礼物已被他人领取',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '领取失败',
              icon: 'none',
              duration: 2000
            })
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
     
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var id = options.id
    var that=this
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/order_details',
      data: {
        id: id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          list: res.data.data,
          gift_goods: res.data.data.goods,
          id:id
        });
      },
      fail: function () {
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
  onReady: function() {},


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
  // onShareAppMessage: function (res) {
  //     return {
  //         title: "全球鲜品",
  //         path: "/pages/index/index",
  //         imageUrl: ""/*图片比例500：400*/
  //     }
  // }
})