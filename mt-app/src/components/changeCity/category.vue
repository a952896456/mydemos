<template>
    <div class="categroy">
        <dl class="m-categroy">
            <dt>按拼音首字母选择：</dt>
            <dd v-for="(item,index) in list" :key="index">
                <a :href="'#city' + item">{{item}}</a>
            </dd>
        </dl>

        <dl :id="'city' + index" class="m-categroy-section" v-for="(item,index) in cityGroup" :key="index">
            <dt>{{index}}</dt>
            <dd>
                <span @click="changeCity(city)" v-for="city in item" :key="city.id">{{city.name}}</span>               
            </dd>
        </dl>
    </div>
</template>

<script>
import api from '@/api/index.js';
export default {
    data() {
        return {
            list: 'ABCDEFGHIGKLMNOPQRSTUVWXYZ'.split(''),
            cityGroup: {}
        }
    },
    created() {
        api.getCityList().then(res => {
            var data = res.data.data;
            var obj = {};
            data.forEach((item,index) => {
            if(!obj[item.firstChar.toUpperCase()]) {
                obj[item.firstChar.toUpperCase()] = [];
            }
            obj[item.firstChar.toUpperCase()].push(item);
        });
        this.cityGroup = obj;
        })
        // var data =  [{
        //         "id": 1,
        //         "name": "北京",
        //         "pinyin": "beijing",
        //         "acroym": "bj",
        //         "rank": "S",
        //         "firstChar": "b"
        //     }];

    },
    methods: {
        changeCity(item) {
            this.$store.dispatch('setPosition', item);
            this.$router.push({name: 'index'});
        }
    }
}
</script>

<style lang="scss">
    @import '@/assets/css/changecity/categroy.scss';
</style>