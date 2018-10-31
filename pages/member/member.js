// pages/member/member.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {

        //   信息
        
        // 百分条
        num: null,
        //  level等级： 1为 普通用户 2为蓝卡会员  3银卡会员 4金卡会员
        level: 1,
        infoData: {
            // 当前积分
            currentNum:200,
            // 下一个等级的积分
            nextLevel:1000,
            headerImg: "http://img.hb.aicdn.com/1d449cfa96dd1f74cc6ec4dade73f5c7ad86edf025829-ffNFru_fw658",
            footerImg: "http://img.hb.aicdn.com/e2478d9c90462042cf56f9062b0bd1dabdd74a2222a79-B5K7nK_fw658",
            barColor:" #84bcff"//蓝色
            // #feefcb  //金色
            // #606a80  //银色
        },
        levelNum: null,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    //   跳转页面
    jump_enroll() {
        wx.navigateTo({
            url: '../ordinary/enroll/enroll',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // if (app.globalData.userInfo) {
        //     this.setData({
        //         userInfo: app.globalData.userInfo,
        //         hasUserInfo: true
        //     })
        // } else if (this.data.canIUse) {
        //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //     // 所以此处加入 callback 以防止这种情况
        //     app.userInfoReadyCallback = res => {
        //         this.setData({
        //             userInfo: res.userInfo,
        //             hasUserInfo: true
        //         })
        //     }
        // } else {
        //     // 在没有 open-type=getUserInfo 版本的兼容处理
        //     wx.getUserInfo({
        //         success: res => {
        //             app.globalData.userInfo = res.userInfo
        //             this.setData({
        //                 userInfo: res.userInfo,
        //                 hasUserInfo: true
        //             })
        //         }
        //     })
        // }

        // let _this=this;
        // let num=_this.data.num;
        // let infoData = _this.data.infoData;
        // if (infoData != 1){
        //     num = infoData.currentNum/ infoData.nextLevel*100
        // }
        // _this.setData({
        //     num: num.toFixed(2),
        //     infoData: infoData,
        // })
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
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
      let that=this;
      var b_img=app.globalData.servsersip + 'uploads/btn.jpg'
      that.setData({
        b_img: b_img
      })
      wx.request({
        url: app.globalData.servsersip + 'api.php/wxfans/wx_member',
        data: {
          uid: app.globalData.uid,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {// 设置请求的 header
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            lists: res.data.data,
          }); 
          var content = res.data.data.content
          if (content != null && content != "") {
            WxParse.wxParse('content', 'html', content, that, 3);
          } 
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
    // onShareAppMessage: function(res) {
    //     return {
    //         title: "全球鲜品",
    //         path: "/pages/index/index",
    //         imageUrl: "" /*图片比例500：400*/
    //     }
    // }
})