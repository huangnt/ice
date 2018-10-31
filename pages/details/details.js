const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var loadMsgData = function(that) {
  wx.request({
    url: app.globalData.servsersip + 'api.php/Wxfans/evaluate',
    data: {
      pagenum: that.data.pagenum,
      goods_id: that.data.id
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
          var l = that.data.otherEvaluation
        }
        for (var i = 0; i < res.data.data.length; i++) {
          l.push(res.data.data[i])
        }
        that.setData({
          otherEvaluation: l,
          pagenum: that.data.pagenum + 1,
        });
      } else {
        if (that.data.pagenum == 1) {
          wx.showToast({
            title: '该商品暂时未有任何评价',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            otherEvaluation: [],
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
          });
        }
      }
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    menuTapCurrent: 0,
    freight: "0.00-30.00", //运费
    show: false, //显示隐藏
    num: 1,
    carClick: null, //判断显示的是1为 加入购车弹窗，2为支付弹窗
    menuTapCurrent: 0, //选项卡的切换
    otherEvaluation: []

  },
  //轮播图的切换事件
  swiperChange: function(e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  menuTap: function(e) {
    var current = e.currentTarget.dataset.current; //获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
    if (current == 1 && this.data.pagenum == 1) {
      loadMsgData(this);
    }
  },
  // 图片放大
  changePreview(e) {
    var self = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: self.data.piclist
    })
  },
  // 加入购物车函数
  jionCar() {
    let carClick = this.data.carClick;
    let show = this.data.show;
    show = true;
    carClick = 1;
    this.setData({
      carClick: carClick,
      show: show
    })
    this.stopanimation();
  },
  jump_join() {
    var that = this
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/addshop',
      data: {
        uid: app.globalData.uid,
        goods_id: that.data.id,
        num: that.data.num,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        if (res.data.data > 0) {
          wx.showToast({
            title: '加入成功',
            duration: 2000
          })
        }
      }
    })
  },
  // 大图浏览
  seePicture(e) {
    var _this = this;
    var otherEvaluation = this.data.otherEvaluation;

    const idx = e.currentTarget.dataset.index;
    console.log(e)
    const lock = e.currentTarget.dataset.lock;
    console.log(lock)
    wx.previewImage({
      current: lock,
      urls: otherEvaluation[idx].pictureList
    })

  },
  // jump_Index放回首页
  jump_Index() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 减
  jian_tianchong() {
    let _this = this;
    let num = this.data.num;
    let stock = this.data.stock;
    if (num <= 1) {
      wx.showToast({
        title: '商品数量最小为1',
        duration: 2000,
        icon: 'none',
      })
      return false;
    } else {
      num--;
    };
    var total = parseFloat(this.data.lists.cost_price) * num
    total = total.toFixed(2)
    _this.setData({
      num: num,
      stock: stock,
      total: total
    });
  },
  // 加
  jia_tianchong() {
    let _this = this;
    let num = this.data.num;
    let stock = this.data.stock;
    if (num >= stock) {
      wx.showToast({
        title: '商品库存仅剩' + stock + '件',
        duration: 2000,
        icon: 'none',
      })
      return false;
    } else {
      num++;
    };
    var total = parseFloat(this.data.lists.cost_price) * num
    total = total.toFixed(2)
    _this.setData({
      num: num,
      stock: stock,
      total: total
    });
  },
  // 调到incollage页面
  jump_incollage() {
    var that = this
    var goods = that.data.id + '-' + that.data.num
    wx.navigateTo({
      url: '../incollage/incollage?goods=' + goods + '&a_id=0',
      success: function(res) {},
    })
  },
  // 跳转到支付页面
  jump_shopcar() {
    var that=this
    var goods = that.data.id + '-' + that.data.num
    wx.navigateTo({
      url: '../receive/fillin/fillin?goods=' + goods+'&a_id=0',
    })
  },
  // 条转到购物车
  jump_jionCar() {
    wx.navigateTo({
      url: '../shopcar/shopcar',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0,
    })
    var that = this
    that.setData({
      id: options.id,
      pagenum: 1
    });
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/singlegoods',
      data: {
        id: options.id,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.data)
        var total = res.data.data.cost_price
        that.setData({
          lists: res.data.data,
          stock: res.data.data.num,
          total: total
        });
        var content = res.data.data.content
        if (content != null && content != "") {
          WxParse.wxParse('content', 'html', content, that, 3);
        }
      }
    })
  },
  //   这是一个空函数，配合页面catchtouchmove个显示模态框时阻止滚动跳滚动
  preventTouchMove() {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let show = this.data.show;
  },
  stopanimation() {
    let show = this.data.show;
    if (show == true) {
      this.animation.bottom(0).step();
    } else {
      this.animation.bottom(-590 + 'rpx').step();
    }

    this.setData({
      animation: this.animation.export()
    })
  },
  show_modal() {
    let show = this.data.show;
    let carClick = this.data.carClick;
    let _this = this;
    carClick = 2;
    show = true;
    _this.setData({
      show: show,
      carClick: carClick
    })
    this.stopanimation();
  },
  close_modal() {
    let show = this.data.show;
    let _this = this;
    let carClick = this.data.carClick;
    show = false;
    carClick = null;
    _this.setData({
      carClick: carClick,
      show: show,
    })
    this.stopanimation();
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
    let menuTapCurrent = this.data.menuTapCurrent;
    var page = this.data.pagenum
    if (menuTapCurrent == 1 && page != 1) {
      var that = this
      loadMsgData(that);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: "全球鲜品",
      path: "/pages/index/index",
      imageUrl: "" /*图片比例500：400*/,
      success: function (res) {
        if (app.globalData.uid > 0) {
          wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/share',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (ress) {
              if (ress.data.data>0){
                wx.showToast({
                  title: '分享获赠' + ress.data.data +'积分',
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