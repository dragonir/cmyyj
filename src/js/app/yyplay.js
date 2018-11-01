// __inline('../lib/vconsole.min.js');
// 外景交互 和 内景应援条点击
nie.define("Yyplay",function(){
    $(window).on('touchmove',function(e){
        e.preventDefault();
    });

    var v_c = { //variable_config
        supLineSi : null,//应援条定时器变量
        allSi : null,//应援条定时器变量
        supLineSt : null,
        stageSi : null,
        stageSt : null,
        startTimeTag : true,
        allTime : 5, // 总时长5s
        nowNum : 0,
        canDo : true//是否可以进行游戏
    };

    //拖拽外景变量
    var dragXY = {
        X : 0,
        Y : 0
    }

    var _common = nie.require("Common");
    //保存接口函数变量
    var getC = _common.ajxFn();

    // var percentArr = [0,10,20,30,40,50,60,70,80,90,100]; 

    //应援条增加
    function increaseSupportLine(){
        if(!v_c.canDo){return;}
        // var allWidth = 100;
        // console.log('allWidth ' + allWidth)
        // var v_c.nowNum = v_c.nowNum;
        // console.log('v_c.nowNum ' + v_c.nowNum)
        // v_c.nowNum = v_c.nowNum * 100;
        // v_c.nowNum = parseInt(Math.ceil(v_c.nowNum));
        v_c.nowNum += 10;
        if(v_c.nowNum>=110){
            v_c.nowNum = 100;
            return;
        }
        console.log('v_c.nowNum ' + v_c.nowNum)
        $('.line-inner').css('width',v_c.nowNum + '%');
        if(v_c.nowNum==100){
            clearInterval(v_c.allSi);
            v_c.allSi = null;
            endGame();
        }
        // getNowSupportLine();
    }
    //应援条减少
    function decreaseSupportLine(){
        if(!v_c.canDo){return;}
        // var allWidth = 100;
        // var v_c.nowNum = v_c.nowNum;
        // v_c.nowNum = v_c.nowNum * 100;
        v_c.nowNum -= 10;
        // v_c.nowNum = Math.round(v_c.nowNum);
        if(v_c.nowNum <= -10){
            v_c.nowNum = 0;
            return;
        }
        $('.line-inner').css('width',v_c.nowNum + '%');
        // getNowSupportLine();
    }
    
    //获取当前分数
    function getNowSupportLine(){
        // var allWidth = $('.supportline').width();
        // var v_c.nowNum = $('.line-inner').width()/allWidth;
        var num = v_c.nowNum;
        num = Math.round(num/10);

        if(num<=1){
            num = 0;
        }else if(num>=2 && num<=4){
            num = 3;
        }else if(num>=5 && num<=7){
            num = 6;
        }else if(num>=8 && num<=10){
            num = 9;
        }

        console.log(num + 'num');
        return num;
    }

    //应援结束
    function endGame(){
        var finalNum = getNowSupportLine();
        v_c.canDo = false;
        v_c.nowNum = 0;
        // clearInterval(v_c.allSi);
        clearInterval(v_c.supLineSi);

        var shopId = _common.setStaId();
        var user_id = _user['user_id'],
            token = _user['weixin_token'],
            share_page = _user['sharer_info']['share_page'],
            shop_id = shopId,
            thres = finalNum;
        console.log('thres '+thres);

        // alert('请求接口');
        // return;

        getC.challengePlay(user_id,token,share_page,shop_id,thres,function(){
            setTimeout(function(){
                initPlayGame();
            },150);
        });
    }

    function initPlayGame(){
        v_c.canDo = true;
        v_c.startTimeTag = true;
        v_c.allTime = 5;
        $('.line-inner').css('width','0');
        $('#yyplay-txt').removeClass('n1 n2 n3 n4 n5').addClass('n5');
    }

    //应援总时长 规定5秒
    function startTime(){
        if(!v_c.startTimeTag){
            return;
        }
        v_c.startTimeTag = false;
        //游戏总时长定时器
        clearInterval(v_c.allSi);
        v_c.allSi = setInterval(function(){
            // console.log('v_c.allSi')
            // var nW = parseInt($('.txt').html());
            var nW = v_c.allTime;
            $('#yyplay-txt').removeClass('n1 n2 n3 n4 n5').addClass('n' + (nW-1));
            v_c.allTime--;
            // $('.txt').html(v_c.allTime);
            // console.log(v_c.allTime)
            if(0 == v_c.allTime){
                clearInterval(v_c.allSi);
                v_c.allSi = null;
                endGame();
            }
        },1000);
    }

    //step步速，左移
    function moveLeft(step){
        setLeftRightShow();
        var _w = parseInt($('.scene').css('width').match(/\d+/g).toString());
        _w = _w - $('.scene-wrap').width();
        _w = -_w;
        if($('.scene')[0].offsetLeft<=_w){
            $('.scene').css('left',_w+'px');
            return;
        }
        var nt = $('.scene')[0].offsetLeft-step;
        if(nt<_w){
            nt = _w;
            // return;
        }
        $('.scene').css('left',nt+'px');
    }

    //step步速，右移
    function moveRight(step){
        setLeftRightShow();
        if($('.scene')[0].offsetLeft>=0){
            $('.scene').css('left','0px');
            return;
        }
        var nt = $('.scene')[0].offsetLeft+step;
        if(nt>0){
            // return;
            nt = 0;
        }
        $('.scene').css('left',nt+'px');
    }

    //拖拽移动方法
    function dragMove(){
        $('.scene').on('touchstart',function(e){
            // e.preventDefault();
            var _t = $(this);
            clearInterval(v_c.stageSi);
            var t=e.changedTouches? e.changedTouches[0]:e;
            dragXY.X = t.pageX;

        });
        console.log(1111)
        $('.scene').on('touchmove',function(e){
            setLeftRightShow();
            var t=e.changedTouches? e.changedTouches[0]:e;
            var temp = t.pageX - dragXY.X;
            dragXY.X = t.pageX;

            var _w = parseInt($('.scene').css('width').match(/\d+/g).toString());
            _w = _w - $('.scene-wrap').width();
            _w = -_w;

            var nt = $('.scene')[0].offsetLeft + temp/2;
            if(nt>=0){
                nt = 0;
            }
            if(nt<=_w){
                nt = _w;
            }
            $('.scene').css('left',nt+'px');
        });

        $('.scene').on('touchend',function(e){
            var _t = $(this);
            clearInterval(v_c.stageSi);
        });
    }

    //初始化舞台宽
    function initSceneWidth(){
        var imgStageWidth = 1724,
            imgStageHeight = 640;
        var temp = imgStageWidth/imgStageHeight;
        var _w = $(window).height() * temp
        $('.scene').css('width',_w);
    }

    //判断左右移动按钮显隐状态
    function setLeftRightShow(){
        var _w = parseInt($('.scene').css('width').match(/\d+/g).toString());
        _w = _w - $('.scene-wrap').width();
        _w = -_w;
        if($('.scene')[0].offsetLeft>=0){ //最左
            $('.scene-lbtn').hide();
        }else{
            $('.scene-lbtn').show();
        }
        if($('.scene')[0].offsetLeft<=_w){ //最右
            $('.scene-rbtn').hide();
        }else{
            $('.scene-rbtn').show();
        }
    }

    var _bindEvent = function(){
        //绑定按钮事件
        $('.yyplay-btn').on('touchstart',function(e){
            increaseSupportLine();
            clearInterval(v_c.supLineSi);
            clearTimeout(v_c.supLineSt);
            startTime();
            v_c.supLineSt = setTimeout(function(){
                v_c.supLineSi = setInterval(function(){
                    decreaseSupportLine();
                },100); //每400ms减一次
            },50);  //停止点击100ms后开始锐减
        });

        $('.scene').on('touchstart',function(e){
            console.log(e.target.className)
            var t = e.target.className;
            if(t == 'scene'){
                e.preventDefault();
                return false;
            }
        });

        $('.scene-rbtn').on('touchstart',function(e){
            e.preventDefault();
            clearInterval(v_c.stageSi);
            v_c.stageSi = setInterval(function(){
                moveLeft(25);
            },60)
            return false;
        });

        $('.scene-rbtn').on('touchend',function(e){
            clearInterval(v_c.stageSi);
        });

        $('.scene-lbtn').on('touchstart',function(e){
            e.preventDefault();
            clearInterval(v_c.stageSi);
            v_c.stageSi = setInterval(function(){
                moveRight(25);
            },60);
            return false;
        });

        $('.scene-lbtn').on('touchend',function(e){
            clearInterval(v_c.stageSi);
        });
    };
    

    function init(){
        _bindEvent();
        dragMove();
        setLeftRightShow();
    };
    
    return {
        initSceneWidth : initSceneWidth,
        init : init
    }
});
