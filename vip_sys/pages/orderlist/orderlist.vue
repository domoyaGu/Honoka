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
						<view class="item-title-date">
							消费时间
						</view>
						<view class="item-title-price">
							消费
						</view>
						<view class="item-title-user">
							使用者
						</view>
					</view>
					<view class="item-value-view" v-for="(item,index) in OrderList" :key="OrderList[index]['order_time']">
						<view class="item-value-date">
							{{OrderList[index]['order_time']}}
						</view>
						<view class="item-value-price">
							{{OrderList[index]['order_price']}}
						</view>
						<view class="item-value-user">
							{{OrderList[index]['card_user']}}
						</view>
					</view>
					<view class="item-value-view">
						<view class="item-wallet-title">
							余额
						</view>
						<view class="item-wallet-value">
							{{walletValue}}
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
				OrderList:[],
				walletValue:"",
			}
		},
		onLoad(e) {
			_this = this
			_this.getUserOrderList(e.vip_type,e.user_phone)
			if(e.vip_type=='hair_cut'){
				_this.pageTitle = '剪发卡消费记录'
			}else if(e.vip_type=='head_health'){
				_this.pageTitle = '头疗卡消费记录'
			}else if(e.vip_type=='shop_pay'){
				_this.pageTitle = '消费卡消费记录'
			}
		},
		methods: {
			initView(){
				let info = uni.getSystemInfoSync()
				_this.pixelRatio = info.windowWidth / _this.windowWidth
				_this.windowHeight = info.windowHeight * _this.pixelRatio
			},
			getUserOrderList(vipType,phone){
				uni.showLoading({
					title:'正在加载...'
				})
				uni.request({
					url:getApp().globalData.baseUrl + "API/userOrder/orderAPI.php",
					method:'POST',
					data:{
						type:'user_order_info',
						vip_type:vipType,
						user_phone:phone
					},
					success(e) {
						uni.hideLoading()
						if(e.data['result']==true){
							_this.OrderList = e.data['info']
							_this.getUserWallet(vipType,phone)
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
			},
			getUserWallet(vip_type,user_phone){
				let title = ""
				let unit = ""
				if(vip_type=='hair_cut'){
					title = "请输入剪发次数"
					unit = "次"
				}else if(vip_type=='head_health'){
					title = "请输入头疗次数"
					unit = "次"
				}else if(vip_type=='shop_pay'){
					title = "请输入充值金额"
					unit = "元"
				}
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:"POST",
					data:{
						type:"user_wallet",
						vip_type:vip_type,
						user_phone:user_phone
					},
					success(e) {
						if(e.data['result']==true){
							_this.walletValue = parseFloat(e.data['info']) + unit
						}else{
							uni.showModal({
								title:"警告",
								content:e.data['info'],
								showCancel:false
							})
						}
					}
				})
			},
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
						.item-title-date{
							width: 360rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-title-price{
							width: 180rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-title-user{
							width: 180rpx;
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
						.item-value-date{
							width: 360rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-value-price{
							width: 180rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-value-user{
							width: 180rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-wallet-title{
							width: 550rpx;
							margin-left: 5rpx;
							margin-right: 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							text-align: center;
							background-color: #00aa7f;
						}
						.item-wallet-value{
							width: 180rpx;
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
