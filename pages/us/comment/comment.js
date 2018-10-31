const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Mycomment:[
        { 
            goodsName: "Tip Top香草味冰淇淋",
            goodsImg: "../../../img/ice2.jpg",
            score:["1","2","3","4","5"], 
            contem_text: "从以前开始就爱吃这个牌子的冰激凌，感觉非常好，吃起来口感超级醇正，跟在新西兰买的吃起来口感一模一样，上次做活动也非常划算！包装寄过来的时候保存得很完整，量也很多。希望商家越做越好吧！", 
            time:"2018/09/1 09:16:28",
            picture_list: ["http://img3.imgtn.bdimg.com/it/u=4214723282,987522149&fm=26&gp=0.jpg", "http://img4.imgtn.bdimg.com/it/u=3054891382,500449320&fm=11&gp=0.jpg","http://img5.imgtn.bdimg.com/it/u=1386096481,282140200&fm=11&gp=0.jpg"]
            },
        {
            goodsName: "Tip Top香草味冰淇淋",
            goodsImg: "../../../img/ice2.jpg",
            score: ["1", "2", "3", "4"],
            contem_text: "从以前开始就爱吃这个牌子的冰激凌，感觉非常好，吃起来口感超级醇正，跟在新西兰买的吃起来口感一模一样，上次做活动也非常划算！包装寄过来的时候保存得很完整，量也很多。希望商家越做越好吧！",
            time: "2018/09/1 09:16:28",
            picture_list: []
        },
        {
            goodsName: "Tip Top香草味冰淇淋",
            goodsImg: "../../../img/ice2.jpg",
            score: ["1", "2",],
            contem_text: "从以前开始就爱吃这个牌子的冰激凌，感觉非常好，吃起来口感超级醇正，跟在新西兰买的吃起来口感一模一样，上次做活动也非常划算！包装寄过来的时候保存得很完整，量也很多。希望商家越做越好吧！",
            time: "2018/09/1 09:16:28",
            picture_list: ["http://img0.imgtn.bdimg.com/it/u=2703674299,2474969949&fm=26&gp=0.jpg", "http://img3.imgtn.bdimg.com/it/u=4214723282,987522149&fm=26&gp=0.jpg", "http://img5.imgtn.bdimg.com/it/u=1386096481,282140200&fm=11&gp=0.jpg", "http://img4.imgtn.bdimg.com/it/u=2947110516,2186953292&fm=26&gp=0.jpg"]
        }
    ],
    pagenum: 1
  },
    changePreview(e){
        var self = this;
        var see = e.currentTarget.dataset.see.picture_list;
        let index = e.currentTarget.dataset.index;
        console.log(see);
        console.log(see[index]);
        wx.previewImage({
            current: see[index],
            urls: see,
        })
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
      url: app.globalData.servsersip + 'api.php/wxfans/userevaluate',
      data: {
        uid: app.globalData.uid,
        //   uid:8,
        pagenum: that.data.pagenum
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.data.length > 0) {
          if (that.data.pagenum == 1) {
            var l = []
          } else {
            var l = that.data.Mycomment
          }
          for (var i = 0; i < res.data.data.length; i++) {
            l.push(res.data.data[i])
          }
          that.setData({
            Mycomment: l,
            pagenum: that.data.pagenum + 1,
            Dataloading: "上拉加载更多"
          });
        } else {
          if (that.data.pagenum == 1) {
            wx.showToast({
              title: '没有任何的评价',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              Mycomment: [],
              pagenum: that.data.pagenum + 1
            });
          } else {
            wx.showToast({
              title: '已加载完全部',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              pagenum: that.data.pagenum + 1,
              Dataloading: "已加载完全部"
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