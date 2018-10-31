const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //    state:0-未收货 1-未发货  2-已完成
    pickupgoods: {},
    select: false,
    btntext: '查看更多'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lookfun() {
    let select = this.data.select;
    let btntext = this.data.btntext;
    select = !select;
    if (select == true) {
      btntext = "收起"
    } else {
      btntext = "查看更多"
    }
    this.setData({
      select: select,
      btntext: btntext,
    });
  },
  //确认收货
  confirm_btn() {
    let _this = this;
    let pickupgoods = this.data.pickupgoods;
    wx.showModal({
      title: '提示',
      content: '确认收货',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/recOrder',
            method: 'post',
            data: {
              id: _this.data.id,
              uid: app.globalData.uid,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //--init data
              var status = res.data.data;
              if (status == 1) {
                wx.showToast({
                  title: '操作成功！',
                  duration: 2000
                });
                pickupgoods.status = 5;
                _this.setData({
                  pickupgoods: pickupgoods,
                });
              } else {
                wx.showToast({
                  title: res.data.err,
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

          // wx.redirectTo({
          //   url: '../../us/pickupgoods/pickupgoods?id=3'
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  jump_goodsComment(e) {
    let id = this.data.id;
    wx.navigateTo({
      url: '../../receive/goodsComment/goodsComment?id=' + id,
    })
  },
  onLoad: function(options) {
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
  // onShareAppMessage: function (res) {
  //     return {
  //         title: "全球鲜品",
  //         path: "/pages/index/index",
  //         imageUrl: ""/*图片比例500：400*/
  //     }
  // }
})