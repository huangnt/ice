//index.js
//获取应用实例
const app = getApp()
var loadMsgData = function(that) {
  wx.request({
    url: app.globalData.servsersip + 'api.php/Wxfans/goods',
    data: {
      pagenum: that.data.pagenum,
      one_type: that.data.menuTapCurrent
    },
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: 'post',
    success: function(res) {
      console.log(res.data.data)
      if (res.data.data.length > 0) {
        if (that.data.pagenum == 1) {
          var l = []
        } else {
          var l = that.data.ice
        }
        for (var i = 0; i < res.data.data.length; i++) {
          l.push(res.data.data[i])
        }
        if (res.data.data.length == 10) {
          var Dataloading = "上拉加载更多"
        } else {
          var Dataloading = "已加载完全部"
        }
        that.setData({
          ice: l,
          pagenum: that.data.pagenum + 1,
          Dataloading: Dataloading
        });
      } else {
        if (that.data.pagenum == 1) {
          wx.showToast({
            title: '该分类暂时无任何商品',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            ice: [],
            pagenum: that.data.pagenum + 1,
            Dataloading: "已加载完全部"
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
    }
  })
}
Page({
  data: {
    pagenum: 1,
    Dataloading: "上拉加载更多",
    tipsShow: true,
    slider: [],
    img: [],
    swiperCurrent: 0,
    menuTapCurrent: 1,
    // 冰淇淋数组
    // discount 表示新品==1，热卖==2，普通==0等意思，
    ice: [],
  },
  tipsShow() {
    let tipsShow = this.data.tipsShow;
    tipsShow = false;
    this.setData({
      tipsShow: tipsShow,
    })
  },
  jump_home(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index
    var img = this.data.slider
    var url = img[index].url
    console.log(img);
    if (url != null) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  onLoad: function() {
    var that = this
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/homepage',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        if (res.data.data.length > 0) {
          var l = []
          var ls = []
          var menuTapCurrent = 0
          for (var i = 0; i < res.data.data.length; i++) {
            l.push(res.data.data[i])
          }
          for (var i = 0; i < res.data.status.type.length; i++) {
            if (i == 0) {
              menuTapCurrent = res.data.status.type[i].id
            }
            ls.push(res.data.status.type[i])
          }
          for (var i = 0; i < res.data.status.wx_img.length; i++) {
            if (res.data.status.wx_img[i].id == 1) {
              app.globalData.ptimg = res.data.status.wx_img[i].url
            } else if (res.data.status.wx_img[i].id == 2) {
              app.globalData.yhimg = res.data.status.wx_img[i].url
            } else {
              app.globalData.lpimg = res.data.status.wx_img[i].url
            }
          }
          console.log()
          that.setData({
            slider: l,
            img: ls,
            menuTapCurrent: menuTapCurrent
          });
          that.setData({
            pagenum: 1
          });
          loadMsgData(that);
        }
      }
    })

  },
  //轮播图的切换事件
  swiperChange: function(e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function(e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  jump_details(e) {
    let index = e.currentTarget.dataset.index;
    let ice = this.data.ice;
    wx.navigateTo({
      url: '../details/details?id=' + ice[index].id,
    })
  },
  menuTap: function(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      menuTapCurrent: current,
      pagenum: 1
    });
    loadMsgData(this);
  },
  onReachBottom: function() {
    loadMsgData(this);
  },
  onShareAppMessage: function() {
    return {
      title: "全球鲜品",
      path: "/pages/index/index",
      imageUrl: "" /*图片比例500：400*/ ,
      success: function(ress) {
        console.log('成功');
        if (app.globalData.uid > 0) {
          wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/share',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function(ress) {
              if (ress.data.data > 0) {
                wx.showToast({
                  title: '分享获赠' + ress.data.data + '积分',
                  duration: 2000,
                  icon: 'none',
                })
              }
            }
          })
        }
      },
    }
  }

})