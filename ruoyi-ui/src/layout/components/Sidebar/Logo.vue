<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" :style="{ backgroundColor:'#111'}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logoSamll" style="width: 40px;padding: 0;margin: auto;" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/images/meau-logo.png'
import logoSamll from '@/assets/images/meau-small-logo.png'

import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    }
  },
  data() {
    return {
      title: 'UA-LARK管理系统',
      logo: logoImg,
      logoSamll: logoSamll,
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  background: #F8F8F8;
  text-align: center;
  overflow: hidden;
  padding: 15px 0;
  border-bottom: 1px solid #1d1d1d;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 75%;
      display: block;
      padding-left: 20px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
