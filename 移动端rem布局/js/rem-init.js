(function (doc, win, designWidth) {
    var html = doc.documentElement;


    function refleshRem() {
        var clientWidth = html.getBoundingClientRect().width;
        // var clientWidth = html.clientWidth;
        if (clientWidth >= designWidth) {
            html.style.fontSize = '100px';
        } else {
            // html.style.fontSize = 16 * clientWidth / 375 + 'px';  
            // 把屏幕分成16份，以iphone6为基准  实际切图时，真实尺寸等于设计稿的尺寸除dpr
            html.style.fontSize = 100 * (clientWidth / designWidth) + 'px'; // 可以直接按设计稿中的尺寸切图
        }
    }
    doc.addEventListener('DOMContentLoaded', refleshRem);
})(document, window, 750)