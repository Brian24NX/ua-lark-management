<template>
  <div class="bigMead">

    <div class="imgBoxs" v-if="mediaUrlList.length > 0" v-for="(item, index) in mediaUrlList" :key="index">
      <div v-if="item.type === 'image'" class="images">
        <img :src="item.url">
      </div>

      <div v-if="item.type === 'video'" class="video">
        <img src="@/assets/images/video.png">
        <i class="el-icon-video-play"></i>
      </div>

      <div class="hover-info">
        <i v-if="isFile" @click="openUrl(0,index)" class="el-icon-remove-outline"></i>
        <i @click="openUrl(1,item)" class="el-icon-zoom-in"></i>
      </div>
    </div>

    <div v-loading="fileLoading" v-if="isFile" class="imgBoxs" @click="upload">
      <i class="el-icon-plus">
        <input ref="file" type="file" name="" style="display: none" @change="onChange"/>
      </i>
    </div>


    <el-dialog
      :visible.sync="visible"
      title="预览"
      width="800"
      append-to-body
      @close="close"
      :close-on-press-escape="false"
      :close-on-click-modal="false"

    >
      <div v-if="suffix.type === 'image'">
        <img :src="suffix.url" style="display: block; width: 100%; margin: 0 auto"/>
      </div>
      <div v-if="suffix.type === 'video'">
        <video style="display: block; width: 100%; margin: 0 auto" controls :src="suffix.url"></video>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import {
    ccrUploadFileApi
  } from '@/api/ccrSheet'

  export default {
    props: {
      value: [String, Object, Array],
      // mediaUrl: {
      //   type: String,
      //   default: ''
      // },
      isFile: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value: {
        handler(val) {
          console.log('watch', val)
          if (!!val){
            let mediaUrlList = val.split(',')
            mediaUrlList.forEach((item) => {
              this.mediaUrlList.push({
                url: item,
                type: this.getUrLType(item)
              })
            })
          }
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        imgSuffix: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp'],
        videoSuffix: ['ogg', 'mp4', 'webm'],
        mediaUrlList: [],
        suffix: {},
        visible: false,
        fileLoading:false,
      }
    },
    mounted() {

    },
    methods: {
      getUrLType(filePath) {
        //  filePath = 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
        //filePath = 'https://www.meetbot.biz/res/static/video.mp4'

        let type = ''
        let index = filePath.lastIndexOf('.')
        let ext = filePath.substring(index + 1)

        if (this.imgSuffix.indexOf(ext) != -1) {
          type = 'image'
        } else if (this.videoSuffix.indexOf(ext) != -1) {
          type = 'video'
        }

        console.log('type123', type)
        return type
      },

      openUrl(type, item) {
        console.log('item123', item)
        if (type == 0) {
          this.mediaUrlList.splice(item, 1)
        } else if (type == 1) {
          this.suffix = item
          this.visible = true
        }
      },

      upload() {
        if (!this.fileLoading){
          this.$refs.file.click()
        }
      },

      onChange() {
        console.log('this.$refs.file', this.$refs.file.files)
        const file = this.$refs.file.files[0]
        let name = this.getUrLType(file.name)
        if (name === '') {
          this.$message.error('请上传正确的图片/视频格式')
          return
        }
        let formData = new FormData()
        formData.append('file', file)
        name = name === 'image' ? 1 : name === 'video' ? 2 : ''
        this.fileLoading = true
        ccrUploadFileApi(name, formData).then((res) => {
          console.log('获取上传后的文件地址', res)
          if (res.code === '200') {
            this.mediaUrlList.push({
              url: res.data.url,
              type: this.getUrLType(res.data.url)
            })
          } else {
            this.$message.error(res.message)
          }
        }).finally(()=>{
          this.fileLoading = false
        })
        this.$refs.file.value = null
      },

      close() {
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bigMead {
    .imgBoxs {
      width: 110px;
      height: 110px;
      border: 1px solid #EEEEEE;
      background: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
      vertical-align: top;

      .el-icon-plus {
        font-size: 24px;
      }

      .images, .video {
        width: 90px;
        height: 90px;
        position: relative;

        img {
          width: 100%;
          height: 100%;
        }

        .el-icon-video-play {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          color: #fff;
          font-size: 30px;
        }
      }

      .video {
        background: #ccc;
      }

      .hover-info {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;

        i {
          cursor: pointer;
          margin: 0 5px;
          position: relative;
        }

        .file {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
        }
      }
    }

    .imgBoxs:hover .hover-info {
      opacity: 1;
    }

  }
</style>
