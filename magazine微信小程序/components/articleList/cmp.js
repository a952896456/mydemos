// components/articleList/cmp.js
import {IndexModel} from '../../model/index';
import {SearchModel} from '../../model/search';
const indexModel = new IndexModel();
const searchModel = new SearchModel();


Component({
    /**
     * 组件的属性列表
     */
    properties: {
        articleList: Array,

        more: {
            type: String,
            value: '',
            observer: 'loadMore'
        },

        magazineId: {
            type: Number,
            value: 0,
            observer: 'hasMoreData'
        },

        word: String
    },


    /**
     * 组件的初始数据
     */
    data: {
        loading: false,
        noMoreData: false
    },

    /**
     * 组件的方法列表
     */
    attached() {
        const curPages =  getCurrentPages();
        const index = curPages.length - 1;
        let type = ''
        
        if ( curPages[index].route === 'pages/search/search') {
          type = 'search'
        } else {
          type = 'index'
        }
    
        this.setData({
          type
        })
    
      },
    methods: {
        loadMore () {

            this.setData({
                noMoreData: false
              })

            if(this._isLock() || this.data.noMoreData) {
                return
            }

            this._loadLock();

            this.getMoreData();


        },
        hasMoreData () {
            this.setData({
                noMoreData: false
            })
        },
        _isLock () {
            return this.data.loading
        },

        _loadLock () {
            this.setData({
                loading: true
            })
        },

        _unLoadLock () {
            this.setData({
                loading: false
            })
        },

        _setMoreData (list) {
            // console.log(res);
            const combineList = this.data.articleList.concat(list);

            if (combineList.length === this.data.articleList.length) {
                this.setData({
                    noMoreData: true
                })
                return
            }

            this.setData({
                articleList: combineList,
            })
        },

        getMoreData() {
            const start = this.data.articleList.length;
            let getMore = null;

            if (this.data.type === 'search') {
                const word = this.data.word;
                getMore = searchModel.getSearchArticleList(word, start);
                // console.log(word);
                // searchModel.getSearchArticleList(word, start).then(res => {
                //     this._setMoreData(res);
                //     this._unLoadLock();
                // })

            } else {
                const magazineId = this.data.magazineId;
                getMore = indexModel.getArticleList(magazineId, start);
                // console.log('gaibian');
                // indexModel.getArticleList(magazineId, start).then(res => {
                //     // console.log(res);
                //     // const combineList = this.data.articleList.concat(res);
    
                //     // this.setData({
                //     //     articleList: combineList,
                //     // })
                //     this._setMoreData(res);
    
                //     this._unLoadLock();
                // })
            }

            getMore.then(res => {
                this._setMoreData(res);
                this._unLoadLock();
            })
        }
    }
})
