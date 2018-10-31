const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //   勾选数量
    sellnum: 0,
    // 勾选后的价格
    totalPrice: 0,
    pagenum: 1,
    // 是否全选
    selectall: false,
    goodsList: []
  },
  //   跳页面
  jump_details(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let id = this.data.goodsList[index].goods_id;
    wx.navigateTo({
      url: '../details/details?id=' + id,
    })
  },
  select_fun(e) {
    let _this = this;
    const index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let sellnum = this.data.sellnum //选中商品
    const select = goodsList[index].select; // 获取当前商品的选中状态
    goodsList[index].select = !select; // 改变状态
    if (goodsList[index].select) {
      sellnum++;
    } else {
      sellnum--;
    }
    this.setData({
      goodsList: goodsList,
      sellnum: sellnum
    });
    this.getTotalPrice();
  },
  // 加
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let num = goodsList[index].num;
    let goodsnum = goodsList[index].goodsnum;
    num = num + 1;
    if (num > goodsnum) {
      wx.showToast({
        title: '该商品库存仅剩' + goodsnum + '件',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    goodsList[index].num = num;
    let total = parseFloat(goodsList[index].cost_price) * num;
    total = total.toFixed(2)
    goodsList[index].total = total
    this.setData({
      goodsList: goodsList
    });
    this.getTotalPrice();
    this.shopgoods(index);
  },
  // 减
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let num = goodsList[index].num;
    if (num <= 1) {
      wx.showToast({
        title: '数量最小值为1',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    num = num - 1;
    goodsList[index].num = num;
    let total = parseFloat(goodsList[index].cost_price) * num;
    total = total.toFixed(2)
    goodsList[index].total = total
    this.setData({
      goodsList: goodsList
    });
    this.getTotalPrice();
    this.shopgoods(index);
  },
  // 全选计算价格
  selectAll(e) {
    let selectall = this.data.selectall; // 是否全选状态
    selectall = !selectall;
    let goodsList = this.data.goodsList;
    let sellnum = this.data.sellnum

    for (let i = 0; i < goodsList.length; i++) {
      goodsList[i].select = selectall;
      if (goodsList[i].select) {
        sellnum = goodsList.length;
      } else {
        sellnum = 0;
      }
    }
    this.setData({
      selectall: selectall,
      goodsList: goodsList,
      sellnum: sellnum,
    });
    this.getTotalPrice(); // 重新获取总价
  },

  getTotalPrice() {
    let goodsList = this.data.goodsList; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < goodsList.length; i++) { // 循环列表得到每个数据
      if (goodsList[i].select) { // 判断选中才会计算价格
        total += goodsList[i].num * parseFloat(goodsList[i].cost_price); // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      goodsList: goodsList,
      totalPrice: total.toFixed(2)
    });
  },
  jump_order() {
    wx.navigateTo({
      url: '../ordinary/pages/order/order',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  jump_pay() {
    let sellnum = this.data.sellnum;
    if (sellnum == 0) {
      wx.showToast({
        title: '请勾选商品',
      })
    } else {
      let goodsList = this.data.goodsList;
      let sellnum = this.data.sellnum
      var goods=''
      for (let i = 0; i < goodsList.length; i++) {
        if (goodsList[i].select) {
          if (goods == '' || goods.length==0){
            goods = goodsList[i].goods_id + '-' + goodsList[i].num
          }else{
            goods += '/' + goodsList[i].goods_id + '-' + goodsList[i].num
          }
        }
      }
      wx.navigateTo({
        url: '../receive/fillin/fillin?goods=' + goods+'&a_id=0',
      })
    }

  },
  jump_launch() {
    let sellnum = this.data.sellnum;
    if (sellnum == 0) {
      wx.showToast({
        title: '请勾选商品',
      })
    } else {
      let goodsList = this.data.goodsList;
      let sellnum = this.data.sellnum
      var goods = ''
      for (let i = 0; i < goodsList.length; i++) {
        if (goodsList[i].select) {
          if (goods == '' || goods.length == 0) {
            goods = goodsList[i].goods_id + '-' + goodsList[i].num
          } else {
            goods += '/' + goodsList[i].goods_id + '-' + goodsList[i].num
          }
        }
      }
      wx.navigateTo({
        url: '../incollage/incollage?goods=' + goods + '&a_id=0',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTotalPrice();
    var that = this;
    that.setData({
      pagenum: 1,
    })
    that.DataonLoad();
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
  DataonLoad: function() {
    var that = this;
    console.log(app.globalData.uid)
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/shopcart',
      data: {
        pagenum: that.data.pagenum,
        uid: app.globalData.uid,
        //   uid: 8
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          if (that.data.pagenum == 1) {
            var l = []
          } else {
            var l = that.data.goodsList
          }
          for (var i = 0; i < res.data.data.length; i++) {
            l.push(res.data.data[i])
          }
          that.setData({
            goodsList: l,
            pagenum: that.data.pagenum + 1
          });
        } else {
          if (that.data.pagenum == 1) {
            wx.showToast({
              title: '购物车空空如也',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              goodsList: [],
              pagenum: that.data.pagenum + 1
            });
          } else {
            wx.showToast({
              title: '已加载完全部',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              pagenum: that.data.pagenum + 1
            });
          }
        }
        // that.setData({
        //   collectList: collectList,
        // })
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
  shopgoods(e) {
    let goodsList = this.data.goodsList;
    let num = goodsList[e].num;
    let id = goodsList[e].id;
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/addshopcart',
      data: {
        num: num,
        id: id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {},
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
    this.DataonLoad();
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