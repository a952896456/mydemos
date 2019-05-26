// components/nineImg/cmp.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        imgArr: Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgArr:['https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2735633715,2749454924&fm=27&gp=0.jpg',
                'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3967239004,1951414302&fm=27&gp=0.jpg',
                'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=889120611,3801177793&fm=27&gp=0.jpg',
                'https://ss2.bdstatic.com/6Ot1bjeh1BF3odCf/it/u=2193405341,3682037604&fm=191&app=48&size=h300&n=0&g=4n&f=JPEG?sec=1853310920&t=92bd955ae7113a4d7c05455b7b78caf0',
                'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3464499095,1074840881&fm=27&gp=0.jpg',
                'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1841976314,1708400549&fm=27&gp=0.jpg',
                'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=956313400,129937171&fm=27&gp=0.jpg',
                'https://ss2.bdstatic.com/6Ot1bjeh1BF3odCf/it/u=265726718,565835175&fm=191&app=48&size=h300&n=0&g=4n&f=JPEG?sec=1853310920&t=2d4787b9fe0effed9e861188b7493297',
                '/9.jpg',
            ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 图片点击
        onTap (e) {
            // console.log(e)
            const index = e.currentTarget.dataset.index;
            const array = this.data.imgArr;
            wx.previewImage({ // 预览图片
                urls: array,
                current: array[index]
            })
        }
    }
})
