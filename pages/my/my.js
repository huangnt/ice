// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tipsShow: true,
  },    
    tipsShow() {
        let tipsShow = this.data.tipsShow;
        tipsShow = false;
        this.setData({
            tipsShow: tipsShow,
        })
    },
  jump_collage(){
    wx.navigateTo({
        url: '../us/collage/collage',
    })
  },
  jump_orderform(){
      wx.navigateTo({
          url: '../us/orderform/orderform',
      })
  },
    jump_pickupgoods(){
      wx.navigateTo({
          url: '../us/pickupgoods/pickupgoods',
      })
  },
    jump_shopCar(){
        wx.navigateTo({
            url: '../shopcar/shopcar',
        })
    },
    jump_address(){
        wx.navigateTo({
            url: '../us/adress/adress',
        })
    },
    jump_myCoupon(){
        wx.navigateTo({
            url: '../us/myCoupon/myCoupon',
        })
    },
    jump_comment(){
        wx.navigateTo({
            url: '../us/comment/comment',
        })
    },
  onLoad: function (options) {
    wx.hideShareMenu()
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
    var bgimg = app.globalData.servsersip +'uploads/bg.jpg'
    var userinfo = app.globalData.userInfo
    console.log(userinfo)
    this.setData({
      bgimg: bgimg,
      userinfo: userinfo
    })
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
    onShareAppMessage: function (res) {
        return {
            title: "全球鲜品",
            path: "/pages/index/index",
            imageUrl: ""/*图片比例500：400*/
        }
    }
})