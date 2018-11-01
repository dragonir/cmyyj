nie.define("GlobalInit",function(){
	var tm,ti;
	var Common=nie.require("Common");
	var _initScreen=function(callback){//初始化html  font-size
		// $("html").css("font-size",document.documentElement.clientHeight/document.documentElement.clientWidth<1.5 ? (document.documentElement.clientHeight/603*312.5+"%") : (document.documentElement.clientWidth/375*312.5+"%")); //单屏全屏布局时使用,短屏下自动缩放
		$("html").css("font-size",document.documentElement.clientWidth/1132*625+"%");//长页面时使用,不缩放
		if(callback)callback();
	}
    var _initShare=function(){//初始化分享组件
    	var share = nie.require("nie.util.mobiShare2");
    	var title=$("#share_title").html();
		if( $("#hd_pagination_type").length>0 && $("#hd_pagination_type").val()=="article"){//新闻内页使用新闻标题作为分享标题
			title=$("#NIE-art .artTitle").html();
		}
  //      	MobileShare.init({
  //      		title:title,//分享标题
  //           desc:$("#share_desc").html(),//分享正文
  //           url:location.href,//分享URL
  //         	imgurl:$("#share_pic").data("src"),//分享图片
		// 	circleTitle:title,//分享到朋友圈的标题。不填则与title一致
		// 	guideText:"来召唤属于你的式神！",//微信中点分享按钮显示的分享引导语
		// 	qrcodeIcon:__uri("https://webinput.nie.netease.com/img/yys/icon.png/64"),//二维码图标
		// 	shareCallback: function(res) {//微信易信分享回调res=｛type:0,res:[微信返回的提示]｝res.type：0表示取消，-1：分享失败，1：分享到朋友圈，2：分享给好友，3：QQ，4：微博。易信只返回1或2两种情况。

		// 	},
		// 	wxSdkCallback:function(){//微信sdk加载完成后回调，可在此回调中调用微信JS-SDK的其他API,如上传图片等。
				
		// 	}
		// });
		// $("#btn_share").click(function(e){//分享按钮绑定点事件，显示分享弹层
		// 	MobileShare.showShare();
		// })
    }
  //   var _initAttention=function(){//初始化关注公众号弹层
  //   	$("#btn_attention").bind("click",function(e){
	 //   		$("#md_attention").show();
	 //   		var st=setTimeout(function(){
	 //   			$("#md_attention").addClass("show");
	 //   		},50)
	 //   	});
	 //   	$("#md_attention").bind("click",function(e){
	 //   		$("#md_attention").removeClass("show");
	 //   		var st=setTimeout(function(){
	 //   			$("#md_attention").hide();
	 //   		},300);
	 //   	})
  //   	$("#md_attention")[0].addEventListener("touchmove", function(e){
		// 	e.preventDefault();
		// 	//e.stopPropagation()
		// }, false);
  //   }

    var _addEvent=function(){
    	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", 			function(e){_onorientationchange(e);}, false);
  //   	$(".btn_toTop")[0].addEventListener("click", function(e){
		// 	window.scrollTo(0,0);
		// }, false);
    }
    var _onorientationchange=function(e){
		if(window.orientation==90||window.orientation==-90){//横屏下恢复默认显示效果
			var st=setTimeout(_initScreen,300);
			$("#forhorview").css("display", "none");
			clearTimeout(tm);
			clearInterval(ti);
			ti = setInterval(function(){
				initSceneWidth();
				if(window.orientation==90||window.orientation==-90){
					$("#forhorview").css("display", "none");
				}
			},200);
			tm = setTimeout(function(){
				window.scrollTo(0,0);
				clearInterval(ti);
			},2000);    
	    }else{
	    	$("#forhorview").css("display", "-webkit-box");  //显示横屏浏览提示框
	    }
	}

	var _initPage=function(){//官网通用页面初始化处理
	    _onorientationchange();
	    _initScreen(function(){
	    	var system=isIos?"ios":"android";
	    	_initShare();
	    	// _initAttention();
	    	_addEvent();
	    	
	    	if(window.orientation==90||window.orientation==-90){//横屏下恢复默认显示效果
				var st=setTimeout(_initScreen,300);
				$("#forhorview").css("display", "none");
				clearTimeout(tm);
				clearInterval(ti);
				ti = setInterval(function(){
					if(window.orientation==90||window.orientation==-90){
						$("#forhorview").css("display", "none");
					}
				},200);
				tm = setTimeout(function(){
					window.scrollTo(0,0);
					clearInterval(ti);
				},2000);    
		    }else{
		    	$("#forhorview").css("display", "-webkit-box");  //显示横屏浏览提示框
		    }
	    })
	}

	//初始化舞台宽
    function initSceneWidth(){
        var imgStageWidth = 1725,
            imgStageHeight = 640;
        var temp = imgStageWidth/imgStageHeight;
        var _w = $(window).height() * temp
        $('.scene').css('width',_w);
    }

	_initPage();

});