const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTapCurrent:0,
    couponlist:[],
    title:'你还没有获得优惠卷',
    pagenum: 1
  },
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      menuTapCurrent: current,
      pagenum: 1,
    });
    this.DataonLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pagenum: 1,
    })
    that.DataonLoad();
  },
  DataonLoad: function () {
    var that = this;
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/coupon',
      data: {
        uid: app.globalData.uid,
        //   uid: 8,
        pagenum: that.data.pagenum,
        types: that.data.menuTapCurrent,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          if (that.data.pagenum == 1) {
            var l = []
          } else {
            var l = that.data.couponlist
          }
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].money = parseInt(res.data.data[i].money);
            l.push(res.data.data[i]);
          }
          if (res.data.data.length<10){
            var title ='暂时就这么多信息'
          }else{
            var title = '上拉加载更多'
          }
          that.setData({
            couponlist: l,
            pagenum: that.data.pagenum + 1,
            title: title
          });
        } else {
          if (that.data.pagenum == 1) {
            wx.showToast({
              title: '没有任何优惠券',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              couponlist: [],
              pagenum: that.data.pagenum + 1,
              title:'你还没有获得优惠卷'
            });
          } else {
            wx.showToast({
              title: '已加载完全部',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              pagenum: that.data.pagenum + 1,
              title: '暂时就这么多信息'
            });
          }
        }
        // that.setData({
        //   collectList: collectList,
        // })
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
    var that = this
    that.DataonLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})