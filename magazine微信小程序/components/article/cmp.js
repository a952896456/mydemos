// components/article/cmp.js
import {LikeModel} from "../../model/like";
const likeModel = new LikeModel();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        articleDetail: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        likeStatus: false
    },
    attached() {
        const articleDetail = this.data.articleDetail;
        const artId = articleDetail.artId;
        const likeStatus = likeModel.getLikeStatus(artId);

        this.setData({
            likeStatus
        })


        // const likeList = wx.getStorageSync('likeList') || [];
        // let likeStatus = false;
        // likeList.forEach((item, index) => {
        //     if (item.artId === artId) {
        //         likeStatus = true;
        //     }
        // });

        // this.setData({
        //     likeStatus: likeStatus
        // })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onLike(e) {
            // console.log(e.detail)
            const articleDetail = this.data.articleDetail;
            const artId = articleDetail.artId;
            const like = e.detail.like;
            // const likeList = wx.getStorageSync('likeList') || [];
            // console.log(like);
            if (like) {
                // 缓存文章
                // likeList.unshift(articleDetail);
                // wx.setStorageSync('likeList', likeList);
                likeModel.addLikeList(articleDetail);
            } else {
                // 取出
                likeModel.removeLikeList(artId);

                // let myIndex = 0;
                // likeList.forEach((item, index) => {
                //     if (item.artId === artId) {
                //         myIndex = index;
                //     }
                // })
                // likeList.splice(myIndex, 1);
                // wx.setStorageSync('likeList', likeList);
                // wx.removeStorageSync('likeList')
            }
        }
    }
})
