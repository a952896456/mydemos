// 将信息和图片渲染到页面
// 点击按钮
// 音频的播放与暂停 切歌
// 进度条运动与拖拽
// 图片旋转
// 列表切歌

var root = window.player; // 方法暴露在window.player上，用root接受
var nowIndex = 0; // 初始索引值为0
var dataList; // 数据
var len; // 数据长度
var audio = root.audioManager; // 控制音频的模块，有开始，暂停，获取音频资源的方法
var control; // 获取索引值的构造函数
var timer;

// ajax获取模拟数据
function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            dataList = data;
            len = data.length;
            control = new root.controlIndex(len);
            // console.log(control);
            // console.log(data)
            root.render(data[0]);
            audio.getAudio(data[0].audio);
            bindEvent();
            bindTouch();
            $('body').trigger('play-change', 0);
        },
        error: function () {
            console.log('error');
        }
    })
}

// 上一首， 开始暂停， 下一首的点击事件
function bindEvent() {
    $('body').on('play-change', function (e, index) {
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        if (audio.status == 'play') {
            rotated(0);
            audio.play();
        }
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            transform: 'rotateZ(0deg)',
            transition: 'none',
        })

        // console.log(dataList[index].duration);
        root.pro.renderAlltime(dataList[index].duration);
    });
    $('.prev').on('click', function () {
        // if(nowIndex == 0) {
        //     nowIndex = len - 1; 
        // }else {
        //     nowIndex --;
        // }
        // var i = root.controlIndex.prev();
        var i = control.prev();
        // console.log(i);

        $('body').trigger('play-change', i);
        // audio.getAudio(dataList[i].audio);
        // root.render(dataList[i]);
        // if(audio.status == 'play') {
        //     audio.play();
        // }
        root.pro.start(0);
        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });
    $('.next').on('click', function () {
        // if(nowIndex == len - 1) {
        //     nowIndex = 0; 
        // }else {
        //     nowIndex ++;
        // }
        // var i = root.controlIndex.next();
        var i = control.next();
        // console.log(i);

        $('body').trigger('play-change', i);
        // audio.getAudio(dataList[i].audio);
        // root.render(dataList[i]);
        // if(audio.status == 'play') {
        //     audio.play();
        // }
        root.pro.start(0);
        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });
    $('.play').on('click', function () {
        // console.log(audio)
        if (audio.status == 'pause') {
            audio.play();
            root.pro.start();
            var deg = $('.img-box').attr('data-deg');
            rotated(deg);
        } else {
            audio.pause();
            clearInterval(timer);
            root.pro.stop();
        }
        $('.play').toggleClass('playing');
    })
}

// 图片旋转
function rotated(deg) {
    clearInterval(timer);
    deg = +deg;
    timer = setInterval(function () {
        deg += 1;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            transform: 'rotateZ(' + deg + 'deg)',
            transition: 'all 1s linear',
        })
    }, 100)
}

getData('../mock/data.json');


// 拖拽事件  拖动小圆点 带着进度条运动
function bindTouch() {
    var $spot = $('.spot');
    var offset = $('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;
    $spot.on('touchstart', function () {
        root.pro.stop();
    }).on('touchmove', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per > 0 && per < 1) {
            root.pro.update(per);
        }
    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per > 0 && per < 1) {
            var curTime = per * dataList[control.index].duration;
            $('.play').addClass('playing');
            audio.playTo(curTime);
            audio.status = 'play';
            audio.play();
            root.pro.start(per);
        }
    })
}
