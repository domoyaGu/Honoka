// pages/user/user.js
const app = getApp() // 全局APP
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		count: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.init()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	},
	/**
   * 初始化加载信息
   */
  async init () {
		const { openid, data, context } = await app.call({ name: 'get_user' })
		console.log(data[0].count)
		this.setData({
			count: data[0].count
		})
		console.log(this.data.count)
		wx.login({
			success: function (res) {
				if (res.code) {
				} else {
						console.log('获取用户登录态失败！' + res.errMsg)
				}
			 }
		});
	},
	addnumber() {
		this.setData({
			count: this.data.count + 1
		})
	}
})