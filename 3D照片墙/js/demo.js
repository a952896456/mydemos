var img = $('img');
var len = img.length;

function init() {
    var deg = 360 / len;
    for(var i = 0; i < len; i++) {
        img.eq(i).css({
            transform: 'rotateY('+  i*deg +'deg) translateZ(300px)',
            transition: 'all 0.5s linear ' + (len - 1 - i) * 0.1 + 's',
        })
    }
    bindEvent();
}

init();

function bindEvent() {

    var lastX,lastY,nowX,nowY,disX,disY,rotX = 0,rotY = 0;
    var timer;
    $('body').on('mousedown', function (e) {
        clearInterval(timer);
        lastX = e.clientX || e.pageX;
        lastY = e.clentY || e.pageY;
        $('body').on('mousemove', function (e) {
            nowX = e.clientX || e.pageX;
            nowY = e.clientY || e.pageX;

            disX = nowX - lastX;
            disY = nowY - lastY;
            // disX ---> rotateY disY ---> rotateX
            // 鼠标水平移动 左到右 disX>0 rotY为正
            // 鼠标垂直移动 从下到上 disY<0 rotX为正
            rotX -= disY * 0.2;
            rotY += disX * 0.2;

            $('.box').css({
                transform: 'rotateX('+ rotX +'deg) rotateY('+ rotY +'deg)',
            })

            lastX = nowX;
            lastY = nowY;


        })
        $('body').on('mouseup', function (e) {
            $('body').off('mousemove');
            timer = setInterval(function () {
                disX *= 0.9;
                disY *= 0.9;

                rotX -= disY * 0.2;
                rotY += disX * 0.2;
    
                $('.box').css({
                    transform: 'rotateX('+ rotX +'deg) rotateY('+ rotY +'deg)',
                })
            },20);
            if(Math.abs(disX) < 0.1 && Math.abs(disY) < 0.1) {
                clearInterval(timer);
            }
        });
        return false;
    })
}