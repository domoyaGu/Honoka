<template>
	<view class="content"  :style="{height:windowHeight + 'rpx'}">
		<scroll-view scroll-y="true"class="scroll-view" :style="{height:scrollHeight + 'rpx'}">
			<image class="image-view" :src="imgURL" mode="widthFix"></image>
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
				
				imgURL:"",
			}
		},
		onLoad(e) {
			_this = this
			_this.imgURL = e.url
			uni.setNavigationBarTitle({
				title:e.name
			})
			_this.initView()
		},
		methods: {
			initView(){
				let info = uni.getSystemInfoSync()
				_this.pixelRatio = _this.windowWidth / info.windowWidth
				_this.windowHeight = info.windowHeight * _this.pixelRatio
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
		.scroll-view{
			width: 100%;
			background-color: #e3e3e3;
			.image-view{
				width: 100%;
			}
		}
	}
</style>
