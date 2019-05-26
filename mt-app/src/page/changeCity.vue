<template>
    <div class="page-changeCity">
        <el-row>
            <province />    
        </el-row>
        <el-row>
            <hot-city title="热门城市:" :list="hotCity"></hot-city>
        </el-row>
        <el-row>
            <hot-city title="最近访问:" :list="recentCity"></hot-city>
        </el-row>
        <el-row>
            <categroy />
        </el-row>
    </div>

</template>

<script>
import Province from '@/components/changeCity/province.vue';
import HotCity from '@/components/changeCity/hot.vue';
import Categroy from '@/components/changeCity/category.vue';
import api from '@/api/index.js'
export default {
    data() {
        return {
            hotCity: [],
            recentCity: [],
        }
    },
    created() {
        api.getHotCity().then(res => {
            // console.log(res.data.data);
            this.hotCity = res.data.data.map((item) => item.name);
        });
        api.getRecentCity().then(res => {
            this.recentCity = res.data.data.map((item) => item.name);
        })
    },
    components: {
        Province,
        HotCity,
        Categroy
    }
}
</script>

<style scoped>

</style>