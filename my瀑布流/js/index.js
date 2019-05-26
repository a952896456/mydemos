
var oLi = document.getElementsByClassName('col');
var flag = false;
var page = 1;
// 获取图片数据
function getData() {
    // if (flag)  {
    //     return false;
    // }
    flag = true;
    ajax('GET', 'js/getPics.php', 'cpage=' + page, true, renderDom);
}


// 渲染页面
function renderDom(data) {
    data = typeof data === 'string' ? JSON.parse(data) : data;
    data.forEach(function (item, index) {
        var itemDom = addDom(item);
        var minIndex = getMinLi();
        oLi[minIndex].appendChild(itemDom);
    });
    flag = false;
    page ++;
}
function addDom(data) {
    var itemDom = document.createElement('div');
    var imageDiv = document.createElement('div');
    var img = new Image();
    img.src = data.preview;

    img.style.height = data.height / data.width * oLi[0].offsetWidth + 'px';
    // console.log(data.height, data.width, oLi[0].offsetWidth, img.height)
    var p = document.createElement('p');
    p.innerText = data.title;
    itemDom.className = 'item';
    imageDiv.appendChild(img);
    itemDom.appendChild(imageDiv);
    itemDom.appendChild(p);
    // img.onerror = function () {

    // }
    return itemDom;
}


//  查找最短的列  用于填充图片
function getMinLi() {
    var oLi = document.getElementsByClassName('col');
    var minIndex = 0;
    var minHeight = oLi[minIndex].offsetHeight;
    // console.log(minHeight);
    for (var i = 1; i < oLi.length; i++) {
        if (oLi[i].offsetHeight < minHeight) {
            minHeight = oLi[i].offsetHeight;
            minIndex = i;
        }
    }
    return minIndex;
}
var timer = null;
window.onscroll = function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    var minHeight = oLi[getMinLi()].offsetHeight;
    if (scrollTop + clientHeight > minHeight) {
        clearTimeout(timer);
        if (!flag) {
            timer = setTimeout(function () {
                getData();
            }, 2000)
        }
    }
}
getData();