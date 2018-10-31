Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [
            {
                img: '../../img/ice2.jpg', name: "TCO TOP香草味冰淇淋", money: 60, num: 2,
            },
            {
                img: '../../img/ice1.jpg', name: "TCO TOP香草味冰淇淋", money: 60, num: 2,
            },
            {
                img: '../../img/ice2.jpg', name: "TCO TOP香草味冰淇淋", money: 60, num: 2,
            },
            {
                img: '../../img/ice1.jpg', name: "TCO TOP香草味冰淇淋", money: 60, num: 2,
            }
        ],
        seemode: false,
        userlist: [
            { img: 'http://img5.imgtn.bdimg.com/it/u=1934952861,3453579486&fm=27&gp=0.jpg', name: "" },
            { img: 'http://img5.imgtn.bdimg.com/it/u=1934952861,3453579486&fm=27&gp=0.jpg', name: "" },
            { img: 'http://img5.imgtn.bdimg.com/it/u=1934952861,3453579486&fm=27&gp=0.jpg', name: "" },
        ]
    },
    //   更多
    mode() {
        let seemode = this.data.seemode;
        seemode = !seemode;
        this.setData({
            seemode: seemode
        })
    },
    //付款
    payment() {
        wx.showToast({
            title: '付款中',
            icon: 'loading',
            success: function (res) {
                wx.showToast({
                    title: '支付完成',
                    icon: 'success',
                    success: function (res) {
                        wx.redirectTo({
                            url: '../payment/payment',
                        })
                    },
                })
            },
        })
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
    onShareAppMessage: function () {

    }
})