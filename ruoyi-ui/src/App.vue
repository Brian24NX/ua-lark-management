<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>
<script>
import ThemePicker from "@/components/ThemePicker";
export default {
  name: "App",
  components: { ThemePicker },
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
<style>
  .cssBuntton .el-button--primary{
    background-color: #152C73!important;
    border-color: #152C73!important;
  }
  .cssBuntton .itemBadge {
    margin-right: 20px;
  }
</style>
