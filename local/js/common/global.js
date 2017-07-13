var GLOBAL = function(){
	var tm,ti;
	var Common= COMMOM;
	var _initScreen=function(callback){//初始化html  font-size
		// $("html").css("font-size",document.documentElement.clientHeight/document.documentElement.clientWidth<1.5 ? (document.documentElement.clientHeight/603*312.5+"%") : (document.documentElement.clientWidth/375*312.5+"%")); //单屏全屏布局时使用,短屏下自动缩放
		$("html").css("font-size",document.documentElement.clientWidth/1132*625+"%");//长页面时使用,不缩放
		if(callback)callback();
	}

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
	    	// _initShare();
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

}();