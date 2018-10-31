//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code != 'the code is a mock one') {
          if (!that.globalData.myopenid) {
            //发起网络请求
            wx.request({
              url: that.globalData.servsersip + 'api.php/Wxconnect/getOpenid',
              data: {
                code: res.code
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function (res) {
                that.globalData.myopenid = res.data.data.openid
                console.log(res.data.data.openid)
                wx.request({
                  url: that.globalData.servsersip + 'api.php/wxfans/findWxfans',
                  data: {
                    openid: that.globalData.myopenid,
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  method: 'POST',
                  success: function (ress) {
                    that.globalData.isClose = false
                    console.log(ress.data);
                    if (ress.data.data != null) {
                      that.globalData.uid = ress.data.data.id
                      that.globalData.userInfo = ress.data.data
                      console.log(that.globalData)
                    } else {
                        wx.navigateTo({
                          url: '../login/login?types=2',
                        })
                    }
                  }
                })
              }

            })
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg + '，' + res.code)
        }
      }
    })
  },
  globalData: {
    uid: 0,
    userInfo: null,
    myopenid: '',
    servsersip: "https://www.ice-tech.com.cn/",//https://www.ice-tech.com.cn/http://10.0.0.15:813/
    isClose: true,
  },
})