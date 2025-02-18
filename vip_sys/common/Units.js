	function getTime (){
		var date = new Date()
		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()
		hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
		minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
		second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
		month >= 1 && month <= 9 ? (month = "0" + month) : ""
		day >= 0 && day <= 9 ? (day = "0" + day) : ""
		var timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
		return timer
	};
	function getDate (){
		var date = new Date()
		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()
		var timer = year + '-' + month + '-' + day
		return timer
	};
	function andriodtimeTostemp (timeString){
		let timeDate = timeString
		let Time = new Date(timeDate)
		let timestemp = Time.getTime()
		return timestemp
	};
	function iostimeTostemp (timeString){
		let timeDate = timeString
		timeDate = timeDate.replace(new RegExp("-","g"), '/')
		Time = new Date(timeDate)
		let timestemp = Time.getTime()
		return timestemp
	};
	function stempTotime (stemp){
		let date = new Date(stemp);
		let y = date.getFullYear();
		let MM = date.getMonth() + 1;
		MM = MM < 10 ? ('0' + MM) : MM
		let d = date.getDate()
		d = d < 10 ? ('0' + d) : d
		let h = date.getHours()
		h = h < 10 ? ('0' + h) : h
		let m = date.getMinutes();
		m = m < 10 ? ('0' + m) : m
		let s = date.getSeconds()
		s = s < 10 ? ('0' + s) : s;
		return y + '-' + MM + '-' + d + ' ' + h + ':' + m+ ':' + s
	};
	function timeAddDay (timeString,num){
		let stemp = timeTostemp(timeString)
		stemp = stemp + 1000*60*60*24*num
		let time = stempTotime(stemp)
		return time
	};
	function getHour (timeLength){
    	var hour = timeLength/(60*60)
    	hour = Math.floor(hour)
    	if(hour>0){
    		if(hour<=9){
    			hour = "0" + hour
    		}else if(hour>9){
    			hour = hour
    		}
    	}else if(hour==0){
    		hour="00"
    	}
    	return hour
    };
	function getMinute (timeLength){
    	var hourOver = timeLength%(60*60)
    	var minute = Math.floor(hourOver/(60))
    	if(minute>0){
    		if(minute<=9){
    			minute = "0" + minute
    		}else if(minute>9){
    			minute = minute
    		}
    	}else if(minute==0){
    		minute="00"
    	}
    	
    	return minute
    };
	function getSecond (timeLength){
    	var hourOver = timeLength%(60*60)
    	var minuteOver = Math.floor(hourOver%(60))
    	var second = Math.floor(minuteOver)
    	if(second>0){
    		if(second<=9){
    			second = "0" + second
    		}else if(second>9){
    			second = second
    		}
    	}else if(second==0){
    		second="00"
    	}
    	return second
    };
	function gettimeStamp (type){
		var stamp=""
		if(type==0){
			stamp = Math.round(new Date()/1000)
		}else if(type==1){
			stamp = Math.round(new Date())
		}
		return stamp
	};
	function getNorepeatArray (start,end) {
		 var a = []; //生成的随机数的集合
		 var n = end - start + 1
		 for (var x=0;x<n;x++) {
			a[x]=start
			start=start+1
		 }
		 let res = [];
		  for (let i=0 ; i <n; i++) {
			let index = parseInt(Math.random()*(a.length));    //生成一个的随机索引，索引值的范围随数组a的长度而变化
			res.push(a[index]);   
			a.splice(index,1)  //已选用的数，从数组a中移除， 实现去重复
		  }
		  return res;
	};
	function getViewinfo (viewID){
		var viewData
		uni.getSystemInfo({
			success(res) {
				let info = uni.createSelectorQuery().select("#" + viewID);
				info.boundingClientRect(function(data) { 
				viewData = data
			    }).exec()
			}
		})
		 return viewData
	};
	function getCanvarRgba (canvarID,pointX,pointY,storeName){
		//let rgbaColor
		return new Promise((resolve, reject) => {
		        uni.canvasGetImageData({
		        	canvasId: canvarID,
		        	x: pointX,
		        	y: pointY,
		        	width: 1,
		        	height: 1,
		        	success(res) {
		        		let Color = {
		        			R:res.data[0],
		        			G:res.data[1],
		        			B:res.data[2],
		        			A:res.data[3]
		        		}
		        	},
		        });
		    })
	};
	function getHexColor (rgbColor) {
			var values = [
				rgbColor.R,
				rgbColor.G,
				rgbColor.B,
				rgbColor.A
			]
			var a = parseFloat(values[3] || 1) // values[3]是rgba中的a值，没有的话设置a为1，a可能为小数，所以用parseFloat函数
			var r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255)  // 转换为16进制
			var g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255)
			var b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
		  return '#' +
			('0' + r.toString(16)).slice(-2) + // 转换后的16进制可能为一位，比如 7 就转换为 7 ， 15 转换为 f
			('0' + g.toString(16)).slice(-2) + // 当为一位的时候就在前面加个 0，
			('0' + b.toString(16)).slice(-2) // 若是为两位，加 0 后就变成了三位，所以要用 slice(-2) 截取后两位
	};
	function randomNum (minNum,maxNum){ 
	    switch(arguments.length){ 
	        case 1: 
	            return Math.floor(Math.random()*minNum+1,10); 
	        break; 
	        case 2: 
	            return Math.floor(Math.random()*(maxNum-minNum+1)+minNum,10); 
	        break; 
	            default:
	                return 0;
	            break;
	    } 
	};
	function replaceAll (被替换文本,被替换符号,替换为){
		return 被替换文本.replace(new RegExp(被替换符号,'g'),替换为)
	};
	function getPagePath (){
		let pages = getCurrentPages() // 获取栈实例
		let currentRoute  = pages[pages.length-1].route; // 获取当前页面路由
		let currentPage = pages[pages.length-1]['$page']['fullPath']
		return currentPage
	};
	function requestAsync(url,method,data) {
		uni.showLoading({
			title:'加载中...'
		});
		return new Promise((resolve, reject) => {
			uni.request({
				method: method,
				url: url,
				data: data,
				async: false,
				success(res) {
					resolve(res)
					uni.hideLoading()
				},
				fail(err) {
					reject(err);
					uni.showToast({
						title: '错误' + err,
						icon: 'none',
						duration: 1500,
					})
					uni.hideLoading()
				}
			})
		})
	};
	function isNumber(val){
	
	    var regPos = /^[0-9]+.?[0-9]*/;
	  
	    if(regPos.test(val) ){
	        return true;
	    }else{
	        return false;
	    }
	};
	module.exports={
		getTime,
		getHour,
		getMinute,
		getSecond,
		gettimeStamp,
		getNorepeatArray,
		getViewinfo,
		getHexColor,
		getCanvarRgba,
		randomNum,
		andriodtimeTostemp,
		iostimeTostemp,
		stempTotime,
		timeAddDay,
		replaceAll,
		getPagePath,
		requestAsync,
		isNumber,
		getDate
	}