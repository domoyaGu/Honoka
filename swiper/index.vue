<template>
	<view class="content">
		<view style="position: relative;width: 100%;height: 800rpx;">
			<swiper :autoplay="false"
				circular="true"
				previous-margin="60rpx"
				next-margin="60rpx"
				style="width: 100%;height: 800rpx;"
				@change="changeSwiper">
				<swiper-item
					v-for="(item, index) in questions"
					:key="index"
					class="swiper-container">
					<view class="swiper-item">
						<view :class="'item-container ' + (current === index ? 'item-chosed' : '')">
								{{ item.title }}
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="swiper-number">
				{{current + 1}} / {{ questions.length }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				questions: [
					{title: '111'},
					{title: '222'},
					{title: '333'},
					{title: '444'},
					{title: '555'}
				]
			}
		},
		onLoad() {
			
		},
		methods: {
			changeSwiper(e) {
				this.current = e.detail.current
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f3f3f3;
	}
	.content {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.swiper-container {
		display: inline-block;
		.swiper-item {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.item-container {
				background-color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 10rpx;
				width: 100%;
				height: 80%;
				transition: 0.5s;
			}
			.item-chosed {
				width: 80%;
				height: 100%;
			}
		}
	}
	.swiper-number {
		position: absolute;
		color: white;
		bottom: -50rpx;
		left: 0;
		width: 100%;
		text-align: center;
		z-index: 999;
	}
	
</style>
