<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

    <div class="right-menu">
<!--      <template v-if="device!=='mobile'">-->
<!--        <search id="header-search" class="right-menu-item" />-->
<!--        -->
<!--        <el-tooltip content="源码地址" effect="dark" placement="bottom">-->
<!--          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

<!--        <el-tooltip content="文档地址" effect="dark" placement="bottom">-->
<!--          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

<!--        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->

<!--        <el-tooltip content="布局大小" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

<!--      </template>-->


      <div style="width: 120px; margin-right: 20px">
        <el-select
          v-model="selectLang"
          :placeholder="$t('pleaseSelect')"
          @change="changeLangEvent(selectLang)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>


      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar"/>
          <span style="padding: 0 10px 0 5px;">{{$store.state.user.userData.nickName}} </span>
          <i class="el-icon-arrow-down"/>
        </div>
        <el-dropdown-menu slot="dropdown">
<!--          <router-link to="/user/profile">-->
<!--            <el-dropdown-item>个人中心</el-dropdown-item>-->
<!--          </router-link>-->
<!--          <el-dropdown-item @click.native="setting = true">-->
<!--            <span>布局设置</span>-->
<!--          </el-dropdown-item>-->
          <el-dropdown-item  @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import Cookies from 'js-cookie'
import i18n from "../../lang";

export default {
  data() {
    return {
      options: [
        {
          value: 'en',
          label: 'English'
        },
        {
          value: 'zh',
          label: '简体中文'
        },
        {
          value: 'ko',
          label: '한국어'
        },
      ],
      selectLang: '',
      token: this.$store.state.user.token,
    }
  },
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  created() {
    this.selectLang = this.getLanguage()
  },
  methods: {
    changeLangEvent(e) {
      this.selectLang = e
      this.$i18n.locale = this.selectLang
      Cookies.set('localeLang', this.selectLang)
      window.location.reload()
    },
    getLanguage() {
      const chooseLanguage = Cookies.get('localeLang')
      if (chooseLanguage) return chooseLanguage
      const language = (
        navigator.language || navigator.browserLanguage
      ).toLowerCase()
      const locales = this.options.map((ee)=> ee.value)
      for (const locale of locales) {
        if (language.indexOf(locale) > -1) {
          return locale
        }
      }
      return 'en'
    },

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm(this.$t('loginOutTips'), this.$t('tips'), {
        confirmButtonText: this.$t('logoutYes'),
        cancelButtonText: this.$t('logoutNo'),
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = process.env.VUE_APP_ROOT_PATH
          })
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 10px;
          margin: 0 5px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
