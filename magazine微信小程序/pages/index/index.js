// pages/index/index.js
import {IndexModel} from '../../model/index';
import {random} from '../../utils/randomStr';

const indexModel = new IndexModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        articleList: [],
        markList: [],
        recommend: {},
        getMore: '',
        magazineId: 0,
        loading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // request.getData({url: '/getRecommendInfo/0'}).then(res => {
        //     console.log(res);
        // })


        // request.getData({url: '/getMarkTypeList/0'}).then(res => {
        //     console.log(res);
        // })


        // request.getData({url: '/getIndexArticleList/0/0'}).then(res => {
        //     console.log(res);
        // })

        // // 首页文章列表
        // indexModel.getArticleList().then(res => {
        //     console.log(res);
        // });
        // // 首页标记标签列表
        // indexModel.getMarkList().then(res => {
        //     console.log(res);
        // });
        // // 首页推荐详情
        // indexModel.getRecommendInfo().then(res => {
        //     console.log(res);
        // });
        this.getData();
        // wx.showLoading();

    },

    getData (magazineId) {
        const articleList = indexModel.getArticleList(magazineId);
        const markList = indexModel.getMarkList(magazineId);
        const recommend = indexModel.getRecommendInfo(magazineId);
        Promise.all([articleList,markList,recommend]).then(res => {
            // console.log(res[0], res[1], res[2]);
            this.setData({
                articleList: res[0],
                markList: res[1],
                recommend: res[2]
            })
            // wx.hideLoading();
            this.hideLoading();
        })
    },
    onCatalog () {
        wx.switchTab({
            url: '/pages/catalog/catalog'
        })
    },
    onReachBottom () {
        this.setData({
            getMore: random(20)
        })
    },
    hideLoading () {
        this.setData({
            loading: false
        })
    },
    onNav (e) {
        // console.log(e);
        const magazineId = e.detail.index;

        this.setMagazineId(magazineId);
        this.resetData();
        this.getData(magazineId);
        this.scrollPageTop();

    },
    resetData () {
        this.setData({
            articleList: [],
            markList: [],
            recommend: {}
        })
    },
    scrollPageTop () {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })
    },
    setMagazineId (magazineId) {
        this.setData({
            magazineId
        })
    }
})