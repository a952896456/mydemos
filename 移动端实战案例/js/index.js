
// 滑屏导航
(function () {
    const nav_scroll = document.querySelector('.nav .nav_scroll');
    swiper({
        wrap: nav_scroll,
        dir: 'x',
        backOut: 'none',
        scrollBar: false,
    })
})();

// 折叠导航
(function () {
    const more = document.querySelector('.nav_scroll .more');
    const nav_content = document.querySelector('.nav .nav_content');

    let shrink = false; // 是否折叠了

    more.addEventListener('touchend', () => {
        let child = more.children[0],
            rotateValue = shrink ? 0 : 180, // 小三角旋转的角度
            heightValue = shrink ? 0 : 280; // 内容区域的高度

        css(child, { rotate: rotateValue });
        tweenMove({
            el: nav_content,
            type: 'linear',
            to: {
                height: heightValue
            },
            time: 200,
            callBack() {
                shrink = !shrink;
            }
        })
    })

})();

// 轮播图
(function () {
    const banner = document.querySelector('.banner');
    const banner_wrap = document.querySelector('.banner_wrap');
    const banner_circle = document.querySelectorAll('.banner_circle span');
    const imgWidth = banner.offsetWidth;
    let startPoint = {},
        distance = {},
        cn = 0,
        ln = 0,
        timer;

    banner_wrap.innerHTML += banner_wrap.innerHTML;

    swiper({
        wrap: banner,
        dir: 'x',
        scrollBar: false,
        backOut: 'none',
        start(e) {
            clearInterval(timer);
            startPoint = {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
            }

            if (cn == 0) {
                cn = banner_wrap.children.length / 2;
            }

            if (cn == banner_wrap.children.length - 1) {
                cn = banner_wrap.children.length / 2 - 1;
            }

            css(banner_wrap, { translateX: - cn * imgWidth })
        },
        end(e) {
            // 轮播图抬起不需要缓冲
            cancelAnimationFrame(banner_wrap.timer); // 取消缓冲

            distance = {
                x: e.changedTouches[0].pageX - startPoint.x,
                y: e.changedTouches[0].pageY - startPoint.y,
            }

            let backWidth = imgWidth / 8;

            if (Math.abs(distance.x) > backWidth) {
                cn -= distance.x / Math.abs(distance.x);
            }

            tweenMove({
                el: banner_wrap,
                type: 'linear',
                to: {
                    translateX: - cn * imgWidth
                },
                time: 200
            });

            autoPlay(); // 手指抬起的时候需要让自动播放继续

            banner_circle[ln].className = '';
            banner_circle[cn % (banner_wrap.children.length / 2)].className = 'active';
            ln = cn % (banner_wrap.children.length / 2);
        }
    });

    const picMove = () => {
        cn++;
        tweenMove({
            el: banner_wrap,
            type: 'linear',
            to: {
                translateX: - cn * imgWidth
            },
            time: 200,
            callBack() {
                if (cn >= banner_wrap.children.length - 1) {
                    cn = banner_wrap.children.length / 2 - 1;
                    css(banner_wrap, { translateX: - cn * imgWidth })
                }
            }
        });

        banner_circle[ln].className = '';
        banner_circle[cn % (banner_wrap.children.length / 2)].className = 'active';
        ln = cn % (banner_wrap.children.length / 2);
    }

    function autoPlay() {
        clearInterval(timer);
        timer = setInterval(() => {
            picMove();
        }, 2500)
    }

    autoPlay();

})();

// 整个页面的滑动
(function () {
    const wrap = document.querySelector('.wrap'),
        header = document.querySelector('.scroll .header'),
        nav = document.querySelector('.scroll .nav'),
        navTop = nav.getBoundingClientRect().top,
        refresh = document.querySelector('.scroll .refresh'),	//刷新内容的dom
        articleList = document.querySelector('.articleWrap .list'),
        updateTip = document.querySelector('.articleWrap .updateTip');

    let isRefresh = false;

    swiper({
        wrap: wrap,
        dir: 'y',
        move() {
            const scrollY = css(wrap.children[0], 'translateY');
            // console.log(scrollY, navTop)
            if (scrollY < -navTop) {
                // 这个条件成立的时候说明现在用户拖动的距离已经把导航拖出去了
                css(header, { translateY: -(scrollY + navTop) });
            } else {
                css(header, { translateY: 0 });
            }

            // 往下拉的时候始终让头部定在上面
            if (scrollY > 0) {
                css(header, { translateY: -scrollY })
            }

            // 在手指滑动的时候需要去改变刷新内容的文字
            if (scrollY > 80) {
                refresh.innerHTML = '松开更新内容';
                isRefresh = true;
            } else {
                refresh.innerHTML = '下拉刷新内容';
                isRefresh = false;
            }
        },
        toTop() {
            // console.log(isRefresh)
            if (isRefresh) {
                // 可以刷新数据
                getData('refresh', () => {
                    css(updateTip, {opacity: 1});
                    setTimeout( () => {
                        css(updateTip, {opacity: 0});
                    }, 1500)
                });
            }
        },
        toEnd() {
            getData('add');
        }
    })

    // type 决定这个数据是用来刷新还是增加的 add => 增加  refresh => 刷新
    // callBack 数据请求成功后的回调函数
    function getData(type, callBack) { // 用来请求数据
        jsonp({
            url: 'https://data.autohome.com.cn/rcm/automobile/lands',
            data: {
                uid: 0,
                number: 10
            },
            callBack: "_callback",
            succ(data) {
                createDom(data.result.list, type);
                callBack && callBack();
            }
        });
    }

    // data 请求过来的数据
    // type 是刷新还是增加
    function createDom(data, type) { // 根据拿到的数据创建DOM
        // console.log(data);
        let html = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i].graphic_img_list3) {
                let imgArr = data[i].graphic_img_list3.split('㊣');
                // console.log(imgArr)
                html += `<article>
                            <a href="#">
                            <div class="content">
                            <dl>
                            <dt>
                                <h3>${data[i].title}</h3>
                            </dt>
                            <dd><img src="${imgArr[0]}" alt=""></dd>
                            <dd><img src="${imgArr[1]}" alt=""></dd>
                            <dd><img src="${imgArr[2]}" alt=""></dd>
                            </dl>
                            <div class="author">
                                 ${data[i].authorname} 观看 ${data[i].viewcount}
                            </div>
                            </div>
                             </a>
                        </article>`
            } else {
                html += `<article>
                <a href="#">
                    <div class="text">
                        <h3>${data[i].title}</h3>
                        <div class="author">
                            ${data[i].authorname} 观看 ${data[i].viewcount}
                        </div>
                    </div>
                    <div class="img">
                        <img src="${data[i].imgurl}" alt="">
                    </div>
                </a>
                </article>`
            }
        }

        if (type == 'add') { 
            articleList.innerHTML += html;
        } else if (type == 'refresh') {
            articleList.innerHTML = html;
        }

    }

    getData('add');

})();

// https://data.autohome.com.cn/rcm/automobile/lands?uid=0&number=10&_callback=jsonp_1552724209663
/* jsonp({
    url:'https://data.autohome.com.cn/rcm/automobile/lands',
    data:{
        uid:0,
        number:10
    },
    callBack:"_callback",
    succ(data){
        console.log(data);
    }
}); */

/*
    type	决定这个数据是用来刷新还是增加的，add=>增加，refresh=>刷新
    callBack	数据请求成功后的回调函数
 */