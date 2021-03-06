const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:123,
    name:'冷先生',
    pho:'1321548641',
    region: ['广东省', '珠海市', '香洲区'],
    customItem: '全部',
    detAddress:"人民路313号1栋 恒和中心",
    selected:true,
    is_default:0
  },
    selected(){
      var selected = this.data.selected;
      selected = !selected;
      if (selected){
        var is_default=1
      }else{
        var is_default = 0
      }
      this.setData({
        selected: selected,
        is_default: is_default
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/singleaddress',
      data: {
        id: options.id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var address = res.data.data
        if (address.is_default==1){
          var selected=true
        }else{
          var selected = false
        }
        that.setData({
          address: address,
          is_default: address.is_default,
          selected: selected,
          id: options.id,
          region: address.region
        })
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
  bindRegionChange: function (e) {
      this.setData({
          region: e.detail.value
      })
  },
  // 提交表单
  formSubmit( e){
      // console.log(this.data.id);
      // console.log(this.data.selected)
      // console.log(res);
      // // 数据保存后才执行页面跳转
      
    var that = this
    if (e.detail.value.name.length == 0) {
      wx.showModal({
        title: '提示',
        content: '收货人不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    else if (e.detail.value.tel.length == 0) {
      wx.showModal({
        title: '提示',
        content: '电话密码不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.servsersip + 'api.php/Wxfans/newaddress',
        data: {
          id: that.data.id,
          name: e.detail.value.name,
          tel: e.detail.value.tel,
          address: e.detail.value.address,
          uid: app.globalData.uid,
          openid: app.globalData.myopenid,
          sheng: that.data.region[0],
          city: that.data.region[1],
          quyu: that.data.region[2],
          is_default: that.data.is_default
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          console.log(res.data.data)
          var datas = res.data.data
          if (datas == 0) {
            wx.showModal({
              title: '提示',
              content: '保存失败',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          } else {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          
            wx.navigateBack({
              delta:1
            })
          }
        }
      })
    }
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
    onShareAppMessage: function (res) {
        return {
            title: "全球鲜品",
            path: "/pages/index/index",
            imageUrl: ""/*图片比例500：400*/
        }
    }
})