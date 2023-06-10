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
    :auto-upload="false"
    drag
  >
    <i class="el-icon-upload"></i>
    <slot name="tips"></slot>
    <div class="el-upload__text">{{$t('tips1')}}<em>{{$t('tips2')}}</em></div>
  </el-upload>
</template>
<script>
  import {getToken} from "@/utils/auth";

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
        headers: {Authorization: "Bearer " + getToken()},
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
        this.$emit('openInt', 'getList')
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`)
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
