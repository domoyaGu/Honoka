<template>
	<view class="content"  :style="{height:windowHeight + 'rpx'}">
		<view class="top-logo-view" :style="{height:windowHeight/4 + 'rpx'}">
			<image class="logo-image" :src="logoUrl" mode=""></image>
		</view>
		<view class="login-view">
			<input class="phone-input-box" maxlength="11" type="number" :disabled="phoneDisable" placeholder="请输入手机号" value="" v-model="phoneNum"/>
			<view class="sms-code-view">
				<input class="sms-input-box" maxlength="6" type="number" placeholder="请输入验证码" value="" v-model="SMSCode"/>
				<button class="get-sms-code-btn" :disabled="codeBtnDisable" type="default" @click="SMSClick">{{SMSBtnTitle}}</button>
			</view>
			<button class="login-btn" type="default" @click="loginClick">一键登录</button>
		</view>
	</view>
</template>

<script>
	var _this
	export default {
		data() {
			return {
				windowHeight: 0,
				windowWidth:750,
				pixelRatio:0,
				
				phoneNum:"",
				SMSCode:"",
				SMSBtnTitle:"验证码",
				phoneDisable:false,
				codeBtnDisable:false,
				clockID:-1,
				logoUrl:getApp().globalData.baseUrl + "/source/image/ui/logo.png"
			}
		},
		onLoad() {
			_this = this
			_this.initView()
		},
		onUnload() {
			clearInterval(_this.clockID)
			_this.clockID = -1
		},
		methods: {
			SMSClick(){
				if(_this.phoneNum==""){
					uni.showModal({
						title:"温馨提示",
						content:"手机号不可以为空，请先输入手机号",
						showCancel:false
					})
					return
				}
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:"POST",
					data:{
						type:"send_sms",
						user_phone:_this.phoneNum
					},
					success(e) {
						if(e.data.result==true){
							uni.showToast({
								title:"已发送",
								success() {
									_this.phoneDisable = true
									_this.codeBtnDisable = true
									_this.startClock()
								}
							})
						}else{
							_this.phoneDisable = false
							_this.codeBtnDisable = false
						}
					},
					fail(e) {
						_this.phoneDisable = false
						_this.codeBtnDisable = false
					}
				})
			},
			loginClick(){
				if(_this.phoneNum==""){
					uni.showModal({
						title:"温馨提示",
						content:"手机号不可以为空，请先输入手机号",
						showCancel:false
					})
					return
				}
				if(_this.SMSCode==""){
					uni.showModal({
						title:"温馨提示",
						content:"验证码不可以为空，请先输入手机号",
						showCancel:false
					})
					return
				}
				_this.checkCode(_this.SMSCode)
			},
			initView(){
				let info = uni.getSystemInfoSync()
				_this.pixelRatio = _this.windowWidth / info.windowWidth
				_this.windowHeight = info.windowHeight * _this.pixelRatio
				_this.swiperHeight = 750/1024*400
				_this.scrollHeight = _this.windowHeight - _this.swiperHeight - _this.shareHeght - 10 - 50 - 50 - 10
			},
			startClock(){
				let lastTime = 300
				_this.clockID = setInterval(function(){
					lastTime--
					_this.SMSBtnTitle = lastTime + '秒'
					if(lastTime<=0){
						_this.SMSBtnTitle = '验证码'
						_this.phoneDisable = false
						_this.codeBtnDisable = false
						clearInterval(_this.clockID)
						_this.clockID = -1
					}
				},1000)
			},
			checkCode(code){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:"POST",
					data:{
						type:"verify_sms",
						user_phone:_this.phoneNum,
						sms_code:code
					},
					success(e) {
						if(e.data.result==true){
							_this.userLogin(_this.phoneNum,uni.getStorageSync('user_refer'))
						}else{
							uni.showModal({
								title:'温馨提示',
								content:e.data.info,
								showCancel:false
							})
						}
					},
					fail(e) {
						uni.showModal({
							title:'温馨提示',
							content:"失败！未知错误",
							showCancel:false
						})
					}
				})
			},
			userLogin(phone,user_refer){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:"POST",
					data:{
						type:"login",
						user_phone:phone,
						user_refer:user_refer
					},
					success(e) {
						if(e.data.type=='login'){
							if(e.data.result==true){
								_this.updateUserState(_this.phoneNum)
							}else if(e.data.result==false){
								uni.showModal({
									title:"温馨提示",
									content:"当前帐号已在其他设备登录",
									showCancel:false
								})
							}
						}else if(e.data.type=='insert'){
							_this.updateUserState(_this.phoneNum)
						}else{
							uni.showToast({
								title:"登陆错误"
							})
						}
					},
					fail(e){
						console.log(e)
					}
				})
			},
			updateUserState(phone){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:"POST",
					data:{
						type:"update_user_state",
						user_phone:phone
					},
					success(e) {
						if(e.data.result==true){
							uni.setStorageSync('login_stamp',e.data['info']['time_stamp'])
							uni.setStorageSync('phone',phone)
							uni.showToast({
								title:"登陆成功"
							})
							uni.switchTab({
								url:"/pages/tabbar/mine/mine"
							})
						}else if(e.data.result==false){
							uni.showToast({
								title:"登陆失败"
							})
						}
					},
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		.top-logo-view{
			width: 750rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			padding-bottom: 50rpx;
			.logo-image{
				width: 200rpx;
				height: 200rpx;
				border-radius: 100rpx;
				border: #ffaa00 1rpx solid;
			}
		}
		.login-view{
			width: 500rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.phone-input-box{
				margin-top: 10rpx;
				margin-bottom: 10rpx;
				width: 500rpx;
				height: 70rpx;
				border: #000000 1rpx solid;
				border-radius: 35rpx;
				line-height: 70rpx;
				text-align: center;
				font-size: 32rpx;
			}
			.sms-code-view{
				margin-top: 10rpx;
				margin-bottom: 10rpx;
				width: 500rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				.sms-input-box{
					width: 250rpx;
					height: 70rpx;
					border: #000000 1rpx solid;
					border-radius: 35rpx;
					line-height: 70rpx;
					text-align: center;
					font-size: 32rpx;
				}
				.get-sms-code-btn{
					margin-left: 50rpx;
					width: 200rpx;
					height: 70rpx;
					border-radius: 35rpx;
					line-height: 70rpx;
					text-align: center;
					background-color: #ffaa00;
					color: #ffffff;
					font-size: 32rpx;
				}
			}
			.login-btn{
				margin-top: 80rpx;
				width: 500rpx;
				height: 70rpx;
				border-radius: 35rpx;
				line-height: 70rpx;
				text-align: center;
				font-size: 32rpx;
				background-color: #ffaa00;
				color: #ffffff;
			}
		}
	}
</style>
