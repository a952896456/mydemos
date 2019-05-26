
function init() {
    bindEvent();
}

// 绑定事件
function bindEvent() {
    // 回车发送
    $('#inp').keyup(function (e) {
        if(e.keyCode == 13) {
            $('#submit').trigger('click');
        } 
    });
    // 点击发送
    $('#submit').click(function (e) {
        var value = $('#inp').val();
        // 判断有无值，渲染结构
        if(value) {
            addDom('mine', value);
            getData(value);
            $('#inp').val('');
        }
    });
}

// 文字添加到页面中去
function addDom(who, val) {
    $('<div class="'+ who +'">\
    <div class="avtor"></div>\
    <div class="text">'+ val +'</div>\
    </div>').appendTo($('.content-box'));
    var scrollHeight = $('.content-box')[0].scrollHeight;
    var innerHeight = $('.content-box').innerHeight();
    $('.content-box').scrollTop(scrollHeight - innerHeight);
}

// 获取机器人说话内容
function getData(val) {
    $.ajax({
        url: 'http://api.duyiedu.com/api/chat/sendMsg',
        type: 'GET',
        data: {
            appkey: 'he19980804__1547825419047',
            msg: val,
        },
        dataType: 'json',
        success: function(res) {
            // console.log(res);
            if(res.status == 'success') {
                addDom('robot', res.data.text);
            }
        }
    })
}

init();