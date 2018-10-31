const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goods: []
  },
  jump_details(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.goods[index].id;
    wx.navigateTo({
      url: '../../details/details?id=' + id,
    })
  },
  jump_frig() {
    wx.switchTab({
      url: '../../frig/frig'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    var id = options.id
    this.setData({
      id: id
    })
    var that = this
    wx.request({
      url: app.globalData.servsersip + 'api.php/Wxfans/recommend',
      data: {
        pagenum: 1
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function(res) {
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          var l = []
          for (var i = 0; i < res.data.data.length; i++) {
            l.push(res.data.data[i])
          }
          that.setData({
            goods: l,
          });
        }
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
    let _this = this;
    if (res.from === "button") {
      return {
        title: "分享优惠卷",
        path: "/pages/coupon/coupon?orderid=" + _this.data.id,
        imageUrl: app.globalData.yhimg /*图片比例500：400*/
      }
    }
  }
})