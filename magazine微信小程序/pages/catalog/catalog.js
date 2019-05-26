// pages/catalog/catalog.js
import {tagInfoList} from "../../utils/tagList";
import {SubscribeModel} from "../../model/subscribe";
const subscribeModel = new SubscribeModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tagInfoList: tagInfoList,
        myTagList: [],
        searchWord: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData();
    },
    getData () {
        const myTagList = subscribeModel.getMytagList();
        this.setData({
            myTagList
        })
    },
    onSubscribe () {
        this.getData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            searchWord: ''
        })
    },

})