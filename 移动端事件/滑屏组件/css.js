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