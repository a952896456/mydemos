// pages/search/search.js
import {SearchModel} from "../../model/search";
import {random} from "../../utils/randomStr";
const searchModel = new SearchModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchWord: '',
        more: '',
        searching: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options);
        const searchWord = options.searchWord;
        this.setData({
            searchWord
        })

        this.getData(searchWord);
    },
    getData (word) {
        const getSearchRecommend = searchModel.getSearchRecommend(word);
        const getSearchArticleList = searchModel.getSearchArticleList(word);
         Promise.all([getSearchRecommend, getSearchArticleList]).then( res => {
            //  console.log(res[0], res[1])
             this.setData({
                 tag: res[0].tag,
                 recommend: res[0].recommend,
                 articleList: res[1],
                 searching: false
             })
         })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            more: random(20)
        })
    },

})