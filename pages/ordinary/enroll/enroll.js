const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // man为男，woman为女
        man: true,
        woman: false,
        date: [
            '2018', '01', '01'
        ],
        dates: '2018-01-01',
        gender: 1,
        lists: [],
        show: false, //判断显示隐藏
        contract: false, // 判断是否同意
        animationShow: {}
    },
    //   关闭｛模态框｝
    close() {
        let that = this;
        let show = this.data.show;
        that.setData({
            show: false
        })
        that.animation.bottom(-300).step();
        that.setData({
            animationShow: that.animation.export()
        })
    },
    // 是否勾选合同{}
    contractTrue() {
        let contract = this.data.contract;
        contract = !contract;
        this.setData({
            contract: contract
        })
    },
    select_man() {
        let man = this.data.man;
        let woman = this.data.woman;
        if (man == true) {
            return false;
        } else {
            man = true;
            woman = false;
        }
        this.setData({
            man: man,
            woman: woman,
            gender: 1
        })
    },
    select_woman() {
        let man = this.data.man;
        let woman = this.data.woman;
        if (woman == true) {
            return false;
        } else {
            man = false;
            woman = true;
        }
        this.setData({
            man: man,
            woman: woman
        })
    },
    // 年
    change(e) {
        console.log(e)
        let value = e.detail.value;
        let date = this.data.date;
        let str = value.split('-');
        date[0] = str[0];
        date[1] = str[1];
        date[2] = str[2];
        this.setData({
            date: date,
            dates: e.detail.value
        });
    },
    // 动画效果
    moveAnimation(e) {
        let that = this;
        let show = this.data.show;
        that.setData({
            show: true
        })
        that.animation.bottom(0).step();
        that.setData({
            animationShow: that.animation.export()
        })
    },
    // formSubmit:提交数据
    formSubmit(e) {
        // console.log(this.data.date);
        // console.log(e.detail.value);
        // console.log(e)
        let formNum = e.detail.target.dataset.formnum;
        let that = this;
        let contract = this.data.contract;
        let show = this.data.show;
        if (formNum == 1) {
            if (e.detail.value.tel.length == 0) {
                wx.showToast({
                    title: '亲，您还没填写手机号',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            } else if (e.detail.value.address.length == 0) {
                wx.showToast({
                    title: '亲，您还没填写地址',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            } else {
                that.setData({
                    show: true
                })
                that.animation.bottom(0).step();
                that.setData({
                    animationShow: that.animation.export()
                })
            }
        } else {
            if (contract == false) {
                wx.showToast({
                    title: '亲，还未勾选合同',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            } else {
                var data = [];
                var lists = that.data.lists
                data['tel'] = e.detail.value.tel
                data['uid'] = app.globalData.uid
                data['birthday'] = e.detail.value.birthday
                data['address'] = e.detail.value.address
                data['money'] = lists.money
                data['is_recharge'] = lists.is_recharge
                data['m_id'] = lists.m_id
                data['birthday'] = that.data.dates
                data['gender'] = that.data.gender
                data['openid'] = app.globalData.myopenid
                wx.request({
                    url: app.globalData.servsersip + 'api.php/Weixinpay/paym',
                    data: data,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function(res) {
                        if (res.data.msg == 'success') {
                            console.log(res.data.data);
                            var id = res.data.data.id
                            //console.log('调起支付');

                            if (res.data.data.goodscode == 1) {
                                wx.requestPayment({
                                    'timeStamp': res.data.data.timeStamp,
                                    'nonceStr': res.data.data.nonceStr,
                                    'package': res.data.data.package,
                                    'signType': res.data.data.signType,
                                    'paySign': res.data.data.paySign,
                                    'success': function(res) {
                                        wx.showToast({
                                            title: '付款成功',
                                            icon: 'success',
                                        });
                                        wx.switchTab({
                                            url: '../../member/member',
                                            success: function(e) {
                                                var page = getCurrentPages().pop();
                                                if (page == undefined || page == null) return;;
                                                page.onLoad();
                                            }
                                        })
                                    },
                                    'fail': function(res) {
                                        wx.showToast({
                                            title: '支付失败',
                                            icon: 'none',
                                        })
                                    },
                                    'complete': function(res) {
                                        //console.log(res);
                                    }
                                });
                            } else if (res.data.data.goodscode == 2) {
                                wx.switchTab({
                                    url: '../../member/member',
                                    success: function(e) {
                                        var page = getCurrentPages().pop();
                                        if (page == undefined || page == null) return;;
                                        page.onLoad();
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: '下单失败',
                                    icon: 'none',
                                    duration: 2000
                                });
                            }
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                            })
                        }
                    }
                });
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        wx.request({
            url: app.globalData.servsersip + 'api.php/wxfans/level_member',
            data: {
                uid: app.globalData.uid,
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { // 设置请求的 header
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                console.log(res.data.data)
                that.setData({
                    lists: res.data.data,
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
        this.animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'linear',
            delay: 0,
            transformOrigin: 'letf top 0',
            success: function(res) {
                console.log(res)
            }
        })
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