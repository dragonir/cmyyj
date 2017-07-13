//进页面立即执行fontsize设置 requsetani兼容
// document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.clientHeight/document.documentElement.clientWidth<1.5 ? (document.documentElement.clientHeight/603*312.5+"%") : (document.documentElement.clientWidth/375*312.5+"%");
document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.clientWidth/1132*625+"%";

// (function() {
//     var lastTime = 0;
//     var vendors = ['ms', 'moz', 'webkit', 'o'];
//     for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
//         window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
//     }
//     if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
//         var currTime = new Date().getTime();
//         var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//         var id = window.setTimeout(function() {
//             callback(currTime + timeToCall);
//         }, timeToCall);
//         lastTime = currTime + timeToCall;
//         return id;
//     };
//     if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
//         clearTimeout(id);
//     };

// }());