// 事件与结构显示交互

(function () {
    var obj = {
        init: function () {
            location.hash = 'student-echarts';
            this.bindEvent();
        },
        bindEvent: function () {
            var list = $('header .drop-list');
            $('.btn').on('click', function () {
                list.slideToggle();
            });
            list.on('mouseleave', function () {
                $(this).slideUp();
            });
            $('.list-item').on('click', function () {
                var hash = $(this).attr('data-id');
                // console.log(hash);
                location.hash = hash;
                $('.list-item.active').removeClass('active');
                $(this).addClass('active');
                return false;
            });

            $(window).on('hashchange', function () {
                var hash = location.hash.slice(1);
                var content = $('#' + hash);
                $('.show-list').removeClass('show-list');
                $(content).addClass('show-list');
            });

            $('.modal').on('click', function () {
                $('.modal').hide();
            });
            $('.modal-content').on('click', function (e) {
                e.stopPropagation();
            });
            $('.del-modal').on('click', function () {
                $('.del-modal').hide();
            });
            $('.del-modal .con').on('click', function (e) {
                e.stopPropagation();
            });
            $('.reset-btn').on('click', function () {
                $('.del-modal').hide();
            });
        }
    }
    obj.init();
})()