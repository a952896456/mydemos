/* 
	//操作样式函数
	css(box,{width:300,opacity:0.5});	//设置
	css(box,width);	//获取 
*/
const css = (ele, attr) => {
	let transformAttr = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scale', 'scaleX', 'scaleY', 'translateX', 'translateY', 'translateZ'];

	const type = o => {
		let str = Object.prototype.toString.call(o);
		return str.match(/\[object (.*)\]/)[1].toLowerCase();
	}

	//true => 获取   false => 设置
	const getOrSet = type(attr) == 'object' ? false : true;	//用来检测用户到底要做哪种操作

	if (getOrSet) {
		//要做的事情是获取（第二个参数为字符串）
		if (transformAttr.includes(attr)) {	//如果为真的话代表要获取css3的属性
			return transform();
		} else {
			//获取css2的属性
			return parseFloat(getComputedStyle(ele)[attr]);
		}
	} else {
		//要做的事情是设置（第二个参数为对象）
		const attrKeys = Object.keys(attr);	//把用户要设置的属性名存到一个数组里

		for (let v of attrKeys) {
			ele.style[v] = v == 'opacity' ? attr[v] : attr[v] + 'px';
		}

		//设置css3的属性
		transform(attrKeys);	//把用户要设置的所有属性的名字做为参数传进去
	}


	//获取以及设置css3的属性
	function transform(attrKeys) {
		//el.transform={};	//用来存储用户已经设置过的所有css3的属性

		if (!ele.transform) {	//如果是第一次进来的话，元素身上是没有这条属性的，那就给它一个
			ele.transform = {}
		}

		//获取
		if (getOrSet) {	//此时用户传的第二个参数为字符串
			//如果用户没有设置过某个属性，那去获取的时候就会得到一个undefined。解决的方案就是，需要判断一下这条属性有没有被设置过，如果没有被设置过的话，就需要给他返回一个默认值
			if (!Object.keys(ele.transform).includes(attr)) {	//如果这个条件不成立就代表没有设置过
				if (attr == 'scale') {	//因为scale与其它属性的默认值是不一样的，所以判断
					return 1;
				} else {
					return 0;
				}
			}

			return ele.transform[attr];
		}

		//当代码走到这里的时候，代表是要设置属性
		for (let v of attrKeys) {	//这一步是把用户要设置的所有属性存到el.transform
			ele.transform[v] = attr[v];
		}

		//下面才是真正给元素身上添加属性
        /* 
            rotate	deg
            skew	deg
            scale	
            translate	px
         */

		let str = '';	//用来拼接所有要设置的属性（transform）	transform: rotate(60deg) scale(2) translateY(100px);


		//for(let v of attrKeys){	这里与视频里讲的做了修改，要用let v in el.transform，因为attrKeys里存放的是用户传入的参数。而el.transform里放的是用户设置过的参数。这两个是有区别的。用户传入的参数有可能是没设置过的，有可能是设置过的
		//for(let v of attrKeys){
		for (let v in ele.transform) {
			switch (v) {
				case 'rotate':
				case 'rotateX':
				case 'rotateY':
				case 'rotateZ':
				case 'skewX':
				case 'skewY':
					//str+='rotate(60deg)'
					str += v + `(${ele.transform[v]}deg) `;
					break;
				case 'scale':
				case 'scaleX':
				case 'scaleY':
					str += v + `(${ele.transform[v]}) `;
					break;
				case 'translateX':
				case 'translateY':
				case 'translateZ':
					str += v + `(${ele.transform[v]}px) `;
					break;
			}
		}

		ele.style.transform = str;
	}
}

/* 
	//运动函数
	tweenMove({
		el:要运动的元素,
		type:动画的类型,
		to:{	//运动的目的地
			left:200
		},
		time:动画时间,
		callBack:动画结束后的回调函数
		callIn:动画执行中的回调函数
	})
 */
const tweenMove = ({ el, type, to, time, callBack, callIn }) => {
	let t = 0,
		b = {},
		c = {},
		d = Math.round(time / 16.7);
	cancelAnimationFrame(el.timer);

	for (let v in to) {
		b[v] = css(el, v);
		c[v] = to[v] - b[v];
	}
	el.timer = requestAnimationFrame(move);


	let moveAttr = {};
	function move() {
		t++;

		if (t > d) {
			cancelAnimationFrame(el.timer);
			callBack && callBack.call(el);
			return;
		}

		for (let v in to) {
			moveAttr[v] = Tween[type](t, b[v], c[v], d);
			//console.log(to[v]==Math.round(moveAttr[v]));

			/* if(to[v]==Math.round(moveAttr[v])){
				cancelAnimationFrame(el.timer);
				callBack&&callBack.call(el);
				return;
			} */

			//因为scale属性会有很多的小数点，所以不能够直接变成整数
			if (to[v] == css(el, v)) {
				cancelAnimationFrame(el.timer);
				callBack && callBack.call(el);
				return;
			}
		}

		css(el, moveAttr);
		callIn && callIn.call(el);
		el.timer = requestAnimationFrame(move);
	}
}


/* 
	//滑屏函数
	swiper({
		wrap:父级元素（dom元素）,
		dir:拖动方向，x=>左右拖动，y=>上下拖动（String）,
		start(){
			//回调函数，手指按下时的回调函数
		},
		move(){
			//回调函数，滚动中的回调函数
		},
		end(){
			//回调函数，手指抬起后的回调函数
		},
		over(){
			//回调函数，滚动结束后的回调函数
		},
		toTop(){
			//回调函数，滚动到页面头部的回调函数
		}
		toEnd(){
			//回调函数，滚动到页面最底部的回调函数
		},
		backOut:'none'=>不允许超出，'back'=>拉力回弹,
		scrollBar:是否显示滚动条，显示=>true,隐藏=>false,
	});
 */
const swiper = ({ wrap, dir = 'y', start, move, end, over, toTop, toEnd, backOut = 'back', scrollBar = true }) => {
	const scroll = wrap.children[0]; // 要滚动的元素

	let startPoint = {}; // 手指按下的距离
	let startEle = {}; // 元素一开始的距离
	let movePoint = {}; // 元素移动的距离
	let targetEle = {}; // 元素走的距离


	let isDir = {
		x: false,
		y: false
	};
	let isFirMove = true;


	let curPoint = {}; // 当前手指坐标
	let lastPoint = {}; // 上一次手指坐标


	let lastDistance = 0; // 最后一次拖动的距离
	let lastTime = 0; // 上一次的时间点
	let nowTime = 0; // 当前次的时间点
	let lastTimeDistance = 0; // 最后一次拖动，所需要的时间

	// 存储元素能够走的最小值
	minDistance = {
		x: 0,
		y: 0
	}

	// 滚动条
	const bar = document.createElement('div');
	let scale = 1; // 滚动的滑块走的距离与内容滚动的距离是一个比值关系
	bar.className = 'scrollBar';
	bar.style.cssText = `position:absolute;
						 background: rgba(0,0,0,.6);
						 border-radius: 8px;
						 opacity: 0; ;
						 z-index: 100;`;


	wrap.addEventListener('touchstart', e => {
		cancelAnimationFrame(scroll.timer);
		start && start.call(wrap, e);

		lastPoint = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		}

		startPoint = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		}

		startEle = {
			x: css(scroll, 'translateX'),
			y: css(scroll, 'translateY')
		}

		// 在按下的时候给声明的范围赋值
		minDistance = {
			x: wrap.offsetWidth - scroll.offsetWidth,
			y: wrap.offsetHeight - scroll.offsetHeight
		}

		lastTime = Date.now(); // 在按下的时候，赋值
		lastDistance = 0; // 需要按下时把这个值清空，要不然拖动松开点击照样走

		// 如果滚动的内容有增加，就需要重新计算一下滚动条的值
		if (dir == 'x') {
			scale = wrap.clientWidth / scroll.offsetWidth;
			bar.style.width = scale * wrap.clientWidth + 'px';
			// 设备的高/滚动元素的高 = 滑块的高/设备的高 = scale
			bar.style.cssText += `left: 0; bottom: 0; height: 3px;`
		} else {
			scale = wrap.clientHeight / scroll.offsetHeight;
			bar.style.height = scale * wrap.clientHeight + 'px';
			bar.style.cssText += `right: 0; top: 0; width: 3px;`
		}

		if (scrollBar) { // 用户设置
			wrap.style.position = 'relative';
			wrap.appendChild(bar);
		}

		// css(bar, { 'opacity': 0.6 });

	});

	wrap.addEventListener('touchmove', e => {
		nowTime = Date.now();

		curPoint = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		}

		if (lastPoint.x == curPoint.x && lastPoint.y == curPoint.y) {
			return;
		}

		movePoint = {
			x: e.changedTouches[0].pageX - startPoint.x,
			y: e.changedTouches[0].pageY - startPoint.y
		}

		targetEle = {
			x: movePoint.x + startEle.x,
			y: movePoint.y + startEle.y
		}

		if (isFirMove) {
			if (Math.abs(movePoint.x) > Math.abs(movePoint.y)) {
				isDir.x = true;
				isDir.y = false;
				isFirMove = false;
			} else {
				isDir.x = false;
				isDir.y = true;
				isFirMove = false;
			}
		}

		if (isDir[dir]) {
			// 在这里要添加拖动的范围限制
			if (backOut == 'none') { // 直接不让用户再次拖动了
				targetEle[dir] = targetEle[dir] > 0 ? 0 : targetEle[dir];
				targetEle[dir] = targetEle[dir] < minDistance[dir] ? minDistance[dir] : targetEle[dir];
			} else if (backOut == 'back') { // 添加拉力回弹
				if (targetEle[dir] > 0) { // 拖到了头部
					targetEle[dir] *= 0.3;
				} else if (targetEle[dir] < minDistance[dir]) {
					let dis = minDistance[dir] - targetEle[dir]; // 底部出现空白区域的值
					targetEle[dir] = minDistance[dir] - dis * 0.3;
				}
			}

			css(scroll, { ['translate' + dir.toUpperCase()]: targetEle[dir] });
			css(bar, { ['translate' + dir.toUpperCase()]: -targetEle[dir] * scale, opacity: 0.6});

			// 在移动的时候，算出最后一次移动的距离以及移动这段距离所需要的时间
			lastDistance = curPoint[dir] - lastPoint[dir];
			lastTimeDistance = nowTime - lastTime;

			e.preventDefault();
		}


		//在用户拖动的时候也是需要让move方法执行的
		move && move.call(wrap, e);

		// 在最后的时候需要把上一次的坐标更新成当前次的坐标
		lastPoint.x = curPoint.x;
		lastPoint.y = curPoint.y;
		lastTime = nowTime;

	});

	wrap.addEventListener('touchend', e => {


		isFirMove = true;
		isDir = {
			x: false,
			y: false
		}

		// 在抬起的时候给一个时间点的判断，用于知道用户是否要做一个扔的动作
		if (Date.now() - lastTime > 100) {
			lastDistance = 0;
		}

		// 添加缓冲
		let lastSpeed = lastDistance / lastTimeDistance;
		lastSpeed = lastSpeed ? lastSpeed : 0; // 如果手指是从别的地方滑过来，以及
		// 点击了一次就会出现NaN的值，这里做的目的是为了把NaN换成0
		// console.log(lastSpeed);

		let buffer = lastSpeed * 200;
		// 要走的距离 = 当前的距离 + 缓冲的距离
		let target = Math.round(buffer + css(scroll, 'translate' + dir.toUpperCase()));

		// 限制范围的拖动，在手指抬起的时候需要取消缓冲
		if (target > 0) {
			if (target > 40) {
				toTop && toTop.call(wrap, e);
			}
			target = 0;
		} else if (target < minDistance[dir]) {
			target = minDistance[dir];
		}

		//如果用户拖动后并没有甩，就不需要执行tweenMove，直接执行回调函数
		if (target == Math.round(css(scroll, 'translate' + dir.toUpperCase()))) {
			end && end.call(wrap, e);
			return;
		}

		tweenMove({
			el: scroll,
			type: 'easeOutStrong',
			to: {
				['translate' + dir.toUpperCase()]: target,
			},
			time: 500,
			callIn() {
				move && move.call(wrap, e);
			},
			callBack() {
				// 当缓冲走完的时候才是加载数据的时候，而且要判断是不是到底部了
				if (target == minDistance[dir]) {
					// console.log(1);
					toEnd && toEnd.call(wrap, e);
				}
				over && over.call(wrap, e);
			}
		});

		tweenMove({
			el: bar,
			type: 'easeOutStrong',
			to: {
				['translate' + dir.toUpperCase()]: -target * scale,
			},
			time: 500,
			callBack() {
				css(bar, { 'opacity': 0 });
			}
		});

		end && end.call(wrap, e);
	})

}

/*
	单指滑动
		singleDrag({
			ele:元素,
			start(){
				//按下时的回调函数
			},
			move(){
				//拖动时的回调函数
			},
			end(){
				//抬起时的回调函数
			}
		});
 */

/*
	gesTure({
		ele:要添加事件的元素,
		start(){	//对应gesturestart
			//按下时要操作的事件
		}
		change(){	//对应gesturechange
			//手指移动时的回调
			//el.rotation	start与move的手指旋转角度的差值
			//el.scale		start与move的手指间的距离的比值
		}
		end(){	//对应gestureend
			//手指抬起时候的回调函数
		}
	}) 
*/
const gesTure = ({ ele, start, change, end }) => {
	let isGesture = false; // 用户是否要做手势事件
	let startPointDis = 0; // 按下时两个点的距离
	let startPointDeg = 0; // 按下时旋转的角度
	let lastScale = 1; // 上一次的缩放值
	let lastRotate = 0; // 上一次的旋转值

	ele.scale = 1;
	ele.rotation = 0;

	// 声明一些单指操作的变量
	let isSingleDrag = false,
		startPoint = {},
		distance = {},
		startEle = {},
		targetEle = {};

	ele.addEventListener('touchstart', e => {
		const touch = e.touches; // 当前屏幕上所有的手指列表
		if (touch.length >= 2) { // 这个条件代表现在屏幕上有2根及以上的手指
			isGesture = true;

			// 用户按下的时候
			lastScale = css(ele, 'scale');
			lastRotate = css(ele, 'rotate');

			startPointDis = getPointDis(touch[0], touch[1], 'distance'); // 按下时候两个手指之间的距离

			startPointDeg = getPointDis(touch[0], touch[1], 'angle');

			start && start.call(ele, e);
		}

		// 这个条件成立的时候说明用户只有一根手指在屏幕上
		if (touch.length < 2) {
			isSingleDrag = true;

			startPoint = {
				x: touch[0].pageX,
				y: touch[0].pageY
			}

			// 这里要乘以倍数的原因
			// 因为translate的值并不会因为缩放直接被改变
			startEle = {
				x: css(ele, 'translateX') * ele.scale,
				y: css(ele, 'translateY') * ele.scale
			}
		}
	})

	ele.addEventListener('touchmove', e => {
		const touch = e.touches; // 当前屏幕上所有的手指列表
		if (touch.length >= 2 && isGesture) { // 这个条件代表现在屏幕上有2根及以上的手指
			isGesture = true;

			const movePointDis = getPointDis(touch[0], touch[1], 'distance'); // 移动时候两个手指之间的距离
			ele.scale = movePointDis / startPointDis * lastScale; // 缩放值

			const movePointDeg = getPointDis(touch[0], touch[1], 'angle');
			ele.rotation = movePointDeg - startPointDeg + lastRotate;

			change && change.call(ele, e);
		}

		if (touch.length < 2 && isSingleDrag) {
			distance = {
				x: touch[0].pageX - startPoint.x,
				y: touch[0].pageY - startPoint.y
			}

			// 这里要除以倍数因为图片缩放后他要走的距离与手指走的距离不是1:1的关系了
			targetEle = {
				x: (distance.x + startEle.x) / ele.scale,
				y: (distance.y + startEle.y) / ele.scale
			}

			css(ele, { translateX: targetEle.x, translateY: targetEle.y });

		}
	})

	ele.addEventListener('touchend', e => {
		if (isGesture) { // 这个条件代表现在屏幕上有2根及以上的手指

			// 在手指抬起的时候添加一个缩放的范围
			if (ele.scale > 2) {
				tweenMove({
					el: ele,
					to: {
						scale: 2
					},
					time: 200,
					type: 'easeInStrong',
					callBack() {
						el.scale = 2;
					}
				})
			}

			if (ele.scale < 1) {
				tweenMove({
					el: ele,
					to: {
						scale: 1
					},
					time: 200,
					type: 'easeInStrong',
					callBack() {
						el.scale = 1;
					}
				})
			}

			end && end.call(ele, e);
		}

		isSingleDrag = false;
		isGesture = false;

	})

	// 求两点之间的距离 以及度数
	function getPointDis(p1, p2, type) {
		let x = p2.pageX - p1.pageX;
		let y = p2.pageY - p1.pageY;

		switch (type) {
			case 'distance':
				return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
				break;
			case 'angle':
				// Math.atan2计算方式：先拿第二个参数的x,y轴分别减去第一个参数的x,y
				// 得到一个坐标。这个坐标与x轴之间的旋转度数就是两条边之间的旋转差值
				// 如果这个坐标在x轴的上方，按逆时针旋转，值为负
				// 如果这个坐标在x轴的下方，按顺时针旋转，值为正
				// Math.atan2 算出来的是一个弧度
				return Math.atan2(y, x) * 180 / Math.PI;
				break;
		}

	}
}

var Tween = {
	linear: function (t, b, c, d) {  //匀速
		return c * t / d + b;
	},
	easeIn: function (t, b, c, d) {  //加速曲线
		return c * (t /= d) * t + b;
	},
	easeOut: function (t, b, c, d) {  //减速曲线
		return -c * (t /= d) * (t - 2) + b;
	},
	easeBoth: function (t, b, c, d) {  //加速减速曲线
		if ((t /= d / 2) < 1) {
			return c / 2 * t * t + b;
		}
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInStrong: function (t, b, c, d) {  //加加速曲线
		return c * (t /= d) * t * t * t + b;
	},
	easeOutStrong: function (t, b, c, d) {  //减减速曲线
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeBothStrong: function (t, b, c, d) {  //加加速减减速曲线
		if ((t /= d / 2) < 1) {
			return c / 2 * t * t * t * t + b;
		}
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	elasticIn: function (t, b, c, d, a, p) {  //正弦衰减曲线（弹动渐入）
		if (t === 0) {
			return b;
		}
		if ((t /= d) == 1) {
			return b + c;
		}
		if (!p) {
			p = d * 0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	elasticOut: function (t, b, c, d, a, p) {    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ((t /= d) == 1) {
			return b + c;
		}
		if (!p) {
			p = d * 0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	elasticBoth: function (t, b, c, d, a, p) {
		if (t === 0) {
			return b;
		}
		if ((t /= d / 2) == 2) {
			return b + c;
		}
		if (!p) {
			p = d * (0.3 * 1.5);
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		}
		else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		if (t < 1) {
			return - 0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
				Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		}
		return a * Math.pow(2, -10 * (t -= 1)) *
			Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	},
	backIn: function (t, b, c, d, s) {     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
			s = 1.70158;
		}
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	backOut: function (t, b, c, d, s) {
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	backBoth: function (t, b, c, d, s) {
		if (typeof s == 'undefined') {
			s = 1.70158;
		}
		if ((t /= d / 2) < 1) {
			return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		}
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	bounceIn: function (t, b, c, d) {    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d - t, 0, c, d) + b;
	},
	bounceOut: function (t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		}
		return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
	},
	bounceBoth: function (t, b, c, d) {
		if (t < d / 2) {
			return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	}
}