<template>
	<swiper :autoplay="false" interval="3000" circular="true" indicator-dots="true" indicator-color="#ffffff" indicator-active-color="#ff0000">
		<swiper-item
			v-for="(item, index) in list"
			:key="index"
		  class="swiper-item">
			<view class="item-container">
				<view
					:class="'swiper-common ' + (current == index ? 'swiper-chosen' : '')"
					:style="'width: ' + (width - 80) + 'rpx;'">
					<slot :data="item"></slot>
				</view>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		props: {
			width: {
				type: String,
				default: '600'
			},
			list:{
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				current: 0,
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-item {
		display: inline-block;
		height: 100%;
	}
	// 里面的内容
	.item-container {
		position: relative;
		width: 100%;
		height: 100%;
		.swiper-common {
			position: relative;
			top: 50rpx;
			background-color: #f3f3f3;
			height: 700rpx;
			transition: 0.5s;
			margin: 0 10rpx;
		}
		.swiper-chosen {
			top: 0;
			height: 800rpx;
		}
	}
</style>