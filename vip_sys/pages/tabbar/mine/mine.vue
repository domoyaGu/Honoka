<template>
	<view class="content" :style="{height:windowHeight + 'rpx'}">
		<view class="swiper-body" :style="{height:swiperHeight + 'rpx'}">
			<swiper class="swiper-view" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500">
				<swiper-item v-for="(item,index) in bannerList['img']" :key="item" @click="bannerClick(index)">
					<image class="swiper-item-img" :src="item" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- <view class="board-view">
			<view class="laba-view">
				<image class="laba-image" src="../../../static/laba.png" mode=""></image>
			</view>
			<view class="text-view">
				注意：腊、二月，剪发卡会员一律不可使用
			</view>
		</view> -->
		<view class="account-option">
			<view class="item-view" v-for="(item,index) in accountOpt" :key="item['title']" @click="accountClick(index)">
				<image class="image" :src="item['img_url']" mode=""></image>
				<view class="title">
					{{item['title']}}
				</view>
			</view>
		</view>
		<view class="account-detial" :style="{height:accountHeight + 'rpx'}">
			<scroll-view class="scroll-view" :style="{height:accountHeight + 'rpx'}" scroll-y="true" >
				<view class="scroll-content">
					<view class="item-view"  v-for="(item,key,index) in optionList" :key="item">
						<view class="item-title">
							{{key}}
						</view>
						<view class="item-value">
							{{item}}
						</view>
					</view>
					<view class="item-view" v-if="userType=='东东发艺会员' && optionIndex!=0">
						<view class="item-title">
							消费记录
						</view>
						<view class="item-value" style="text-decoration:underline;color: blue;" @click="userOrderClick(optionIndex)">
							点击查看
						</view>
					</view>
					<view class="qr-code-view"  v-if="userType=='东东发艺会员' && optionIndex!=0">
						<view class="qr-show-title">
							码上享会员
						</view>
						<image class="qr-code" :src="codeUrl" mode=""></image>
					</view>
					<view class="item-view" v-if="userType=='店主'">
						<view class="item-title">
							会员列表
						</view>
						<view class="item-value" style="text-decoration:underline;color: blue;" @click="showVipList">
							点击查看
						</view>
					</view>
					<view class="abort-us-view" v-if="optionIndex==0" @click="surportClick">
						<view class="surport-title">
							点击获取技术支持
						</view>
						<view class="surport-com">
							曲阳脑元素网络科技有限公司
						</view>
					</view>
					<view class="logout-view" v-if="userType=='店主' || (userType!='店主' && optionIndex==0)">
						<view class="logout-action" @click="logoutClick">
							退出登录
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	var _this
	import AES from '@/common/ar-aes.js'
	import Units from '@/common/Units.js'
	export default {
		data() {
			return {
				windowHeight: 0,
				windowWidth:750,
				pixelRatio:0,
				swiperHeight:0,
				accountHeight:0,
				detailHeight:0,
				
				bannerList:{},
				userType:'',
				accountOpt:[],
				optionList:{},
				optionIndex:0,
				codeUrl:'',
				shopName:'',
				userMark:'',
				vipState:[],
			}
		},
		onLoad() {
			_this = this
			_this.shopName = "东东发艺"
			_this.initView()
			_this.getBannerList()
		},
		onShow() {
			_this.checkLogin()
		},
		onPullDownRefresh() {
			_this.checkLogin()
		},
		methods: {
			bannerClick(index){
				if(_this.deskTop['bannerList']['action'][index]!=""){
					uni.navigateTo({
						url:"/pages/detail/detail?name=活动详情&url=" + _this.deskTop['bannerList']['action'][index]
					})
				}
			},
			accountClick(index){
				_this.optionIndex = index
				if(_this.optionIndex==0){
					_this.optionList = {}
					uni.showLoading({
						title:'正在加载...'
					})
					if(_this.userType !='店主'){
						_this.getUserInfo(uni.getStorageSync('phone'))
					}else{
						_this.getHostInfo(uni.getStorageSync('phone'))
					}
				}else if(_this.optionIndex==1){
					if(_this.userType !='店主'){
						if(!_this.vipState[_this.optionIndex - 1]){
							uni.showModal({
								title:"温馨提示",
								content:"您尚未未开通剪发卡，请先开通剪发卡",
								showCancel:false
							})
							return
						}
						_this.optionList = {}
						uni.showLoading({
							title:'正在加载...'
						})
						_this.getUserVipInfo('hair_cut',uni.getStorageSync('phone'))
					}else{
						_this.setOpenData()
					}
				}else if(_this.optionIndex==2){
					if(_this.userType !='店主'){
						if(!_this.vipState[_this.optionIndex - 1]){
							uni.showModal({
								title:"温馨提示",
								content:"您尚未未开通头疗卡，请先开通头疗卡",
								showCancel:false
							})
							return
						}
						_this.optionList = {}
						uni.showLoading({
							title:'正在加载...'
						})
						_this.getUserVipInfo('head_health',uni.getStorageSync('phone'))
					}else{
						_this.setCheckData()
					}
				}else if(_this.optionIndex==3){
					if(_this.userType !='店主'){
						if(!_this.vipState[_this.optionIndex - 1]){
							uni.showModal({
								title:"温馨提示",
								content:"您尚未未开通消费卡，请先开通消费卡",
								showCancel:false
							})
							return
						}
						_this.optionList = {}
						uni.showLoading({
							title:'正在加载...'
						})
						_this.getUserVipInfo('shop_pay',uni.getStorageSync('phone'))
					}else{
						uni.showActionSheet({
							title:"请选择核销方式",
							itemList:["扫一扫","手机号"],
							success(e) {
								if(e.tapIndex==0){
									_this.scanQRCode()
								}else{
									uni.showModal({
										title:"请输入手机号",
										editable:true,
										placeholderText:"请输入会员手机号",
										success(e) {
											if(e.confirm==true){
												let user_phone = e.content
												if(Units.isNumber(user_phone) && user_phone!="" && user_phone.length==11){
													_this.writeOffOrderByPhone(user_phone)
												}else{
													uni.showToast({
														title:"手机号格式错误..."
													})
												}
											}
										}
									})
								}
							}
						})
					}
				}else if(_this.optionIndex==4){
					uni.navigateTo({
						url:"/pages/pagemanager/pagemanager"
					})
				}
			},
			userOrderClick(optionIndex){
				let vipType = ''
				if(_this.optionIndex==1){
					vipType = 'hair_cut'
				}else if(_this.optionIndex==2){
					vipType = 'head_health'
				}else if(_this.optionIndex==3){
					vipType = 'shop_pay'
				}
				uni.navigateTo({
					url:'/pages/orderlist/orderlist?vip_type=' + vipType + '&user_phone=' + uni.getStorageSync('phone')
				})
			},
			showVipList(){
				uni.showActionSheet({
					title:"请选择会员类型",
					itemList:['剪发卡','头疗卡','消费卡'],
					success(e) {
						let type = ['hair_cut','head_health','shop_pay']
						uni.navigateTo({
							url:'/pages/viplistpage/viplistpage?vip_type=' + type[e.tapIndex]
						})
					}
				})
			},
			initView(){
				let info = uni.getSystemInfoSync()
				_this.pixelRatio = info.windowWidth / _this.windowWidth
				_this.windowHeight = info.windowHeight * _this.pixelRatio
				_this.swiperHeight = 400*750/1024
				_this.accountHeight = _this.windowHeight - _this.swiperHeight - 160 - 20
				_this.detailHeight = _this.accountHeight - 80 - 20//_this.windowHeight - _this.swiperHeight - 200 - 80 - 30
			},
			getBannerList(){
				uni.request({
					url:getApp().globalData.baseUrl +  "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:'get_UI'
					},
					success(e) {
						_this.bannerList = e.data['bannerList']
					}
				})
			},
			setCheckData(){
				uni.showActionSheet({
					title:'请选择会员类型',
					itemList:['剪发卡','头疗卡','消费卡'],
					success(e) {
						let type = ['hair_cut','head_health','shop_pay']
						let vip_type = type[e.tapIndex]
						uni.showModal({
							title:'请输入会员手机号',
							editable:true,
							placeholderText:'请输入会员手机号',
							confirmText:'查询',
							success(e) {
								if(e.confirm==true){
									let content = e.content
									if(Units.isNumber(content) && content.length==11){
										uni.navigateTo({
											url:'/pages/orderlist/orderlist?vip_type=' + vip_type + '&&user_phone=' + content
										})
									}else{
										uni.showToast({
											title:'手机号输入错误...'
										})
									}
								}
							}
						})
					}
				})
			},
			setOpenData(){
				uni.showActionSheet({
					title:'请选择会员类型',
					itemList:['剪发卡','头疗卡','消费卡'],
					success(e) {
						let type = ['hair_cut','head_health','shop_pay']
						let vip_type = type[e.tapIndex]
						if(e.tapIndex<2){
							_this.openTypeOfCountVip(vip_type)
						}else{
							_this.openShopPayVip(vip_type)
						}
					}
				})
			},
			logoutClick(){
				uni.setStorageSync('phone','')
				uni.setStorageSync('login_stamp','')
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				})
			},
			// =============以下是按顺序的登录过程===================
			checkLogin(){
				let phone = uni.getStorageSync('phone')
				let timeStamp = uni.getStorageSync('login_stamp')
				if(phone=="" || timeStamp==""){
					uni.showModal({
						title:"温馨提示",
						content:"您尚未登录请先登录，是否立即登录？",
						confirmText:"立即登录",
						cancelText:"暂不登录",
						success(e) {
							if(e.confirm==true){
								uni.navigateTo({
									url:"/pages/login/login"
								})
							}else if(e.cancel==true){
								uni.switchTab({
									url:"/pages/tabbar/index/index"
								})
							}
						}
					})
				}else{
					_this.checkCookie(phone,timeStamp)
				}
			},
			checkCookie(phone,stamp){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:"POST",
					data:{
						type:"check_cookie",
						user_phone:phone, 
						time_stamp:stamp
					},
					success(e) {
						if(e.data.result==false){
							uni.showModal({
								title:"温馨提示",
								content:"账号未登录或登录已过期，请重新登录",
								showCancel:false,
								success() {
									uni.setStorageSync('phone','')
									uni.setStorageSync('login_stamp','')
									uni.navigateTo({
										url: '/pages/login/login',
									});
								}
							})
						}else{
							_this.getUserInfo(uni.getStorageSync('phone'))
						}
					},
				})
			},
			getAccountOpt(){
				uni.request({
					url:getApp().globalData.baseUrl +  "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:'get_account_opt'
					},
					success(e) {
						if(_this.userType=="店主"){
							_this.accountOpt = e.data['host']
						}else{
							_this.accountOpt = e.data['user']
						}
					}
				})
			},
			getUserInfo(phone){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:'check_user',
						user_phone:phone
					},
					success(e) {
						uni.stopPullDownRefresh()
						uni.hideLoading()
						if(e.data['result']==true){
							_this.userType = e.data['info']['用户类型']
							if(_this.userType!='店主'){
								_this.optionList = e.data['info']
								_this.userMark = _this.optionList['用户姓名']
								if(_this.optionList['剪发卡']=='已开通'){
									_this.vipState[0] = true
								}else{
									_this.vipState[0] = false
								}
								if(_this.optionList['头疗卡']=='已开通'){
									_this.vipState[1] = true
								}else{
									_this.vipState[1] = false
								}
								if(_this.optionList['消费卡']=='已开通'){
									_this.vipState[2] = true
								}else{
									_this.vipState[2] = false
								}
							}else{
								_this.getHostInfo(uni.getStorageSync('phone'))
							}
							_this.getAccountOpt()
						}else{
							uni.showModal({
								title:'错误！',
								content:'获取用户信息失败，点击重试',
								showCancel:false,
								success() {
									_this.getUserInfo(uni.getStorageSync('phone'))
								}
							})
						}
					}
				})
			},
			getHostInfo(phone){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:'check_host',
						user_phone:phone
					},
					success(e) {
						uni.hideLoading()
						if(e.data['result']==true){
							_this.userType = e.data['info']['用户类型']
							_this.optionList = e.data['info']
							_this.userMark = _this.optionList['用户姓名']
							_this.getAccountOpt()
						}else{
							uni.showModal({
								title:'错误！',
								content:'获取用户信息失败，点击重试',
								showCancel:false,
								success() {
									_this.getHostInfo(uni.getStorageSync('phone'))
								}
							})
						}
					}
				})
			},
			getUserVipInfo(vipType,phone){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:'get_user_vip_info',
						vip_type:vipType,
						user_phone:phone
					},
					success(e) {
						if(e.data['result']==true){
							uni.hideLoading()
							_this.userType = e.data['info']['用户类型']
							_this.optionList = e.data['info']
							let wallet = _this.optionList['余额']
							if(_this.optionIndex==1){
								wallet = parseInt(wallet.split('次')[0])
								_this.getWriteOffQR('hair_cut',wallet)
							}else if(_this.optionIndex==2){
								wallet = parseInt(wallet.split('次')[0])
								_this.getWriteOffQR('head_health',wallet)
							}if(_this.optionIndex==3){
								wallet = parseFloat(wallet.split('元')[0])
								_this.getWriteOffQR('shop_pay',wallet)
							}
						}else{
							uni.showModal({
								title:'错误！',
								content:'获取用户信息失败,请稍后再试',
								showCancel:false,
							})
						}
					}
				})
			},
			getWriteOffQR(vipType,QrCount){
				let data = {
								type:"join_code",
								shop_name:_this.shopName,
								user_mark:_this.userMark,
								user_phone:uni.getStorageSync('phone'),
								vip_type:vipType,
								qr_count:QrCount
							}
					data = JSON.stringify(data)
				let r = AES.AES.encrypt(data,'1234567891234567','1234567891234567')
				uni.request({
					url:getApp().globalData.baseUrl + "API/QRCode/codeAPI.php",
					data:{
						type:"mk_vip_qr",
						data:r
					},
					method:"POST",
					success(e) {
						_this.codeUrl = e.data
					},
					fail(e) {
						uni.showToast({
							title:"请求失败！"
						})
					}
				})
			},
			openUserVip(vip_type,user_phone,user_wallet,user_mark){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:'POST',
					data:{
						type:vip_type,
						user_phone:user_phone,
						user_wallet:user_wallet,
						user_mark:user_mark
					},
					success(e) {
						if(e.data['result']==true){
							uni.showModal({
								title:"恭喜",
								content:e.data['info'],
								showCancel:false
							})
						}else{
							if(e.data['info']=='已开通'){
								uni.showModal({
									title:"警告",
									content:'该用户已经是该类型的会员，是否追加开通',
									confirmText:'继续开通',
									success(e) {
										if(e.confirm==true){
											_this.getUserWalletThenReg(vip_type,user_phone,user_wallet)
										}
									}
								})
							}
						}
					}
				})
			},
			openTypeOfCountVip(vip_type){
				uni.showModal({
					title:'请输入手机号',
					editable:true,
					placeholderText:'请输入会员手机号',
					confirmText:'下一步',
					success(e) {
						if(e.confirm==true){
							let user_phone = e.content
							if(Units.isNumber(user_phone) && user_phone.length==11){
								uni.showModal({
									title:'请输入次数',
									editable:true,
									placeholderText:'请输入次数',
									confirmText:'下一步',
									success(e) {
										if(e.confirm==true){
											let user_wallet = e.content
											if(Units.isNumber(user_wallet)){
												user_wallet = parseFloat(user_wallet)
												uni.showModal({
													title:'请输入备注',
													editable:true,
													placeholderText:'请输入会员姓名',
													confirmText:'确认开通',
													success(e) {
														if(e.confirm==true){
															let user_mark = e.content
															if(user_mark==""){
																uni.showToast({
																	title:'姓名输入错误'
																})
															}else{
																_this.openUserVip(vip_type,user_phone,user_wallet,user_mark)
															}
														}
													}
												})
											}
										}
									}
								})
							}else{
								uni.showToast({
									title:'手机号输入错误...'
								})
							}
						}
					}
				})
			},
			openShopPayVip(vip_type){
				uni.showModal({
					title:'请输入手机号',
					editable:true,
					placeholderText:'请输入会员手机号',
					confirmText:'下一步',
					success(e) {
						if(e.confirm==true){
							let user_phone = e.content
							if(Units.isNumber(user_phone) && user_phone.length==11){
								uni.showModal({
									title:'请输入金额',
									editable:true,
									placeholderText:'请输入充值金额',
									confirmText:'下一步',
									success(e) {
										if(e.confirm==true){
											let user_wallet = e.content
											if(Units.isNumber(user_wallet)){
												user_wallet = parseFloat(user_wallet)
												uni.showModal({
													title:'请输入备注',
													editable:true,
													placeholderText:'请输入会员姓名',
													confirmText:'确认开通',
													success(e) {
														if(e.confirm==true){
															let user_mark = e.content
															if(user_mark==""){
																uni.showToast({
																	title:'姓名输入错误'
																})
															}else{
																_this.openUserVip(vip_type,user_phone,user_wallet,user_mark)
															}
														}
													}
												})
											}
										}
									}
								})
							}else{
								uni.showToast({
									title:'手机号输入错误...'
								})
							}
						}
					}
				})
			},
			scanQRCode(){
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ["qrCode"],
					success(e) {
						let res = e.result
						res = AES.AES.decrypt(res,'1234567891234567','1234567891234567')
						res = JSON.parse(res)
						let type = res.vip_type
						let shop_name = res.shop_name
						let user_phone = res.user_phone
						let qr_count = res.qr_count
						let user_mark = res.user_mark
						if(shop_name!=_this.shopName){
							uni.showModal({
								title:"错误！",
								content:"此二维码不是本店会员专用二维码！",
								showCancel:false
							})
							return
						}
						
						if(type=="hair_cut"){
							uni.showModal({
								title:"剪发卡核销",
								editable:true,
								placeholderText:"请输入用卡人姓名/备注",
								confirmText:"立即核销",
								success(e) {
									if(e.confirm==true){
										let user_mark = e.content
										if(user_mark==''){
											_this.mkWriteOffOrder(type,user_phone,qr_count,_this.userMark)
										}else{
											_this.mkWriteOffOrder(type,user_phone,qr_count,user_mark)
										}
									}
								}
							})
						}else if(type=="head_health"){
							uni.showModal({
								title:"头疗卡核销",
								editable:true,
								placeholderText:"请输入用卡人姓名/备注",
								confirmText:"立即核销",
								success(e) {
									if(e.confirm==true){
										let user_mark = e.content
										if(user_mark==''){
											_this.mkWriteOffOrder(type,user_phone,qr_count,_this.userMark)
										}else{
											_this.mkWriteOffOrder(type,user_phone,qr_count,user_mark)
										}
									}
								}
							})
						}else if(type=="shop_pay"){
							uni.showModal({
								title:"消费卡核销第一步",
								editable:true,
								placeholderText:"请输入本次消费金额",
								confirmText:"下一步",
								success(e) {
									if(e.confirm==true){
										let user_wallet = e.content
										user_wallet = parseFloat(user_wallet)
										if(Units.isNumber(user_wallet)){
											uni.showModal({
												title:"消费卡核销第二步",
												editable:true,
												placeholderText:"请输入用卡人姓名/备注",
												confirmText:"立即核销",
												success(e) {
													if(e.confirm==true){
														let user_mark = e.content
														if(user_mark==''){
															_this.mkWriteOffOrder(type,user_phone,qr_count,_this.userMark,user_wallet)
														}else{
															_this.mkWriteOffOrder(type,user_phone,qr_count,user_mark,user_wallet)
														}
													}
												}
											})
										}else{
											uni.showToast({
												title:"金额输入错误..."
											})
										}
									}
								}
							})
						}
					},
				})
			},
			mkWriteOffOrder(vip_type,user_phone,qr_count,card_user,total_fee){
				uni.showLoading({
					title:"正在核销..."
				})
				uni.request({
					url:getApp().globalData.baseUrl + "API/userOrder/orderAPI.php",
					method:'POST',
					data:{
						type:vip_type,
						user_phone:user_phone,
						qr_count:qr_count,
						card_user:card_user,
						total_fee:total_fee
					},
					success(e) {
						uni.hideLoading()
						if(e.data['result']==true){
							uni.showModal({
								title:'核销成功',
								content:e.data['info'],
								showCancel:false,
								success() {
									if(vip_type!='shop_pay'){
										if(qr_count==1){
											_this.closeVIP(vip_type,user_phone)
										}
									}else{
										if(qr_count-total_fee==0){
											_this.closeVIP(vip_type,user_phone)
										}
									}
								}
							})
						}else{
							uni.showModal({
								title:'核销失败！',
								content:e.data['info'],
								showCancel:false,
							})
						}
					}
				})
			},
			writeOffOrderByPhone(user_phone){
				uni.showActionSheet({
					title:"请选择会员类型",
					itemList:["剪发卡","头疗卡","消费卡"],
					success(e) {
						let vipArray = ['hair_cut','head_health','shop_pay']
						_this.getUserWallet(vipArray[e.tapIndex],user_phone)
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
					title = "请输入消费金额"
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
							uni.showModal({
								title:"当前余额" + e.data['info'] + unit,
								editable:true,
								placeholderText:title,
								success(e) {
									if(e.confirm==true){
										if(e.content!="" && Units.isNumber(e.content)){
											let write_off_fee = parseFloat(e.content)
											uni.showModal({
												title:"请输入姓名",
												editable:true,
												placeholderText:"为空时即为所有者",
												success(e) {
													if(e.confirm==true){
														if(e.content!=""){
															_this.userMark = e.content
														}
														_this.mkOrderByPhone(vip_type,user_phone,write_off_fee,_this.userMark)
													}
												}
											})
										}
									}
								}
							})
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
			mkOrderByPhone(vip_type,user_phone,write_off_fee,card_user){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userOrder/orderAPI.php",
					method:"POST",
					data:{
						type:"mk_order_by_phone",
						vip_type:vip_type,
						user_phone:user_phone,
						write_off_fee:write_off_fee,
						card_user:card_user
					},
					success(e) {
						if(e.data['result']){
							uni.showModal({
								title:"核销成功",
								content:e.data['info'],
								showCancel:false,
							})
						}else{
							uni.showModal({
								title:"核销失败",
								content:e.data['info'],
								showCancel:false,
							})
						}
					}
				})
			},
			getUserWalletThenReg(vip_type,user_phone,user_wallet){
				let title = ""
				if(vip_type=='hair_cut'){
					title = "请输入剪发次数"
				}else if(vip_type=='head_health'){
					title = "请输入头疗次数"
				}else if(vip_type=='shop_pay'){
					title = "请输入充值金额"
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
							user_wallet = parseFloat(e.data['info']) + user_wallet
							_this.reOpenVip(vip_type,user_phone,user_wallet)
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
			reOpenVip(vip_type,user_phone,user_wallet){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userAPI/userAPI.php",
					method:"POST",
					data:{
						type:"re_open_vip",
						vip_type:vip_type,
						user_phone:user_phone,
						user_wallet:user_wallet
					},
					success(e) {
						if(e.data['result']==true){
							uni.showModal({
								title:"续开成功！",
								content:e.data['info'],
								showCancel:false
							})
						}else{
							uni.showModal({
								title:"失败！",
								content:e.data['info'],
								showCancel:false
							})
						}
					}
				})
			},
			closeVIP(vip_type,user_phone){
				uni.request({
					url:getApp().globalData.baseUrl + "API/userOrder/orderAPI.php",
					method:"POST",
					data:{
						type:"close_vip",
						vip_type:vip_type,
						user_phone:user_phone
					},
					success(e) {
						uni.showModal({
							title:"温馨提示",
							content:"该会员次数已用完，" + e.data['info'],
							showCancel:false
						})
					}
				})
			},
			surportClick(){
				uni.showModal({
					title:"温馨提示",
					content:"本小程序由曲阳脑元素网络科技有限公司提供技术支持，本公司专业开发微信、抖音、快手等平台小程序，以及app,H5网页等，如有需求请致电：15188770006或15630805630",
					showCancel:false
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
		.swiper-body{
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			background-color: #55ff7f;
			.swiper-view{
				width: 100%;
				.swiper-item-img{
					width: 750rpx;
					height: 100%;
				}
			}
		}
		.board-view{
			width: 730rpx;
			height: 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			background-color: #eaeaea;
			.laba-view{
				width: 50rpx;
				height: 50rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				.laba-image{
					width: 30rpx;
					height: 30rpx;
					-webkit-animation: btn-scale 2s infinite linear;
					animation: btn-scale 2s infinite linear; 
				}
				@keyframes btn-scale {
					0% {
						-webkit-transform: scale(0.8,0.8);
						transform: scale(0.8,0.8);
					}
					50% {
						-webkit-transform: scale(1.2,1.2);
						transform: scale(1.2,1.2);
					}
					100% {
						-webkit-transform: scale(0.8,0.8);
						transform: scale(0.8,0.8);
					}
				}
			}
			.text-view{
				flex: 1;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				font-size: 30rpx;
				color: #747474;
			}
		}
		.account-option{
			margin-top: 10rpx;
			width: 100%;
			height: 160rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;
			background-color: #828282;
			border-radius: 15rpx;
			.item-view{
				width: 120rpx;
				height: 120rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.image{
					width: 80rpx;
					height: 80rpx;
				}
				.title{
					width: 120rpx;
					height: 40rpx;
					line-height: 40rpx;
					color: #ffffff;
					font-size: 25rpx;
					text-align: center;
				}
			}
		}
		.account-detial{
			margin-top: 10rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			.scroll-view{
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;
				.scroll-content{
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;
					.item-view{
						width: 720rpx;
						height: 50rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-around;
						background-color: #ffffff;
						margin-bottom: 10rpx;
						.item-title{
							width: 280rpx;
							height: 50rpx;
							margin-right: 5rpx;
							background-color: #595959;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;
							font-size: 30rpx;
							color: #ffffff;
							border-radius: 25rpx;
						}
						.item-value{
							width: 430rpx;
							height: 50rpx;
							margin-left: 5rpx;
							background-color: #828282;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;
							font-size: 30rpx;
							color: #ffffff;
							border-radius: 25rpx;
						}
					}
					.abort-us-view{
						width: 100%;
						height: 350rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: flex-end;
						.surport-title{
							height: 30rpx;
							line-height: 30rpx;
							text-align: center;
							color: #828282;
							font-size: 26rpx;
							text-decoration:underline;
						}
						.surport-com{
							height: 30rpx;
							line-height: 30rpx;
							text-align: center;
							color: #828282;
							font-size: 26rpx;
							text-decoration:underline;
						}
					}
					.qr-code-view{
						width: 100%;
						height: 400rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						.qr-show-title{
							width: 100%;
							height: 80rpx;
							line-height: 80rpx;
							text-align: center;
						}
						.qr-code{
							width: 300rpx;
							height: 300rpx;
						}
					}
					.logout-view{
						margin-top: 30rpx;
						width: 100%;
						height: 100rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: flex-end;
						.logout-action{
							width: 160rpx;
							height: 40rpx;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;
							font-size: 36rpx;
							color: #ff0000;
							border-bottom: #ff0000 2rpx solid;
							margin-bottom: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
