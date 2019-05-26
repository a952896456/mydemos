
(function () {

    // 面向对象编程
    // 所有变量以对象属性的方式存在
    // 把所有的函数 以对象方法的形式存在
    function Swiper(options) {
        // 轮播图父级
        this.wrap = options.wrap;
        // 轮播图图片
        this.imgList = options.imgList;
        // 显示按钮
        this.showBtn = options.showBtn;
        // 轮播图图片长度
        this.imgListLen = options.imgList.length;
        // 图片宽度
        this.imgWidth = options.width || $(this.wrap).width();
        // 图片高度
        this.imgHeight = options.height || '100%';
        // 索引
        this.nowIndex = 0;
        this.itemWidth = this.wrap.css('width');
        this.itemHeight = this.wrap.css('height');
        // 加锁
        this.flag = true;
        // 创建结构
        this.creatDom();
        // 初始化样式
        this.initStyle();
        // 绑定事件
        this.bindEvent();
        // 自动轮播
        this.autoMove();
        

    }

    // 创建轮播图结构
    Swiper.prototype.creatDom = function () {
        // <div class="swiper">
        //     <ul class="swiper-list">
        //         <li><img src=""></li>
        //         <li><img src=""></li>
        //         <li><img src=""></li>
        //         <li><img src=""></li>
        //     </ul> 
        // </div>
        // <div class="leftBtn">&lt;</div>
        // <div class="rightBtn">&gt;</div>
        // <div class="dot">
        //     <span></span>
        //     <span></span>
        //     <span></span>
        //     <span></span>
        // </div>
        var swiperContent = $('<div class="swiper"></div>');
        var swiperList = $('<ul class="swiper-list"></ul>');
        var dotDom = $('<div class="dot"></div>');
        for (var i = 0; i < this.imgListLen; i++) {
            $('<li><img src=" ' + this.imgList[i] + '"></img></li>').appendTo(swiperList);
            $('<span></span').appendTo(dotDom);
        }
        swiperContent.append(swiperList)
            .append($('<div class="leftBtn">&lt;</div><div class="rightBtn">&gt;</div>'))
            .append(dotDom)
            .appendTo(this.wrap);
    }

    // 初始化样式
    Swiper.prototype.initStyle = function () {
        $('.swiper').css({
            width: this.imgWidth,
            height: this.imgHeight,
            overflow: 'hidden',
            position: 'relative',
            textAlign: 'center',
        })
        $('.swiper > .swiper-list').css({
            padding: 0,
            margin: 0,
            width: '100%',
            height: '100%',
            position: 'relative',
        })
        $('.swiper > .swiper-list > li').css({
            listStyle: 'none',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'none',
        }).eq(0).css({
            display: 'block',
        }).end().find('img').css({
            width: '100%',
            height: '100%',
        })
        $('.leftBtn,.rightBtn').css({
            width: '34px',
            height: '50px',
            lineHeight: '50px',
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#fff',
            fontSize: '30px',
            position: 'absolute',
            top: '50%',
            marginTop: '-20px',
            cursor: 'pointer',
        })
        $('.leftBtn').css({
            left: 10,
        })
        $('.rightBtn').css({
            right: 10,
        })
        $('.dot').css({
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
        })
        $('.dot span').css({
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#fff',
            marginRight: 15,
            cursor: 'pointer',
        }).eq(this.nowIndex).css({
            backgroundColor: '#f40',
        })
    }

    // 绑定事件
    Swiper.prototype.bindEvent = function () {
        var self = this;
        $('.leftBtn').on('click', function () {
            self.move('prev');
        })
        $('.rightBtn').on('click', function () {
            self.move('next');
        })
        $('.dot span').on('click', function () {
            // console.log($(this).index());
            var index = $(this).index();
            self.move(index);
        })
        $(window).on('resize', function () {
            self.itemWidth = parseInt(self.wrap.css('width'));
            self.itemHeight = parseInt(self.wrap.css('height'));

            var itemWidth = self.itemWidth;
            var itemHeight = self.itemHeight;
            // console.log(itemHeight, ' ', itemWidth)
            
            $('.swiper').css({
                width: itemWidth + 'px',
            });
            $('.swiper .swiper-list').css({
                width: itemWidth + 'px',
                height: itemHeight + 'px',
            });
            $('.swiper .swiper-list li').css({
                width: itemWidth + 'px',
                height: itemHeight + 'px',
            });
            $('.swiper .swiper-list li img').css({
                width: itemWidth + 'px',
                height: itemHeight + 'px',
            });

        })
    }

    // 自动轮播
    Swiper.prototype.autoMove = function () {
        var self = this;
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
            self.move('next');
        }, 1500)
    }

    // 运动
    Swiper.prototype.move = function (direction) {
        var self = this;
        if(self.flag) {
            self.flag = false;
            switch (direction) {
                case 'prev':
                    if (this.nowIndex == 0) {
                        this.nowIndex = this.imgListLen - 1;
                    } else {
                        this.nowIndex--;
                    }
                    break;
                case 'next':
                    if (this.nowIndex == this.imgListLen - 1) {
                        this.nowIndex = 0;
                    } else {
                        this.nowIndex++;
                    }
                    break;
                default:
                    this.nowIndex = direction;
                    break;
                    
        }
        $('.swiper-list li').fadeOut().eq(this.nowIndex).fadeIn(function () {
            self.flag = true;
            self.autoMove();
        });
        $('.dot span').css({
            backgroundColor: '#fff',
        }).eq(this.nowIndex).css({
            backgroundColor: '#f40',
        })
        }
    }

    $.fn.extend({
        carousel: function (options) {
            // 兼容父级 保存轮播图的父级
            options.wrap = this || $('body');
            // 兼容父级 保存轮播图的父级
            var swiper = new Swiper(options);
            // 链式调用
            return this;
        }
    })
}())