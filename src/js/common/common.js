var isAppInside=/micromessenger/i.test(navigator.userAgent.toLowerCase())||/yixin/i.test(navigator.userAgent.toLowerCase());
var isIos= /iphone os/i.test(navigator.userAgent.toLowerCase())||/ipad/i.test(navigator.userAgent.toLowerCase());
var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());

nie.define("Common",function(){

	//舞台状态
	var canStagePlay = {
        '1' : false,
        '2' : false,
        '3' : false,
        '4' : false,
        '5' : false
    };

	var _alert=function(msg){//公用alert方法
		
	};
	
	//公用弹窗
	var popWin = function(popID,isfade){
		//防止点透
		setTimeout(function(){
			$('.prevent-mask').removeClass('show');
		},2000);

		var obj = $('#'+popID),
			_fadein = function(){
				if(isfade == 1){
					$('#fade').show();
					var st = setTimeout(function(){
						$('#fade').addClass('show');
					},50)
				}
			};
		//如果是顶层弹窗(弹窗后再弹窗,则不关闭原本弹窗)
		if(obj.hasClass('pop-top')){
			_fadein();
			obj.addClass('popup');
			return;
		}
		$('.pop').removeClass('popup');
		_fadein();
		obj.addClass('popup');
	};

	//关闭弹窗
	var popClose = function(popID,isPopTop){
		var	_fadeout = function(){
			$('#fade').removeClass('show');
			$('.pop-con').removeClass('rIn');
			$('.pop-con').removeClass('rOut');
			var st = setTimeout(function(){
				$('#fade').hide();
			},200)
		};
		if(isPopTop == 1){
			var obj = $('#'+popID);
			obj.removeClass('popup');
			$('#fade').removeClass('show');
			var st = setTimeout(function(){
				$('#fade').hide();
			},200)
			return;
		}
		if(popID==1){
			$('.pop').removeClass('popup');
			$('.pop input').val('');
		}else{
			$('.pop').removeClass('popup');
		}

		_fadeout();
	};

	//弹窗移入画面
	var popRightIn = function(el,is2s){
		$(el).removeClass('rIn');
		$(el).removeClass('rOut');
		if(is2s==1){
			$(el).addClass('rIn2s');
		}else{
			$(el).addClass('rIn');
		}
	};

	//弹窗移出画面
	var popRightOut = function(el){
		$(el).removeClass('rIn');
		$(el).removeClass('rOut');
		$(el).addClass('rOut');
	};

	var switchInAndOut = function(e){
		if(e.hasClass('rOut')){
			e.removeClass('rIn');
			e.removeClass('rOut');
			e.addClass('rIn');
		}else{
			e.removeClass('rIn2s');
			e.removeClass('rIn');
			e.removeClass('rOut');
			e.addClass('rOut');
		}
	};

	//验证表单
	var reg = {
		_is_phone : function(phone) {
	        return phone.match(/^(13|14|15|18|17)\d{9}$/);
	    },
	    _is_imgcode : function(code) {
            return code.match(/^\w{3}$/);
        },
        _is_phonecode : function(code) {
            return code.match(/^\d{4}$/);
        }
	};

	//设置舞台对应id //应援结束需要用到
    function setStaId(){
        var _id ;
        if($('.pop-con').eq(0).hasClass('cm')){
            _id = 1;
        }
        else if($('.pop-con').eq(0).hasClass('ai')){
            _id = 2;
        }
        else if($('.pop-con').eq(0).hasClass('xh')){
            _id = 3;
        }
        else if($('.pop-con').eq(0).hasClass('miao')){
            _id = 4;
        }
        else if($('.pop-con').eq(0).hasClass('xx')){
            _id = 5;
        }
        else{
            _id = 0;
        }
        console.log('舞台id'+_id);
        return _id;
    }

	//接口调用函数集
    function _ajxFn(){

        //挑战接口
        var challengePlay = function(user_id,token,share_page,shop_id,thres,cb){
            var urlstr = '/challenge';

            $.ajax({
                url : _interfaceHost + urlstr,
                type : "get",
                dataType : "jsonp",
                data:{
                    user_id : user_id,
                    token : token,
                    share_page : share_page,
                    shop_id : shop_id,
                    thres : thres
                },
                success : function(data){
                    console.log(data);
                    if(data.success==true){
                    	if(data.have_helped==true){
                    		alert('网络异常，请稍刷新页面')
                    		return;
                    	}
                    	if(data.result==0){
                    		$('.prevent-mask').addClass('show');
                    		canStagePlay[shop_id] = 2;
                    		setTimeout(function(){
                    			popWin('yyfail-wrap');
                    		},100);
                    	}
                    	if(data.result){
                    		$('.prevent-mask').addClass('show');
                    		$('.score').html(data.result);
                    		canStagePlay[shop_id] = 1;
                    		setTimeout(function(){
                    			popWin('yysuc-wrap');
                    		},100);
                    	}
                    }else{
                    	alert(data.msg);
                    }
                    if(typeof cb == 'function'){
                    	cb();
                    }
                },
                error:function(){
                    alert('网络异常请稍后再试');
                }
            });
        };

        //抽奖接口
        var drawPaper = function(user_id,token,share_page){
            var urlstr = '/draw';

            $.ajax({
                url : _interfaceHost + urlstr,
                type : "get",
                dataType : "jsonp",
                data:{
                    user_id : user_id,
                    token : token,
                    share_page : share_page
                },
                success : function(data){
                    console.log(data);
                    if(data.success==true){
                    	if(data.cdkey){
                    		$('.cdkey').html(data.cdkey);
                    		popWin('drawsuc-wrap');
                    	}else{
                    		popWin('drawfail-wrap');
                    	}
                    }else{
                    	alert(data.msg);
                    }
                },
                error:function(){
                    alert('网络异常请稍后再试');
                }
            });
        };

        return{
            challengePlay : challengePlay,
            drawPaper : drawPaper
        }
    };

    //如果有需要暴露接口给外部使用，return就可以了
    return {
        alert:_alert,
        popWin : popWin,
        popClose : popClose,
        popRightIn : popRightIn,
        popRightOut : popRightOut,
        switchInAndOut : switchInAndOut,
        ajxFn : _ajxFn,
        setStaId : setStaId,
        reg : reg,
        canStagePlay : canStagePlay
    }
});


 // /*打开弹窗*/
 //            popWindow : function(popID){
 //                $('.dialog').fadeOut().removeClass('curr');
 //                var obj=$("#"+popID);
 //                var width=obj.width();
 //                var height=obj.height();
 //                var popTop=obj.height()/2;
 //                var popLeft=obj.width()/2;
 //                obj.css({"margin-top":-popTop,"margin-left":-popLeft}).show();
 //                $('#fade').show();
 //                obj.show();
 //            },

 //            /*关闭弹窗*/
 //            popClose : function(popID){
 //                $('#fade ,.dialog ,#'+popID).fadeOut();
 //                $('.dialog input').val('');
 //                $('#videoBox').empty();
 //            }