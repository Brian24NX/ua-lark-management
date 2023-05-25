<template>
  <div class="app-container">
    <div class="noData">
      <img src="@/assets/images/noData.png">
      <strong>暂无权限</strong>
      <p>请与管理员联系以获取权限</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  beforeRouteEnter(to, form, next){
    next(vm =>{
      try {
        let pathArr = vm.$store.state.permission.addRoutes
        let path = pathArr[0].path + '/' + pathArr[0].children[0].path
        vm.$router.push(path);
      } catch (e) {
      }
    })
  },
  data() {
    return {
      // 版本号
      version: "3.8.5"
    };
  },
};
</script>

<style scoped lang="scss">
  .app-container{
    height: calc(100vh - 135px);
  }
  .noData{
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img{
      display: block;
      margin: 0 auto 25px;
      width: 400px;
    }
  }
</style>

