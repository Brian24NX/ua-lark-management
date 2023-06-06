<template>
  <div class="login">

    <div class="login-pic">
      <img src="@/assets/images/logo-cont.png">
    </div>

    <div class="login-main">

      <div class="login-main-box">
        <el-form v-show="codeType === 'account'" ref="loginForm" :model="loginForm" :rules="loginRules"
                 class="login-form">
          <div>
            <h3 class="title">账号密码登录</h3>
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                type="text"
                auto-complete="off"
                placeholder="请输入账号"
              >
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                auto-complete="off"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img"/>
              </div>
            </el-form-item>
            <el-checkbox v-if="false" v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">记住密码</el-checkbox>
            <el-form-item style="width:100%;margin-bottom: 45px;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
              <!--            <div style="float: right;" v-if="register">-->
              <!--              <router-link class="link-type" :to="'/register'">立即注册</router-link>-->
              <!--            </div>-->
            </el-form-item>
          </div>
          <div class="link-type code-log"><a :href="tohref">Lark授权登陆</a></div>

        </el-form>

        <div class="codeBox" v-show="codeType === 'wecode'">
          <div class="login__qrcode-container" id="login__qrcode-container" ref="qrCodeUrl">
          </div>
          <div @click="codeType = 'account'" class="link-type code-log"> <a :href="tohref">Lark登陆>> </a></div>
        </div>


      </div>

    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span><img src="http://www.beian.gov.cn/img/ghs.png" style="width:16px;height:16px;display:inline-block;margin-right:4px;">
        <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=2023005816" target="blank" class="copy-icon" rel="nofollow">沪ICP备2023005816号-1</a>｜</span>
      <span>UA | 版权所有</span>
    </div>
  </div>
</template>

<script>
  import { getCodeImg, wecomLogout } from '@/api/login'
  import Cookies from 'js-cookie'
  import { encrypt, decrypt } from '@/utils/jsencrypt'
  import { getQueryObject, queryURLParams } from '@/utils'
  import router from '../router'
  import { setToken } from '@/utils/auth'

  export default {
    name: 'Login',
    components:{
    },
    data() {
      return {
        tohref: '',
        imgUrl: '',
        codeUrl: '',
        codeType: 'account', // 默认wecode，wecode 企业微信--   account--账号登录
        loginForm: {
          username: 'admin',
          password: 'admin123',
          rememberMe: false,
          code: '',
          uuid: ''
        },
        loginRules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入您的账号' }
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入您的密码' }
          ],
          code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
        },
        loading: false,
        // 验证码开关
        captchaEnabled: false,
        // 注册开关
        register: false,
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          let _href = window.location.href
          this.redirect = getQueryObject(_href) && getQueryObject(_href).redirect || ''
          console.log('code', queryURLParams(_href))
          console.log('redirect', this.redirect)
          if (queryURLParams(_href) && queryURLParams(_href).code) {
            this.getStaffInfo(queryURLParams(_href).code)
          }
        },
        immediate: true
      }
    },
    created() {
      console.log('process.env.VUE_APP_BASE_API', process.env.VUE_APP_APPID)
      let appid = process.env.VUE_APP_APPID
      let redirect_uri = encodeURIComponent(process.env.VUE_APP_REDIRECT).replace(/'/g,"%27").replace(/"/g,"%22")
      this.tohref = 'https://open.larksuite.com/open-apis/authen/v1/index?app_id=' + appid + '&redirect_uri=' + redirect_uri
      this.getCookie()
    },
    mounted() {

    },
    methods: {
      getStaffInfo(code) {
        console.log('code', code)
        wecomLogout({
          wecomUserCode: code
        }).then(res => {
          if (res.token){
            setToken(res.token)
            this.$store.commit('SET_TOKEN', res.token)
            this.createRoute()
          }
        })
      },
      getCode() {
        getCodeImg().then(res => {
          this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
          if (this.captchaEnabled) {
            this.codeUrl = 'data:image/gif;base64,' + res.img
            this.loginForm.uuid = res.uuid
          }
        })
      },
      getCookie() {
        const username = Cookies.get('username')
        const password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.loginForm.rememberMe) {
              Cookies.set('username', this.loginForm.username, { expires: 30 })
              Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
              Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
            } else {
              Cookies.remove('username')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }

            this.$store.dispatch('Login', this.loginForm).then((res) => {
              console.log('res123', res.token)
              // this.$router.push({ path: this.redirect || '/' }).catch(() => {})
              this.createRoute()

            }).catch(() => {
              this.loading = false
              if (this.captchaEnabled) {
                this.getCode()
              }
            })

          }
        })
      },
      createRoute(){
        this.$store.dispatch('GenerateRoutes')
          .then((accessRoutes) => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            console.log(
              'permission.addRoutes',
              this.$store.state.permission.addRoutes
            )
            try {
              let pathArr = this.$store.state.permission.addRoutes
              let path = this.redirect || pathArr[0].path + '/' + pathArr[0].children[0].path
              console.log('123', path, window.location.origin + window.location.pathname + '#' + path)
            //  this.$router.push(path)
              window.location.href = window.location.origin + window.location.pathname + '#' + path
            } catch (e) {
              this.$router.push(this.redirect || '/')
            }

          })
          .catch((err) => {
            this.loadingSchoolCode = false
          })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #152c72 url("../assets/images/login-background.jpg");
    background-size: cover;
    position: relative;
  }

  .login-pic {
    width: 22%;
    min-width: 300px;
    position: absolute;
    left: 118px;
    top: 50%;
    transform: translateY(-50%);

    img {
      width: 100%;
      display: block;
    }
  }

  .login-main {
    position: absolute;
    width: 50%;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    .el-form-item {
      margin-bottom: 25px;
    }
  }

  .login__qrcode-container {
    text-align: center;
  }

  .title {
    margin: 0 auto 30px auto;
    text-align: center;
    color: #111;
  }

  .code-log {
    font-size: 14px;
    text-align: center;
    margin: 5% 0;
  }

  .codeBox {
    border-radius: 6px;
    background: #fff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    margin: auto;

    .wx-logo {
      color: #2D75FF;
      font-size: 18px;
      text-align: center;

      span, img {
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px;
      }
    }
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 55px 25px 5px 25px;
    margin: auto;

    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login-code-img {
    height: 38px;
  }</style>
