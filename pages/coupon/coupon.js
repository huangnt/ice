const app = getApp()
function coupon(that) {
  wx.request({
    url: app.globalData.servsersip + 'api.php/Wxfans/coupun',
    data: {
      orderid: that.data.orderid,
      uid: app.globalData.uid
    },
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: 'post',
    success: function (res) {
      console.log(res.data.data)
      that.setData({
        list: res.data.data,
        pages: 2
      });
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlist: [], //储存领取优惠卷人的信息
    couponText: '满100元减5元优惠券', //优惠卷信息
    receive: false, //判断是否领取
    userNum: 0, //人数
    pages:1
  },
  click_draw(e) {
    var _this=this
    var list = _this.data.list
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/receive',
      data: {
        uid: app.globalData.uid,
        id: list.id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data > 0) {
          wx.showToast({
            title: '领取成功',
          })
        } else if (res.data.data == 0) {
          collarlist.splice(index, 1);
          wx.showToast({
            title: '手速慢了，优惠券已经被领完！',
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.data == -1){
          wx.showToast({
            title: '领取失败！',
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '不可重复领取！',
            icon: 'none',
            duration: 2000
          })
        }
        coupon(_this);
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
  click_use() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var orderid = options.orderid;
    this.setData({
      orderid: orderid,
    })
    coupon(this);
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
    var that=this
    if (that.data.pages==2){
      coupon(that);
    }else{
      setTimeout(function () {
        coupon(that)
      }, 2000);
    }
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