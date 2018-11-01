var params = function (u, paras) {//获取URL参数的方法
	var url = u;
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {};
	for (i = 0; j = paraString[i]; i++) {
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	}
	var ret = paraObj[paras.toLowerCase()];
	if (typeof(ret) == "undefined") {
		return "";
	} else {
		return ret;
	}
}
nie.define("Authorize", function () {
	var defPic = "";//当用户没有设置微信头像时取此作为默认头像;
	var redirectorURL = "http://game.163.com/weixin/redirector";//微信授权中转URL
	if (location.host == "game.163.com") {
		redirectorURL = "https://open.weixin.qq.com/connect/oauth2/authorize";//当项目上线地址域名为game.163.com时，可以直接跳转授权，不需要中转。
	}
	var options = {//定义参数格式
		pageUrl: '',//微信授权后自动跳转向此url
		serverHost: "",//授权接口地址
		callback: null//获取到用户微信信息后回调函数
	};

	function dealHeadImg(img) {//对返回的微信头像url做处理
		if (img) {
			return img.substr(0, img.length - 1) + '132';
		} else {
			return defPic;
		}
	}

	function getAuthCode(type) {//页面打开时先跳转到微信oauth2授权页面，参数type表示获取微信授权类型，决定后面是否需要取用户微信详细信息（type=="user"）还是单取微信ID（type!="user"）
		var box = "?nie=" + Math.random();//用于拼接微信授权后回跳的URL
		var pagekey = params(location.search, "pagekey");//点击好友分享出来的页面时页面URL参数里的好友页面唯一ID,UrlParam key由分享时的url决定，这里以pagekey为例，部分案例使用的是bid;
		var sharekey = params(location.search, "share_key");
		var channel = params(location.search, "c");//进入此页面的渠道，作章鱼统计用，必须要加
		var mbshare = params(location.search, "mbshare");//分享组件统计参数-分享类型，必须要加
		var spreadtimes = params(location.search, "spreadtimes");//分享组件统计参数-传播深度,必须要加
		var appchannel = params(location.search, "app_channel");//分享组件统计参数-传播深度,必须要加
		var sharepage = params(location.search, "share_page");
		if (mbshare) {
			box = box + '&mbshare =' + mbshare;
		}
		if (spreadtimes) {
			box = box + '&spreadtimes=' + spreadtimes;
		}
		if (channel) {
			box = box + '&c=' + channel;
		}
		if (pagekey) {
			box = box + '&pagekey=' + pagekey;
		}
		if (sharekey) {
			box = box + '&share_key=' + sharekey;
		}
		if (sharepage) {
			box = box + '&share_page=' + sharepage;
		}
		if (appchannel) {
			box = box + '&app_channel=' + appchannel;
		}
		var toLink = '';
		var jurl = options.pageUrl;
		if (type == 'user') {//需要获取微信用户的所有详细信息（包括微信id，昵称，头像，性别，城市，国家等），会弹出绿色的授权提示框，以微信授权链接中的&scope=snsapi_userinfo给微信APP区分是否需要用户手动授权，并在用户手动授权跳转回页面后通过uinfo=1告诉平台取用户全部微信信息[getUserInfo()]
			box = box + '&uinfo=1';
			jurl = encodeURIComponent(jurl + box);
			toLink = redirectorURL + "?appid=wx85f583832dbd07e9&redirect_uri=" + jurl + "&response_type=code&scope=snsapi_userinfo&state=163#wechat_redirect";
		} else {//仅获取用户的微信ID，不会出现绿色同意授权框，以授权链接中的&scope=snsapi_base给微信APP区分是否需要用户手动授权，并在自动授权跳转回页面后通过uinfo=0告诉平台仅取用户微信ID[getUserInfo()]
			box = box + '&uinfo=2';//注：有些案例中此处为uinfo=2,具体需要根据平台login接口的参数need_userinfo说明设置
			jurl = encodeURIComponent(jurl + box);
			toLink = redirectorURL + "?appid=wx85f583832dbd07e9&redirect_uri=" + jurl + "&response_type=code&scope=snsapi_base&state=163#wechat_redirect";
		}
		location.href = toLink;
	}

	function getUserInfo(callback) {
		var code = params(location.search, "code");//微信授权成功后的生成的临时微信code
		if (!code) {//如果没有微信code,跳转到微信author进行授权
			getAuthCode('user');
			return;
		}
		var pagekey = params(location.search, "pagekey");
		var sharekey = params(location.search, "share_key");
		var uinfo = params(location.search, "uinfo");
		var sharepage = params(location.search, "share_page");
		//用于测试阶段的share_page
		// if(window.location.hostname != "yys.163.com"){
		// 	var sharekey = "169deef4a57529d7f9c6ebd652c4144a";
		// 	// uinfo = 1;
		// }
		console.log('code ' + code);

		$.ajax({
			url: options.serverHost + '/login',
			data: {
				'code': code,
				'need_userinfo': uinfo,
				'share_page': sharepage
			},
			async: false,
			timeout:30000,
			dataType: "jsonp",
			success: function (data) {
				/*console.log(code)
				 console.log(pagekey)*/
				console.log(data)
				// console.log(uinfo);
				//alert("ajax_sec:"+JSON.stringify(data));
				if (data.success == true) {
					data.headimgurl = dealHeadImg(data.headimgurl);//微信头像
					if (!data.nickname && !data.headimgurl) {//当用户的微信头像和微信昵称都不存在时，再次执行getAuthCode("user")跳转到到微信oauth2授权页面进行授权，仅在项目需要获取用户微信头像和昵称时才需要做这一步
						setTimeout(function () {
							getAuthCode('user');
						}, 100);
						return;
					}
					if (typeof options.callback == "function") {//执行参数中的回调函数，并把取到的用户信息传入回调函数
						options.callback(data);
					}
				} else {
					if (data.msg.indexOf('invalid code') != -1) {//平台接口出错时重新授权
						setTimeout(function () {
							getAuthCode();
						}, 100);
						return;
					}else if(data.msg.indexOf('code been used') != -1){
						setTimeout(function () {
							getAuthCode();
						}, 100);
					}else{
						// console.log(location.href)
						alert(data.msg + '-')
					}
				}
			},
			error: function () {
				$("#forhorview2 p").html('网络异常，请刷新重试');
				setTimeout(function(){
					alert('网络异常，请刷新重试');
				},1500);
			}
		});
	}

	function init(param) {
		options = $.extend(options, param || {});
		getUserInfo(function (data) {
			if (options.callback) {
				options.callback(data);
			}
		})
	}

	return{
		init: init
	}
})