<template>
  <div>
    <span class="name">按省份选择</span>
    <m-select
      :list="provinceList"
      :value="province"
      title="省份"
      :showWrapperActive="provinceActive"
      @change_active="changeProvinceActive"
      @change="changeProvince"
      className="province"
    />
    <m-select
      :list="cityList"
      :value="city"
      title="城市"
      :showWrapperActive="cityActive"
      @change_active="changeCityActive"
      @change="changeCity"
      :disabled="cityDisabled"
      className="city"
    />
    <span>直接搜索:</span>
    <el-select
      v-model="searchWord"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option v-for="item in searchList" :key="item" :label="item" :value="item"></el-option>
    </el-select>
  </div>
</template>

<script>
import MSelect from "./select.vue";
import api from '@/api/index.js';
export default {
  data() {
    return {
      provinceList: [],
      province: "省份",
      cityList: [],
      city: "城市",
      provinceActive: false,
      cityActive: false,
      searchList: ["山东", "甘肃", "黑龙江", "广东"],
      searchWord: '',
      loading: false,
      cityDisabled: true
    };
  },
  components: {
    MSelect
  },
  created() {
    api.getProvince().then(res => {
      this.provinceList = res.data.data.map((item) => {
        item.name = item.provinceName
        return item
      });
    })
  },
  methods: {
    changeProvinceActive(flag) {
      this.provinceActive = flag;
      if (flag) {
        this.cityActive = false;
      }
    },
    changeCityActive(flag) {
      this.cityActive = flag;
      if (flag) {
        this.provinceActive = false;
      }
    },
    changeProvince(item) {
      this.province = item.name;
      this.cityDisabled = false;
      this.cityList = item.cityInfoList;
    },
    changeCity(item) {
      this.city = item.name;
      this.$store.dispatch('setPosition', item);
      this.$router.push({name: 'index'})
    },
    remoteMethod(val) {
        // 请求后端接口
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/changecity/iselect.scss";
</style>