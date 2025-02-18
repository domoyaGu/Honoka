export const shareMixins = {
    data () {
        return {
            shareData: {
                title: '我正在参与东东发艺会员享优惠活动,加入会员优惠多多',
                path: 'pages/tabbar/index/index',
                imageUrl: '',
            }
        }
    },
    //#ifdef MP-WEIXIN
    onShareAppMessage () {
        return {
            title: this.shareData.title,
            path: this.shareData.path + "?refer=" + uni.getStorageSync('phone'),
            imageUrl: this.shareData.imageUrl,
            // content: this.shareData.content,
            // desc: this.shareData.desc,
            success: res => {
                console.info(res)
            }
        }
    },
	onShareTimeline(){
		return {
		    title: this.shareData.title,
		    path: this.shareData.path + "?refer=" + uni.getStorageSync('phone'),
		    imageUrl: this.shareData.imageUrl,
		    // content: this.shareData.content,
		    success: res => {
		        console.info(res)
		    }
		}
	},
    //#endif
}