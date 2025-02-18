<template>
	<scroll-view
		scroll-x class="swiper-container"
		:style="'width: ' + width + 'rpx'"
		:scroll-into-view="'swiper' + current"
		@scroll="scrollFunc">
		<view
			v-for="(item, index) in list"
			:key="index"
			:id="'swiper' + index"
		  class="swiper-item">
			<view class="item-container">
				<view
					:class="'swiper-common ' + (current == index ? 'swiper-chosen' : '')"
					:style="'width: ' + (width - 80) + 'rpx;'">
					<slot :data="item"></slot>
				</view>
			</view>
		</view>
	</scroll-view>
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
			scrollFunc(e) {
				console.log(e.detail);
				let cur = this.current;
				let pxWidth = this.$props.width / 2 - 20;
				let xPosition = e.detail.scrollLeft + pxWidth / 2;
				this.current = Math.floor((xPosition + 10) / pxWidth)
				// {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
			},
		}
	}
</script>

<style lang="scss" scoped>
.swiper-container {
	height: 800rpx;
	position: relative;
	white-space: nowrap;
	border: 1px solid white;
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
}
</style>
