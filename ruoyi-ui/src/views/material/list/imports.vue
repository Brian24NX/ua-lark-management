<template>
  <el-upload
    ref="upload"
    :limit="1"
    :accept="accept"
    :headers="headers"
    :action="url"
    :disabled="isUploading"
    :on-progress="handleFileUploadProgress"
    :on-success="handleFileSuccess"
    drag
  >
    <i class="el-icon-upload"></i>
    <slot name="tips"></slot>
  </el-upload>
</template>
<script>
  import { getToken } from "@/utils/auth";
  import SHA256 from '@/utils/sha265'

  let timeStamp = new Date().getTime() + Math.floor(Math.random() * 100000)
  let appId = process.env.VUE_APP_BASE_APPID
  let secretKey = process.env.VUE_APP_BASE_SECRET

  export default {
    props: {
      accept: {
        type: String,
        default: '.xlsx, .xls'
      },
      openVisible: {
        type: Boolean,
        default: true
      },
      apiUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {
          Authorization: "Bearer " + getToken(),
          timestamp: timeStamp,
          appId: appId,
          sign: SHA256(`${timeStamp}${secretKey}${appId}`),
        },
        // 上传的地址
        url: 'https://uat.education365.net/edu-admin/file/upload'
      }
    },
    watch: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      close() {
        this.$emit('openInt')
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        console.log('response', response)
        this.isUploading = false;
        this.$refs.upload.clearFiles();
        if (response.code != 200){
          this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", this.$t('importResults'), {dangerouslyUseHTMLString: true});
        }
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      }
    },
  }
</script>
<style>

</style>
