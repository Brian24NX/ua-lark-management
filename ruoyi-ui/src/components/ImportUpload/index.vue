<template>
  <!-- 用户导入对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body @closed="close">
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="headers"
      :action="url"
      :disabled="isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">{{$t('tips1')}}<em>{{$t('tips2')}}</em></div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">{{$t('confirm')}}</el-button>
      <el-button @click="close">{{$t('cancels')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {getToken} from "@/utils/auth";

  export default {
    props: {
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
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: this.$t('userImport'),
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + this.apiUrl
      }
    },
    watch: {
      openVisible() {
        this.open = this.openVisible
      }
    },
    created() {
      this.open = this.openVisible
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
