<template>
  <div>
    <div class="preview-mobile">
      <img class="bg" src="@/assets/images/mobile.png">
      <div v-loading="loading" class="preview-Box">
        <div class="sameBox">
          <div><img v-if="previewData.pic" :src="previewData.pic"></div>
          <h2 v-if="previewData.activityName">{{previewData.activityName}}</h2>
          <div class="time" v-if="!!previewData.activityTime && !!previewData.activityTime.length">
            <i class="icon el-icon-time"></i><span>{{previewData.activityTime[0]}}</span> - <span>{{previewData.activityTime[1]}}</span>
          </div>
          <div class="address" v-if="!!previewData.provinceName || !!previewData.cityName || !!previewData.addr">
            <i class="icon el-icon-location-outline"></i>
            <span>{{previewData.provinceName}}</span> <span>{{previewData.cityName}}</span> <span>{{previewData.addr}}</span>
          </div>
        </div>

        <div class="mt10" v-html="previewData.activityDetail"></div>
      </div>
    </div>
    <div class="text-center">
      <el-button type="primary" icon="el-icon-view" @click="preview">预览</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      previewData: {
        type: Object,
        default: {
          // activityName:'',
          // activityTime:[],
          // addr:'',
        }
      }
    },
    components: {},
    data() {
      return {
        loading: false
      }
    },
    created() {
      console.log('previewData', this.previewData)
    },
    mounted() {
    },
    methods: {
      preview() {
        this.loading = true
        this.$emit('previewFn')
        setTimeout(() => {
          this.loading = false
        }, 200)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .preview-mobile {
    width: 382px;
    border-radius: 15px;
    margin: 0 auto;
    font-size: 12px;
    position: relative;

    .bg {
      position: relative;
      z-index: 1;
    }

    .preview-Box {
      position: absolute;
      z-index: 2;
      left: 50%;
      top: 115px;
      transform: translateX(-50%);
      border-radius: 5px;
      width: 85%;
      height: 600px;
      overflow-y: scroll;

      h2{
        font-size: 16px;
        color: #000;
      }

      .icon{margin-right: 3px;}
      .time,.address{
        margin-bottom: 10px;
      }

      img {
        max-width: 100% !important;
      }

      &::-webkit-scrollbar {
        transition: 0.5s all;
        opacity: 0;
        width: 6px;
        height: 0;
      }

      &::-webkit-scrollbar-track {
      }

      &::-webkit-scrollbar-thumb {
        background: rgb(129 126 126 / 40%);
        border-radius: 10px;
        opacity: 0;
      }
    }


  }

</style>
<style>
  .preview-Box img {
    max-width: 100% !important;
  }
</style>
