<template>
  <div class="m-istyle">
    <dl @mouseover="over" :class="nav.class">
      <dt>{{nav.title}}</dt>
      <dd
        v-for="(item,index) in nav.list"
        :key="index"
        :class="{active: kind == item.type}"
        :data-type="item.type"
      >{{item.text}}</dd>
    </dl>
    <ul class="ibody">
      <li v-for="(item,index) in resultsData[kind]" :key="index">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img :src="item.image" class="image">
          <div class="cbody">
            <div class="title" :title="item.title">{{item.title}}</div>
            <div class="sub-title" :title="item.sub_title">{{item.sub_title}}</div>
            <div class="price-info">
              <span class="current-price-wrapper">
                <span class="price-symbol numfont">¥</span>
                <span class="current-price numfont">{{item.price}}</span>
                <span class="sold bottom-right-info">{{item.address}}</span>
              </span>
              <!-- <span class="old-price">门市价￥{item.price_info.old_price}}</span>
              <span class="sold bottom-right-info">{{item.address}}</span> -->
            </div>
            <!-- <div class="price-info" v-else-if="!item.rentNum">
              <span class="current-price-wrapper">
                <span class="price-symbol numfont">¥</span>
                <span class="current-price numfont">抢光了</span>
                <span class="sold bottom-right-info">{{item.address}}</span>
              </span>
            </div>
            <div class="price-info" v-else>
              <span class="current-price-wrapper">
                <span class="price-symbol numfont">¥</span>
                <span class="current-price numfont">
                  {{item.price_info.avg_price}}
                </span>
                <span class="units">
                  /{{item.price_info.units}}均
                </span>
                <span class="sold bottom-right-info">{{item.address}}</span>
              </span>
            </div> -->
          </div>
        </el-card>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '@/api/index.js'
export default {
  data() {
    return {
      kind: "all",
      resultsData: {}
    };
  },
  props: ["nav"],
  created() {
    api.getResultProducts().then(res => {
      console.log(res.data.data);
      this.resultsData = res.data.data;
    })
  },
  methods: {
    over(e) {
      let dom = e.target;
      let tagName = dom.tagName.toLowerCase();
      if (tagName != "dd") {
        return false;
      }
      let kind = dom.getAttribute("data-type");
      this.kind = kind;
      // 动态获取数据 ajax请求
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/index/artistic.scss";
</style>