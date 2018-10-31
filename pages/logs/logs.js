Page({

    /**
     * 页面的初始数据
     */
    data: {
        gift_goods:[
            { 
                img:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2307358796,2488297066&fm=26&gp=0.jpg",
                name:"水果冰棍",
                money:190,
                num:2,
            },
            {
                img: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2892274819,2549962378&fm=11&gp=0.jpg",
                name: "水果冰棍",
                money: 190,
                num: 2,
            },
            {
                img: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2968700519,747207748&fm=11&gp=0.jpg",
                name: "水果冰棍",
                money: 190,
                num: 2,
            }
        ],
        region: ['广东省', '广州市', '海珠区'],
        customItem: '全部',
        formbtn: false,
        // 展示更多
        clickMore:false,
    },
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    translate() {
        let _this = this;
        let clickMore = _this.data.clickMore;
        clickMore = !clickMore;
        _this.setData({
            clickMore: clickMore,
        })
    },
    formSubmit: function (e) {
        wx.showModal({
            title: '领取礼物',
            content: '领取成功',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    wx.switchTab({
                        url: '../../index/index'
                    })
                }
            }
        })
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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