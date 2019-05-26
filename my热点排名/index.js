(function (data) {
    // 初始化变量
    var $Wrapper = $('.wrapper');
    var $showSection = $Wrapper.find('.showSection');
    var colorArr = ['#f54545', '#ff8547', '#ffac38'];
    var totalPage = Math.ceil(data.length / 10);
    var curPage = 0;

    $showSection.hide();

    function bindEvent() {
        $Wrapper.find('.change').on('click', function () {
            curPage = ++curPage % totalPage;
            renderPage(data);
        })
    }

    function renderPage(data) {
        // 清空之前的值
        $showSection.hide().find('.showItem').remove();
        // 根据数据渲染页面
        // 34
        // 10 20 30 34
        var len = (data.length - curPage * 10 >= 10) ? 10 : data.length - curPage * 10;
        for (var i = 0; i < len; i++) {
            var $Clone = $showSection.find('.tpl').clone().removeClass('tpl').addClass('showItem');
            // console.log($Clone);
            var ele = data[i + curPage * 10];
            $Clone.find('span')
                .eq(0)
                .text(i + curPage * 10 + 1)
                .css('backgroundColor', curPage == 0 && colorArr[i + curPage])
                .next()
                .text(ele.title)
                .next()
                .text(ele.search)
                .addClass(ele.hisSearch > ele.search ? 'down' : 'up');
            $showSection.append($Clone);
        }
        $showSection.fadeIn();
    }
    
    bindEvent();
    renderPage(data);
})(data);