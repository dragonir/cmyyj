// __inline('load.js');
// alert('hahaha')
var _interfaceHost="https://g37-38117.webapp.163.com";//平台接口服务器
var _user;//全局变量，用于存储用户信息(微信信息及平台数据)

// _user={
//     help_info:{}
// };

nie.define("Index",function(){
    

    var _common=nie.require("Common");
    var isAppInside=/micromessenger/i.test(navigator.userAgent.toLowerCase());
    var isIos= /iphone os/i.test(navigator.userAgent.toLowerCase())||/ipad/i.test(navigator.userAgent.toLowerCase());
    var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());

    //舞台宽高
    var imgStageWidth = 1724/2,
        imgStageHeight = 640/2;

    //用于60s 手机号获取间隔
    var t,t2; 

    var yyplay = nie.require("Yyplay");

    //初始化舞台
    yyplay.initSceneWidth();

    //保存接口函数变量
    var getC = _common.ajxFn();

    //接口host
    // var hosturl = '//g37-capsule-toys.webapp.163.com/';
    // var hosturl2 = '//com-sev.webapp.163.com/g37/query_apntnum';

    var mySwiper; //全局swiper变量

    var ruleSwiper;
    var ruleSwiper2;

    //预加载图片数组
    var img_list1 = __resload('img');
    // var img_list = img_list1.concat(img_list2).concat(img_list3);
    var img_list = img_list1;


    //用swiper结构来搭建页面
    var _mainSwiper = function(){
        
        mySwiper = new Swiper('.main-swiper', {
            //autoplay: 0,//可选选项，自动滑动
            loop : false,
            // speed:300,
            initialSlide:0,
            onlyExternal : true,
            setWrapperSize :true,
            observer:true,
            observeParents:true,
            effect : 'fade',
            fade: {
                crossFade: true
            },
            onSlideChangeStart: function(e){
                
            },
            onSlideChangeEnd:function(e){
                        
            }
        });


    };

    //规则swiper
    function createTxtSwiper(type){
        if(type==1){
            if(!ruleSwiper){
                ruleSwiper = new Swiper($('#con-1'), {
                    scrollbar: $('#con-1').find(".swiper-scrollbar"),
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    mousewheelControl: true,
                    freeMode: true,
                    scrollbarHide : true
                });
            }
        }
        if(type==2){
            if(!ruleSwiper2){
                ruleSwiper2 = new Swiper($('#con-2'), {
                    scrollbar: $('#con-2').find(".swiper-scrollbar"),
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    mousewheelControl: true,
                    freeMode: true,
                    scrollbarHide : true
                });
            }
        }
    }

    function shareInitFn(){
        var hostname = window.location.hostname;
        var page_url = 'https://'+location.hostname+location.pathname;;
        if(hostname != 'yys.163.com'){
            page_url = 'https://test.nie.163.com/test_html/yys/h5/strawberry/index.html';
        }
        var sharepage = params(location.search, "share_page");
        page_url = page_url + '?share_page=' + sharepage;


        var shareArr = ['我正在音乐节疯狂应援，你也一起来吧！',
            '快来抢音乐节最佳应援位置，前排哦！',
            '史上福利最多音乐节，参与应援就有！'
        ];

        var title = shareArr[Math.ceil(Math.random()*3) - 1];
        // console.log(page_url);

        MobileShare.init({
            title:title,//分享标题
            desc:title,//分享正文
            url:page_url,//分享URL
            imgurl:$("#share_pic").data("src"),//分享图片
            circleTitle:title,//分享到朋友圈的标题。不填则与title一致
            guideText:title,//微信中点分享按钮显示的分享引导语
            qrcodeIcon:__uri("https://webinput.nie.netease.com/img/yys/icon.png/64"),//二维码图标
            shareCallback: function(res) {//微信易信分享回调res=｛type:0,res:[微信返回的提示]｝res.type：0表示取消，-1：分享失败，1：分享到朋友圈，2：分享给好友，3：QQ，4：微博。易信只返回1或2两种情况。

            },
            wxSdkCallback:function(){//微信sdk加载完成后回调，可在此回调中调用微信JS-SDK的其他API,如上传图片等。
                
            }
        });
    }

    //判断当前舞台状态
    function witchStatus(staType){
        var el = $('[data-cl='+staType+']').data('clid');

        if(_common.canStagePlay[el]){
            _common.popWin('secenter-wrap');
            _common.popRightIn('.secenter',1);
            setTimeout(function(){
                $('.pop-close').on('click',function(){
                    // _common.popClose();
                    var _t = $(this).parent();
                    _common.switchInAndOut(_t);
                });
            },2000);
        }else{
            _common.popWin('firstenter-wrap');
            _common.popRightIn('.firstenter',1);
            setTimeout(function(){
                $('.pop-close').on('click',function(){
                    // _common.popClose();
                    var _t = $(this).parent();
                    _common.switchInAndOut(_t);
                });
            },2000);
        }
    }

    //切换舞台
    function switchStage(cl,gid) {
        $('.hmm-link').hide();
        if(cl=='ai'){
            $('.hmm-link').show();
        }
        $('.pop-con').removeClass('ai cm xh xx miao').addClass(cl);
        mySwiper.slideTo(gid);
        // setTimeout(function(){
            $('.scene-wrap-all').hide();
        // },100);
        witchStatus(cl);
        // _common.popWin('firstenter-wrap');
        // _common.popRightIn('.firstenter');
    }

    //初始化舞台状态
    function canPlayFn(canList){
        for(var i=1;i<=5;i++){
            if(_user['help_info'][i]){
                _common.canStagePlay[i] = _user['help_info'][i];
            }
            if(_user['help_info'][i]==0){
                _common.canStagePlay[i] = 2;
            }
        }
        log(_common.canStagePlay);
    }

    //计算元素相对位置
    function initPosition(el){
        var _t = $(el);
        var tmp = $(window).height()/imgStageHeight;
        var obj = {
            'width' : parseInt(_t.css('width')),
            'height' : parseInt(_t.css('height')),
            'top' : parseInt(_t.css('top')),
            'left' : parseInt(_t.css('left')),
        };
        // tmp = 0.85;
        _t.css('width',obj['width'] * tmp);
        _t.css('height',obj['height'] * tmp);
        _t.css('top',obj['top'] * tmp);
        _t.css('left',obj['left'] * tmp);
        console.log(obj)
        console.log(tmp)
    }

    //重算外景元素位置
    function initStageThings(){
        initPosition('.scene-rule');
        initPosition('.scene-down');
    }

    //页面事件绑定(按钮点击事件等)
    var _bindEvent = function(){
        // $('.p1-go').on('click',function(){
        //     // mySwiper.slideTo(0, 1000, false);
        //     //切换到第一个slide，速度为1秒,设置为false时不会触发onSlideChange回调函数。
        //     // var getC = _ajxFn();
        //     // getC.checkLogin(1);
        //     _common.popWin('firstenter-wrap');
        //     _common.popRightIn('.firstenter');
        // });

        $('.startplay-btn').on('click',function(){
        	_common.popWin('yyplay-wrap');
        });
        

        $('[backstage]').on('click',function(){
            _common.popClose();
            mySwiper.slideTo(0);
            $('.scene-wrap-all').show();
            $('.pop-close').off('click');
        });

        // $('.pop-top').on('click',function(e){
        //     var t = e.target,
        //         _this = $(this);
        //     if(t.id && t.id === 'dhmgz-wrap'){
        //         _common.popClose(_this.attr('id'),1);
        //     }
        // });

        $('.stg').on('click',function(){
            // $('.pop-con').addClass('cm');
            // _common.popWin('drawsuc-wrap');
            // return;
            var _t = $(this),
                cl =  _t.data('cl'),
                gid = _t.data('clid');
            switchStage(cl,gid);
        });

        $('.notplay-btn').on('click',function(){
            var shopId = _common.setStaId();
            var user_id = _user['user_id'],
                token = _user['weixin_token'],
                share_page = _user['sharer_info']['share_page'];

            getC.drawPaper(user_id,token,share_page);
        });

        $('.scene-rule').on('click',function(e){
            _common.popWin('dhmgz-wrap',1);
            setTimeout(function(){
                createTxtSwiper(1);
            },300)
        });
        $('.show-rule').on('click',function(e){
            _common.popWin('dhmgz-wrap2',1);
            setTimeout(function(){
                createTxtSwiper(2);
            },300)
        });


        $('#dhmgz-wrap').on('click',function(e){
            var t = e.target,
                _this = $(this);
            if(t.id && t.id === 'dhmgz-wrap'){
                _common.popClose(_this.attr('id'));
            }
        });

        $('#dhmgz-wrap2').on('click',function(e){
            var t = e.target,
                _this = $(this);
            if(t.id && t.id === 'dhmgz-wrap2'){
                _common.popClose(_this.attr('id'),1);
            }
        });

        // $('.pop').on('click',function(e){
        //     var t = e.target,
        //         _this = $(this);
        //     if(t.className === 'pop popup'){
        //         _common.popClose(_this.attr('id'));
        //     }
        //     //隐藏奖励弹窗，不用这种写法似乎有其他bug
        //     if( t.className != 'reicon-pop'&&
        //     	t.className != 'js-p'&&
        //     	t.className != 'top-tit'&&
        //     	t.className != 'sub-tit'&&
        //     	t.className != 'reicon r1 show-pop'&&
        //     	t.className != 'reicon r2 show-pop'&&
        //     	t.className != 'reicon r3 show-pop'&&
        //     	t.className != 'reicon r4 show-pop'&&
        //     	t.className != 'reicon r5 show-pop'){
        //     	$('.reicon').removeClass('show-pop');
        //     }
        // });
        $('.drawshare-btn').on('click',function(e){
            MobileShare.showShare();
        });
    }

    //微信调用
    function setAuthorize(){
        var Authorize = nie.require("Authorize");
        var hostname = window.location.hostname;
        var page_url = 'https://'+location.hostname+location.pathname;;
        if(hostname != 'yys.163.com'){
            page_url = 'https://test.nie.163.com/test_html/yys/h5/strawberry/index.html';
        }
        Authorize.init({
            pageUrl:page_url,
            serverHost:_interfaceHost,
            callback:function(data){
                    // $('#main').show()
                    _user=data;
                    // setGetPuzzle(_user);
                    // setThisItem();
                    // setRandom();
                    // randShareImg();
                    log('_user');
                    log(_user);
                    $('.sharer-name').html(_user['sharer_info']['nickname']);
                    // $(".slogan-text").find("span").html(_user.sharer_info.nickname);
                    // $("#share_desc").html('帮"'+ _user.sharer_info.nickname + '"点亮《阴阳师》2016人气式神年度总决选投票拼图，助人气式神登顶，自己也将有机会获得携程网提供的优惠券一份哦～"');
                    //重新获取分享语句和分享img
                    // MobileShare.updateShare({
                    //     desc:$("#share_desc").html(),
                    //     imgurl: $("#share_pic").attr("src")//分享图片
                    // });
                    $('#forhorview2').removeClass('show');
                    $('#forhorview').css('visibility','visible');
                    shareInitFn();
                    loadingFn();
            }
        });
    };
    setAuthorize();

    // loadingFn();  //测试用

    function loadingFn(){
        //预加载调用
        Loader.show({
            iFileData: img_list,
            bgColor: '#000',//loading背景色值，默认#000
            mainWrap: '#main',//主题内容DOM，默认id值是Jmain
            defaultAnimation: false,//布尔值，默认值true。是否显示默认的loading动画
            customAnimation: function(curPer){//加载进度回调函数，取值0~1
                // console.log(curPer);
                $('.load-wrap').css('visibility','visible');
                $('.text-line,.jd-line').css('width',curPer*100+'%');
            },
            completeCallback: function(){//完成预加载回调函数
                console.log('加载完毕')
                var st2 = setTimeout(function(){
    	            $('.load-btn').addClass('loaded');
                    $('.load-wrap').on('click',function(){
                        $('#au1')[0].play();//音效只在双平台微信，以及safari下执行，背景乐全平台执行
                        // if(isAppInside||isIos){ //修复ios下音效不对应bug 
                        //     $('#au2')[0].play();
                        //     $('#au3')[0].play();
                        //     $('#au4')[0].play();
                        //     $('#au5')[0].play();
                        //     $('#au2')[0].pause();
                        //     $('#au3')[0].pause();
                        //     $('#au4')[0].pause();
                        //     $('#au5')[0].pause();
                        // }

                        $('.load-wrap').css('opacity','0');
                        // initStageThings();
                        var st = setTimeout(function(){
                            $('.load-wrap').hide().css('visibility','hidden');
                            $('.load-wrap').remove();
                            // $('.p1-chuo').addClass('show');
                            _bindEvent();
                        },300);
                        if(isAppInside||isIos){
                            var st3 = setTimeout(function(){
                                if($('.musicbtn').hasClass('active')){
                                    // $('#au2')[0].play();
                                }
                            },600);
                        }
                        var st2 = setTimeout(function(){
                            $('#main').removeClass('start-ani');
                        },300); //1000
                    });
                },200); //loading加载完之后，给两秒用于缓冲页面2000
                _init();
            }
        });
    }

    function _init(){
        _mainSwiper();
        yyplay.init();
        canPlayFn();
        // initYy();
        // cachefiresImg();
        // test();
    };
    
    function test(){
        var arr = ['ai','miao','cm','xh','xx'];
        var i = 0;
        setInterval(function(){
            $('.pop-con').removeClass('cm').removeClass('xh')
            .removeClass('ai')
            .removeClass('miao')
            .removeClass('xx');
            $('.pop-con').addClass(arr[i]);
            i++;
            if(i==5){i=0};
        },1000);
    }

});

function log(t){
    console.log(t);
}