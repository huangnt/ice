const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //   订单编号等同于onLoad: function (options)的options
    goodsNum: 132135465132,
    // allNumber 该订单的商品已评论的数
    allNumber: 0,
    hidden: true,
    //   订单的商品 
    buyGoods: []
  },
  // textarea在输入时
  textPut(e) {
    const eq = e.currentTarget.dataset.textareanum;
    let _this = this;
    let buyGoods = _this.data.buyGoods;
    let val = e.detail.value; //获取文字
    let cursor = e.detail.cursor; //文字长度
    buyGoods[eq].commentText = val;
    _this.setData({
      buyGoods: buyGoods,
    })
  },
  // textarea失去焦点的时候
  textOut(e) {
    const eq = e.currentTarget.dataset.textareanum;
    let _this = this;
    let buyGoods = _this.data.buyGoods;
    let val = e.detail.value; //获取文字
    let cursor = e.detail.cursor; //文字长度
    buyGoods[eq].commentText = val;
    _this.setData({
      buyGoods: buyGoods,
    })
  },
  // 上传图片
  uploadPictures(e) {
    const eq = e.currentTarget.dataset.picture;
    let _this = this;
    let buyGoods = _this.data.buyGoods;
    if (buyGoods[eq].beautyPat == "") {
      wx.chooseImage({
        count: 9,
        success: function(res) {
          let tempFiles = res.tempFiles;
          console.log(tempFiles)
          buyGoods[eq].beautyPat = tempFiles;
          _this.setData({
            buyGoods: buyGoods
          })
          console.log(buyGoods)
        },
      })
    } else {
      let num = 9 - buyGoods[eq].beautyPat.length;
      console.log(num)
      wx.chooseImage({
        count: num,
        success: function(res) {
          let tempFiles = res.tempFiles;
          for (let i = 0; i < tempFiles.length; i++) {
            tempFiles[i] = buyGoods[eq].beautyPat.push(tempFiles[i])
          }
          _this.setData({
            buyGoods: buyGoods
          })
        },
      })
    }
  },
  // 删除不需要的图片
  del(e) {
    const index = e.currentTarget.dataset.index;
    const eq = e.currentTarget.dataset.buy;
    let _this = this;
    let buyGoods = _this.data.buyGoods;
    wx.showModal({
      title: '提示',
      content: '是否删除该图片',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          let cc = buyGoods[eq].beautyPat.splice(index, 1);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
        _this.setData({
          buyGoods: buyGoods
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  // 评价
  scoresColor1: function(e) {
    let index = e.currentTarget.dataset.star;
    let level = e.currentTarget.dataset.level;
    let _this = this;
    let buyGoods = this.data.buyGoods;
    buyGoods[index].level = level;
    _this.setData({
      buyGoods: buyGoods
    });
  },
  // 提交
  subBtn(e) {
    const idx = e.currentTarget.dataset.idx;
    let _this = this;
    let buyGoods = this.data.buyGoods;
    let allNumber = this.data.allNumber;
    let order_type = buyGoods[idx].order_type
    if (buyGoods[idx].commentText == "") {
      wx.showToast({
        title: '请对该商品提些意见',
        icon: "none"
      })
    } else if (buyGoods[idx].level == 0) {
      wx.showToast({
        title: '请对该商品评分',
        icon: "none"
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认提交',
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            _this.setData({
              hidden: false
            })
            wx.request({
              url: app.globalData.servsersip + 'api.php/wxfans/order_evaluate',
              method: 'post',
              data: {
                order_id: _this.data.id,
                uid: app.globalData.uid,
                level: buyGoods[idx].level,
                content: buyGoods[idx].commentText,
                goods_id: buyGoods[idx].goods_id
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                //--init data
                var status = res.data.data;
                if (status > 0) {
                  if (buyGoods[idx].beautyPat.length > 0) {
                    var beautyPat = buyGoods[idx].beautyPat
                    for (var i = 0; i < beautyPat.length; i++) {
                      var num = i + 1
                      wx.uploadFile({
                        url: app.globalData.servsersip + 'api.php/Wxfans/upphoto',
                        filePath: beautyPat[i].path,
                        name: 'file',
                        formData: {
                          uid: app.globalData.uid,
                          id: status,
                          types: 1
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function(ress) {},
                        fail: function(res) {
                          console.log(res);
                          wx.showModal({
                            title: '提示',
                            content: "网络请求失败，请确保网络是否正常",
                            showCancel: false,
                            success: function(res) {
                              return false;
                            }
                          });
                        }
                      })
                    }
                  }
                  wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 2000,
                    mask: false,
                    success: function() {
                      buyGoods.splice(idx, 1);
                      wx.showToast({
                        title: '评论成功',
                        icon: "success"
                      })
                      _this.setData({
                        buyGoods: buyGoods,
                        hidden: true
                      })
                      if (_this.data.buyGoods.length == 0) {
                        if (order_type==3){
                          wx.navigateTo({
                            url: '../../us/pickupgoods/pickupgoods',
                          })
                        } else if (order_type == 2){
                          wx.navigateTo({
                            url: '../../us/collage/collage',
                          })
                        }else{
                          wx.navigateTo({
                            url: '../../us/orderform/orderform',
                          })
                        }
                        
                      }
                    }
                  })

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

          } else if (res.cancel) {
            console.log('用户点击取消')
          }

          _this.setData({
            buyGoods: buyGoods,
            allNumber: allNumber,
          });
          if (allNumber == buyGoods.length) {
            wx.navigateBack({
              delta: 1
            })
          }
        },
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var _this = this;
    console.log(id)
    wx.request({
      url: app.globalData.servsersip + 'api.php/wxfans/order_product',
      method: 'post',
      data: {
        id: id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        //--init data
        console.log(res)
        var status = res.data.data;
        var l = []
        for (var i = 0; i < res.data.data.length; i++) {
          l.push(res.data.data[i])
        }
        _this.setData({
          buyGoods: l,
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
    });
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
  onShareAppMessage: function() {

  }
})