var timer = null;
var slidePage = document.getElementsByClassName('slidePage')[0];
var moveWidth = slidePage.children[0].offsetWidth;
var num = slidePage.children.length - 1;
var leftBtn = document.getElementsByClassName('leftBtn')[0];
var rightBtn = document.getElementsByClassName('rightBtn')[0];
var oSpanArr = document.getElementsByClassName('slideIndex')[0].getElementsByTagName('span');
var index = 0;
var lock = true;

// 左轮播
leftBtn.onclick = function () {
    autoMove('left');
}

// 右轮播
rightBtn.onclick = function () {
    autoMove('right');
}

// 圆点点击
for(var i = 0; i < oSpanArr.length; i++) {
    (function (myIndex) {
        oSpanArr[i].onclick = function () {
            lock = false;
            clearTimeout(timer);
            index = myIndex;
            startMove(slidePage, {left: - index * moveWidth}, function () {
                lock = true;
                setTimeout(autoMove, 1000);
                
            })
            changeIndex(index);
        }
    } (i))
}

// 自动轮播 默认方向从左往右
function autoMove(direction) {
    if(lock) {
        lock = false;
        clearTimeout(timer);
        if(!direction || direction == 'right') {
            startMove(slidePage, {left: slidePage.offsetLeft - moveWidth}, function () {
                if(slidePage.offsetLeft == - num * moveWidth) {
                    slidePage.style.left = '0px';
                    index = 0;
                }else {
                    index ++;
                }
                timer = setTimeout(autoMove, 1000);
                lock = true;                
            })
            // console.log(index);
            changeIndex(index);
        }else if (direction == 'left') {
            index --;
            if(slidePage.offsetLeft == 0) {
                index = num - 1;
                slidePage.style.left = - num * moveWidth + 'px';
            }
            startMove(slidePage, {left: slidePage.offsetLeft + moveWidth}, function () {
                timer = setTimeout(autoMove, 1000);
                lock = true;                
            })
            changeIndex(index);
        }
    }
}

function changeIndex(_index) {
    for(var i = 0; i < oSpanArr.length; i++) {
        oSpanArr[i].className = '';
    }
    oSpanArr[index].className = 'active';
}

timer = setTimeout(autoMove, 1000);