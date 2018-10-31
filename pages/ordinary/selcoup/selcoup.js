Page({

  /**
   * 页面的初始数据
   */
  data: {
      couponlist: [
          // coupon:0-现金卷  1-优惠卷  initial开始日期，end到期日期，arrive满多少元，worth减多少元，state 状态：1-未过期，0-过期
          { coupon: 1, initial: "2018-07-16", end: "2018-8 - 31", arrive: 100, worth: 20, state: 1, select:false,},
          { coupon: 1, initial: "2018-07-16", end: "2018-8 - 20", arrive: 100, worth: 20, state: 0, select:false,},
          { coupon: 1, initial: "2018-07-16", end: "2018-8 - 31", arrive: 100, worth: 20, state: 1, select:false,},
          { coupon: 1, initial: "2018-07-16", end: "2018-8 - 19", arrive: 100, worth: 20, state: 0, select:false,},
          { coupon: 1, initial: "2018-07-16", end: "2018-8 - 18", arrive: 100, worth: 20, state: 0, select:false,},
          { coupon: 0, initial: "2018-07-16", end: "2018-8 - 31", arrive: 100, worth: 20, state: 1, select:false,},
          { coupon: 0, initial: "2018-07-16", end: "2018-8 - 20", arrive: 100, worth: 20, state: 0, select:false,},
          { coupon: 0, initial: "2018-07-16", end: "2018-8 - 31", arrive: 100, worth: 20, state: 1, select:false,},
          { coupon: 0, initial: "2018-07-16", end: "2018-8 - 19", arrive: 100, worth: 20, state: 0, select:false,},
          { coupon: 0, initial: "2018-07-16", end: "2018-8 - 18", arrive: 100, worth: 20, state: 0, select:false,},
      ]
  },
    selecticon(e){
        let _this=this;
        const index = e.currentTarget.dataset.index;
        let couponlist = _this.data.couponlist;
        for (let i = 0; i < couponlist.length; i++) {
            couponlist[i].select = false;
        }
        couponlist[index].select = true;
        _this.setData({
            couponlist: couponlist
        })
        // wx.showModal({
        //     title: '提示',
        //     content: '是否使用这张优惠卷',
        //     success:function(res){
        //         if(res.confirm){
        //             couponlist[index].select=true;
        //             _this.setData({
        //                 couponlist: couponlist
        //             })
        //             wx.navigateBack({
        //                 delta: 1
        //             })
        //         }
        //     }
        // })
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