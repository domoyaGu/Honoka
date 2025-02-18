<template>
	<view class="content"  :style="{height:windowHeight + 'rpx'}">
		<view class="swiper-body" :style="{height:swiperHeight + 'rpx'}">
			<swiper class="swiper-view" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500">
				<swiper-item v-for="(item,index) in deskTop['bannerList']['img']" :key="item" @click="bannerClick(index)">
					<image class="swiper-item-img" :src="item" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- <view class="board-view">
			<view class="laba-view">
				<image class="laba-image" src="../../../static/laba.png" mode=""></image>
			</view>
			<view class="text-view">
				注意：腊月、二月，剪发卡会员一律不可使用
			</view>
		</view> -->
		<view class="share-title-view">
			<view class="share-title">
				头疗系列
			</view>
		</view>
		<view class="share-body" :style="{height:shareHeght + 'rpx'}">
			<scroll-view scroll-x="true" style="width: 98%;height: 220rpx;">
				<view class="share-ctt">
					<view class="share-item" v-for="(item,index) in deskTop['shareList']['img']" :key="item">
						<image class="image-item" :src="item" mode="" @click="shareListClick(index)"></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="all-tea-title-view">
			<view class="all-tea-title">
				护发系列
			</view>
		</view>
		<scroll-view scroll-y="true" enable-flex="true" class="scroll-view" :style="{height:scrollHeight + 'rpx'}">
			<view class="tea-scroll-ctt">
				<view class="tea-item-view" v-for="(item,index) in deskTop['goodsList']['img']" :key="index" @click="teaListClick(index)">
					<image class="tea-img" :src="item" mode=""></image>
					<view class="tea-title">{{deskTop['goodsList']['title'][index]}}</view>
				</view>
			</view>
		</scroll-view>
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
				swiperHeight:0,
				scrollHeight:0,
				shareHeght:220,
				
				deskTop:{},
			}
		},
		onLoad(e) {
			if(e.refer==undefined || e.refer==''){
				uni.setStorageSync('user_refer','15133268315')
			}else{
				uni.setStorageSync('user_refer',e.refer)
			}
			_this = this
			_this.initView()
			_this.getDeskTop()
			// uni.setStorageSync('phone','15630805630')
			// uni.setStorageSync('login_stamp','1678771192')
		},
		
		onPullDownRefresh() {
			_this.getDeskTop()
		},
		methods: {
			bannerClick(index){
				if(_this.deskTop['bannerList']['action'][index]!=""){
					uni.navigateTo({
						url:"/pages/detail/detail?name=活动详情&url=" + _this.deskTop['bannerList']['action'][index]
					})
				}
			},
			shareListClick(index){
				if(_this.deskTop['shareList']['action'][index]!=""){
					uni.navigateTo({
						url:"/pages/detail/detail?name=产品详情&url=" + _this.deskTop['shareList']['action'][index]
					})
				}
			},
			teaListClick(index){
				if(_this.deskTop['goodsList']['action'][index]!=""){
					uni.navigateTo({
						url:"/pages/detail/detail?name=产品详情&url=" + _this.deskTop['goodsList']['action'][index]
					})
				}
			},
			initView(){
				let info = uni.getSystemInfoSync()
				_this.pixelRatio = _this.windowWidth / info.windowWidth
				_this.windowHeight = info.windowHeight * _this.pixelRatio
				_this.swiperHeight = 750/1024*400
				_this.scrollHeight = _this.windowHeight - _this.swiperHeight - _this.shareHeght - 10 - 50 - 50 - 10
			},
			getDeskTop(){
				uni.request({
					url:getApp().globalData.baseUrl +  "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:'get_UI'
					},
					success(e) {
						uni.stopPullDownRefresh()
						_this.deskTop = e.data
					}
				})
			},
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
		.swiper-body{
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			.swiper-view{
				width: 100%;
				.swiper-item-img{
					width: 750rpx;
					height: 100%;
				}
			}
		}
		// .board-view{
		// 	width: 730rpx;
		// 	height: 50rpx;
		// 	display: flex;
		// 	flex-direction: row;
		// 	align-items: center;
		// 	justify-content: flex-start;
		// 	background-color: #eaeaea;
		// 	.laba-view{
		// 		width: 50rpx;
		// 		height: 50rpx;
		// 		display: flex;
		// 		flex-direction: row;
		// 		align-items: center;
		// 		justify-content: center;
		// 		.laba-image{
		// 			width: 30rpx;
		// 			height: 30rpx;
		// 			-webkit-animation: btn-scale 2s infinite linear;
		// 			animation: btn-scale 2s infinite linear; 
		// 		}
		// 		@keyframes btn-scale {
		// 			0% {
		// 				-webkit-transform: scale(0.8,0.8);
		// 				transform: scale(0.8,0.8);
		// 			}
		// 			50% {
		// 				-webkit-transform: scale(1.2,1.2);
		// 				transform: scale(1.2,1.2);
		// 			}
		// 			100% {
		// 				-webkit-transform: scale(0.8,0.8);
		// 				transform: scale(0.8,0.8);
		// 			}
		// 		}
		// 	}
		// 	.text-view{
		// 		flex: 1;
		// 		height: 40rpx;
		// 		line-height: 40rpx;
		// 		text-align: center;
		// 		font-size: 30rpx;
		// 		color: #747474;
		// 	}
		// }
		.share-title-view{
			margin-top: 10rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			background-color: #e3e3e3;
			.share-title{
				width: 200rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				font-size: 34rpx;
				border-bottom: #000000 2rpx solid;
			}
		}
		.share-body{
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;
			margin-top: 10rpx;
			background-color: #e3e3e3;
			.share-ctt{
				height: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				white-space:nowrap;
				.share-item{
					width: 347rpx;
					height: 220rpx;
					margin-left: 10rpx;
					margin-right: 10rpx;
					.image-item{
						width: 347rpx;
						height: 220rpx;
						border-radius: 20rpx;
					}
				}
			}
		}
		.all-tea-title-view{
			margin-top: 10rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			background-color: #e3e3e3;
			.all-tea-title{
				width: 200rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				font-size: 34rpx;
				border-bottom: #000000 2rpx solid;
			}
		}
		.scroll-view{
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			margin-top: 10rpx;
			background-color: #eaeaea;
			.tea-scroll-ctt{
				width: 750rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				flex-shrink: 0;
				.tea-item-view{
					width: 355rpx;
					height: 310rpx;
					margin-left: 10rpx;
					margin-right: 10rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.tea-img{
						width: 355rpx;
						height: 265rpx;
						border-radius: 20rpx;
					}
					.tea-title{
						width: 230rpx;
						height: 45rpx;
						line-height: 45rpx;
						text-align: center;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
