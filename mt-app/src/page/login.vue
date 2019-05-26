<template>
    <div class="page-login">
        <div class="login-header">
           <a class="logo" href="http://www.meituan.com"></a> 
        </div>
        <div class="login-panel">
            <div class="banner">
                <img src="https://s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg" alt="" />
            </div>
            <div class="form">
                <h4 class="tips" v-if="error">{{error}}</h4>
                <p>
                    <span>帐号登录</span>
                </p>
                <el-input :class="{error: error && !userName}" v-model="userName" placeholder="手机号/用户名/邮箱"
                    prefix-icon="profile"></el-input>
                <el-input :class="{error: error && !passWord}" v-model="passWord" type="password" placeholder="请输入密码"
                    prefix-icon="password">></el-input>
                <div class="foot">
                    <a href="#">忘记密码？</a>
                </div>
                <el-button @click="submit" class="btn-login" type="primary">登录</el-button>
                <p class="reg">
                    <span>还没有帐号？</span>
                    <router-link :to="{name: 'register'}">免费注册</router-link>
                </p>
                <div class="oauth-wrapper">
                    <h3 class="title-wrapper">
                        <span class="title">用合作网站帐号</span>
                    </h3>
                    <div class="oauth cf">
                        <a class="oauth__link oauth_link--qq" href="#"></a>
                        <a class="oauth__link oauth__link--weibo" href="#"></a>
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <ul>
                <li><a href="#">关于美团</a></li>
                <li><a href="#">加入我们</a></li>
                <li><a href="#">商家入驻</a></li>
                <li><a href="#">帮助中心</a></li>
                <li><a href="#">美团手机版</a></li>
            </ul>
            <p>©2019 美团网团购 meituan.com 京ICP证070791号 京公网安备11010502025545号</p>
        </footer>
    </div>
</template>

<script>
import api from '@/api/index.js';
export default {
    data() {
        return {
            userName: '',
            passWord: '',
            error: ''
        }
    },
    methods: {
        submit() {
            if(!this.userName) {
                this.error = '请输入帐号';
                return false;
            }
            if(!this.passWord) {
                this.error = '请输入密码';
                return false;
            }
            api.login({
                params: {
                    userName: this.userName,
                    password: this.passWord
                }
            }).then((res) => {
                console.log(res);
                if(res.data.status == 'success') {
                    this.$router.push({name: 'index'});
                    this.$store.commit('setUserName', this.userName)
                } else {
                    this.error = res.data.msg;
                }
            })
        }
    }
}
</script>

<style lang="scss">
    @import "@/assets/css/login/index.scss";
</style>