// components/nav/cmp.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        magazineTypeArr: ["轻芒","兴趣","物质","世界","新事","灵魂"],
        magazineIndex: 0,
        magazineId: 'magazine0'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTap (e) {
            // console.log(e);
            const index = e.currentTarget.dataset.index;
            const lastIndex = this.data.magazineIndex;

            this.setData({
                magazineIndex: index,
                magazineId: 'magazine' + (index === 0 ? 0 : index - 1)
            })

            if (lastIndex == index) {
                return
            }

            this.triggerEvent('nav', {
                index
            }, {});
        }
    }
})
