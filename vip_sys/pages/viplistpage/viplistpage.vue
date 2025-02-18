<template>
	<view class="content" :style="{height:windowHeight + 'rpx'}">
		<view class="page-title">
			<view class="title">
				{{pageTitle}}
			</view>
		</view>
		<view class="order-view" :style="{height:windowHeight - 110 + 'rpx'}">
			<scroll-view class="scroll-view" :style="{height:windowHeight - 110 + 'rpx'}" scroll-y="true" >
				<view class="scroll-body">
					<view class="item-title-view">
						<view class="item-title-serail">
							序号
						</view>
						<view class="item-title-name">
							姓名
						</view>
						<view class="item-title-phone">
							手机
						</view>
						<view class="item-title-wallet">
							余额
						</view>
					</view>
					<view class="item-value-view" v-for="(item,index) in vipList" :key="vipList[index]['order_time']">
						<view class="item-value-serail">
							{{index + 1}}
						</view>
						<view class="item-value-name">
							{{vipList[index]['user_mark']}}
						</view>
						<view class="item-value-phone">
							{{vipList[index]['user_phone']}}
						</view>
						<view class="item-value-wallet">
							{{vipList[index]['user_wallet']}}
						</view>
					</view>
				</view>
			</scroll-view>
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
				
				pageTitle:'',
				vipList:[]
			}
		},
		onLoad(e) {
			_this = this
			if(e.vip_type=='hair_cut'){
				_this.pageTitle = '剪发卡会员列表'
			}else if(e.vip_type=='head_health'){
				_this.pageTitle = '头疗卡会员列表'
			}else if(e.vip_type=='shop_pay'){
				_this.pageTitle = '消费卡会员列表'
			}
			_this.getUservipList(e.vip_type)
		},
		methods: {
			initView(){
				let info = uni.getSystemInfoSync()
				_this.pixelRatio = info.windowWidth / _this.windowWidth
				_this.windowHeight = info.windowHeight * _this.pixelRatio
			},
			getUservipList(vipType){
				uni.showLoading({
					title:'正在加载...'
				})
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:'get_host_vip',
						vip_type:vipType
					},
					success(e) {
						uni.hideLoading()
						if(e.data['result']==true){
							_this.vipList = e.data['info']
						}else{
							uni.showModal({
								title:"错误",
								content:"请求用户数据失败",
								showCancel:false,
								success() {
									uni.switchTab({
										url:'/pages/tabbar/mine/mine'
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		background-color: #dadada;
		.page-title{
			width: 100%;
			height: 100rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			.title{
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size: 36rpx;
				border-bottom: #000000 1rpx solid;
			}
		}
		.order-view{
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			background-color: #00ffff;
			margin-top: 10rpx;
			.scroll-view{
				width: 750rpx;
				background-color: #e3e3e3;
				.scroll-body{
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;
					.item-title-view{
						width: 750rpx;
						display: flex;
						flex-direction:row;
						align-items: center;
						justify-content: center;
						color: #ffffff;
						.item-title-serail{
							width: 110rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-title-name{
							width: 150rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-title-phone{
							width: 300rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-title-wallet{
							width: 150rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
					}
					.item-value-view{
						width: 750rpx;
						display: flex;
						flex-direction:row;
						align-items: center;
						justify-content: center;
						margin-top: 5rpx;
						margin-bottom: 5rpx;
						color: #ffffff;
						.item-value-serail{
							width: 110rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-value-name{
							width: 150rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-value-phone{
							width: 300rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-value-wallet{
							width: 150rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
					}
				}
			}
		}
	}
</style>
