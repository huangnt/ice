const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
          goodslist: res.data.data.goods,
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
  onShareAppMessage: function(option) {
    let _this = this;
    if (option.from === "button") {
      return {
        title: '快来拼单好吃冰淇淋',
        path: 'pages/payfound/payfound?id='+this.data.id,
        imageUrl: app.globalData.ptimg,
        success: function(res) {
          wx.showModal({
            title: '转发成功',
            content: '是否继续邀请',
            cancelText: '否',
            success: function(res) {
              if (res.confirm) {
                console.log("继续邀请")
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../../index/index'
                })
              }
            }
          })
        },
      }
    }
    return {
      title: '冻感世界，这个夏天我做主',
      path: 'pages/index/index',
      //   imageUrl: '这个是显示的图片，不写就默认当前页面的截图',

    }
  }
})