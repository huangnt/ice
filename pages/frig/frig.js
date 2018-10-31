// pages/frig/frig.js
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        seleNum: 0,
        frigGoods: [],
        share: '',
        tishi: 'tishi',
        goods: '',
    },
    //判断选择中的商品有多少件
    selectList(e) {
        const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
        let frigGoods = this.data.frigGoods; // 获取冰箱列表
        let seleNum = this.data.seleNum //选中商品
        const selected = frigGoods[index].selected; // 获取当前商品的选中状态
        frigGoods[index].selected = !selected; // 改变状态
        if (frigGoods[index].selected) {
            seleNum += frigGoods[index].num;
        } else {
            seleNum -= frigGoods[index].num;
        }
        if (seleNum > 0) {
            var share = 'share'
            var tishi = ''
        } else {
            var share = ''
            var tishi = 'tishi'
        }
        this.setData({
            frigGoods: frigGoods,
            seleNum: seleNum,
            share: share,
            tishi: tishi
        });
    },
    //提示未选择商品不可送给朋友
    tishi() {
        wx.showToast({
            title: '请选择您所需提货的商品',
            icon: 'none',
            duration: 2000
        })
    },
    //减
    jian_tianchong(e) {
        const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
        let frigGoods = this.data.frigGoods; // 获取冰箱列表
        let seleNum = this.data.seleNum;
        if (frigGoods[index].num <= 1) {
            wx.showToast({
                title: '最小数量为1',
                icon: 'none',
                duration: 2000
            })
            return false;
        } else if (frigGoods[index].selected == true) {
            frigGoods[index].num--
                seleNum--
        } else {
            frigGoods[index].num--;
        }
        this.setData({
            frigGoods: frigGoods,
            seleNum: seleNum
        });
    },
    //加
    jia_tianchong(e) {
        const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
        let frigGoods = this.data.frigGoods; // 获取冰箱列表
        let seleNum = this.data.seleNum;
        let num = frigGoods[index].num
        if (frigGoods[index].frigStock <= num) {
            wx.showToast({
                title: '该商品冰箱库存仅剩' + frigGoods[index].frigStock + '件',
                icon: 'none',
                duration: 2000
            })
            return false;
        } else if (frigGoods[index].selected == true) {
            frigGoods[index].num++;
            seleNum++;
        } else {
            frigGoods[index].num++;
        }
        this.setData({
            frigGoods: frigGoods,
            seleNum: seleNum
        });
    },
    watchPassWord(e) {
        const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
        let frigGoods = this.data.frigGoods; // 获取冰箱列表
        var value = e.detail.value;
        let str = value.split('');
        if (str[0] == 0) {
            str.splice(0, 1);
            str.join("");
            frigGoods[index].num = str
            this.setData({
                frigGoods: frigGoods,
            })
        };
        if (e.detail.value == "") {
            frigGoods[index].num = 0;
            this.setData({
                frigGoods: frigGoods,
            })
        };

    },
    jump_pickdetails(e) {
        console.log(e)
        var cuT = e.currentTarget.dataset.case;
        // cuT如果等于1进入
        var that = this;
        if (that.data.seleNum == 0) {
            wx.showToast({
                title: '请选择您所需提货的商品',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        var frigGoods = that.data.frigGoods;
        var goods = ''
        for (var i = 0; i < frigGoods.length; i++) {
            if (frigGoods[i].selected == true) {
                if (goods.length == 0 || goods == '') {
                    goods = frigGoods[i].goods_id + '-' + frigGoods[i].num;
                } else {
                    goods += '/' + frigGoods[i].goods_id + '-' + frigGoods[i].num;
                }
            }
        }
        wx.navigateTo({
            url: '../ordinary/pickdetails/pickdetails?goods=' + goods + '&a_id=0&caseNum=' + cuT,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        // let _this = this;
        // let frigGoods = _this.data.frigGoods;
        // let seleNum =0;
        // for (let i = 0; i < frigGoods.length; i++) {
        //     if (frigGoods[i].num == 0) {
        //         frigGoods[i].selected = false;
        //     }
        //     if (frigGoods[i].selected == true) {
        //         seleNum += frigGoods[i].num;
        //     }
        //     console.log(frigGoods[i])
        // }

        // _this.setData({
        //     frigGoods: frigGoods,
        //     seleNum: 0
        // })
    },
    jump_details(event) {
        const index = event.currentTarget.dataset.index; // 获取data- 传进来的index
        let id = this.data.frigGoods[index].goods_id; // 获取冰箱列表
        wx.navigateTo({
            url: '../details/details?id=' + id,
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
        var that = this;
        that.setData({
            pagenum: 1,
            seleNum: 0
        })
        that.DataonLoad();
    },
    DataonLoad: function() {
        var that = this;
        console.log(app.globalData.uid)
        wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/user_fridge',
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
                        var l = that.data.frigGoods
                    }
                    for (var i = 0; i < res.data.data.length; i++) {
                        l.push(res.data.data[i])
                    }
                    that.setData({
                        frigGoods: l,
                        pagenum: that.data.pagenum + 1
                    });
                } else {
                    if (that.data.pagenum == 1) {
                        wx.showToast({
                            title: '冰箱空空如也',
                            icon: 'none',
                            duration: 2000
                        })
                        that.setData({
                            frigGoods: [],
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
    onShareAppMessage: function(res) {
        //     let _this = this;
        //     let frigGoods = this.data.frigGoods;
        //     var goods = ''
        //     var num = 0
        //     for (var i = 0; i < frigGoods.length; i++) {
        //       if (frigGoods[i].selected == true) {
        //         if (goods.length == 0 || goods == '') {
        //           goods = frigGoods[i].goods_id + '-' + frigGoods[i].num;
        //         } else {
        //           goods += '/' + frigGoods[i].goods_id + '-' + frigGoods[i].num;
        //         }
        //         num = num + frigGoods[i].num
        //       }
        //     }
        //     var timestamp = (new Date()).getTime();
        //     if (res.from === "button") {
        //       return {
        //         title: "领取礼品",
        //         path: "/pages/obtaingift/obtaingift?uid=" + app.globalData.uid + "&goods=" + goods + "&timestamp=" + timestamp,
        //         imageUrl: app.globalData.lpimg /*图片比例500：400*/ ,
        //         success: function(res) {
        //           var uid = app.globalData.uid
        //           wx.request({
        //             url: app.globalData.servsersip + 'api.php/wxfans/checkth',
        //             data: {
        //               goods: goods,
        //               uid: uid,
        //               timestamp: timestamp
        //             },
        //             method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //             header: { // 设置请求的 header
        //               'Content-Type': 'application/x-www-form-urlencoded'
        //             },
        //             success: function(res) {
        //               _this.setData({
        //                 pagenum: 1,
        //               })
        //               // _this.DataonLoad();
        //             },
        //             fail: function() {
        //               // fail
        //               wx.showToast({
        //                 title: '网络异常！',
        //                 duration: 2000
        //               });
        //             }
        //           })
        //         },
        //       }
        //     }

        //     console.log(res)


    }
})