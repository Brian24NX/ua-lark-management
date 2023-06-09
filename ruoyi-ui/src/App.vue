<template>
  <div id="app">
    <router-view/>
    <theme-picker/>
  </div>
</template>
<script>
  import ThemePicker from "@/components/ThemePicker";

  export default {
    name: "App",
    components: {ThemePicker},
    metaInfo() {
      return {
        title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
        titleTemplate: title => {
          return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
        }
      }
    },
    // watch: {
    //   '$route': function () {
    //     setTimeout(()=>{
    //       this.pageSize()
    //     },1000)
    //   }
    // },
    // methods: {
    //   pageSize() {
    //     this.$nextTick(() => {
    //       alert(document.querySelector('.search').offsetHeight)
    //       let h = document.querySelector('.tableMain').offsetTop
    //       document.querySelector('.tableMain').style.height = document.body.clientHeight - h + 'px'
    //     })
    //   }
    // }
  };
</script>
<style scoped>
  #app .theme-picker {
    display: none;
  }
</style>
<style>
  #app {
    background: #f8f8f8;
  }

  .cssBuntton .el-button--primary {
    background-color: #152C73 !important;
    border-color: #152C73 !important;
  }

  .cssBuntton .itemBadge {
    margin-right: 20px;
  }

  .backBg {
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    padding: 15px 15px 0;
    margin-bottom: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .el-form--label-top .el-form-item__label {
    padding: 0 !important;
  }

  .labelNull {
    min-height: 32px;
  }

  .el-button--primary.is-disabled,
  .el-button--primary.is-disabled:active,
  .el-button--primary.is-disabled:focus,
  .el-button--primary.is-disabled:hover {
    color: #FFFFFF !important;
    background-color: #888888 !important;
    border-color: #888888 !important;
  }

  .content {
    /*min-height: 550px;*/
  }

  .findBtn{
    width: 175px;
    margin-right: 0!important;
    text-align: right;
  }

</style>
