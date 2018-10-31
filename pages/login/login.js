//获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden:false,
    },
    onGotUserInfo: function (e) {
      let hidden =true;
      this.setData({
          hidden: hidden,
      })
      if (e.detail.errMsg == 'getUserInfo:ok') {
      
        var userInfo = e.detail.userInfo
        console.log(userInfo) 
        userInfo.openid = app.globalData.myopenid
        userInfo.m_id = 1
        app.globalData.userInfo = userInfo
        wx.request({
          url: app.globalData.servsersip + 'api.php/wxfans/saveWxfans',
          data: userInfo,
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            console.log(res.data.data)
            app.globalData.uid = res.data.data
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }  
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})