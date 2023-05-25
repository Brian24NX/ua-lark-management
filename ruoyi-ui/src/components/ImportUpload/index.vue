<template>
  <!-- 用户导入对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body @closed="close"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :showClose="false">
    <el-upload
      ref="upload"
      :limit="1"
      :before-upload="beforeUpload"
      :accept="fileType.join(',')"
      :headers="headers"
      :data="params"
      :action="url"
      :disabled="isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
    </el-upload>
    <div class="text-center mt20">只能上传 <span>{{fileType.join('、')}}</span>格式文件，
      <span><el-button type="text" @click="download">下载模版</el-button></span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="isUploading" type="primary" @click="submitFileForm">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { getToken, userCode } from '@/utils/auth'

  export default {
    props: {
      openVisible: {
        type: Boolean,
        default: true
      },
      apiUrl: {
        type: String,
        default: ''
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => ['.xls', '.xlsx']
      },
      params: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        loading:false,
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '批量导入',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {
          Authorization: 'Bearer ' + getToken(),
          userCode: userCode()
        },
        // 上传的地址
        url: this.apiUrl,
        data: this.params
      }
    },
    watch: {
      openVisible() {
        this.open = this.openVisible
        setTimeout(() => {
          this.$refs.upload.clearFiles()
        }, 500)
      }
    },
    created() {
      this.open = this.openVisible
    },
    mounted() {
    },
    methods: {
      beforeUpload(file) {
        console.log(file)
        var testmsg=file.name.substring(file.name.lastIndexOf('.'))
        const extension = this.fileType.join('').indexOf(testmsg) !== -1

        if(!extension) {
          this.$message({
            message: '上传文件只能是 '+ this.fileType.join('、') +'格式!',
            type: 'warning'
          });
        }
        return extension
      },
      // beforeUpload(file, fileList) {
      //   console.log(file);
      //   let name = file.name;
      //   if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
      //     this.$notify.error({
      //       title: "错误",
      //       message: "上传文件只能为excel文件，且为xlsx,xls格式",
      //     });
      //     return false;
      //   }
      // },
      close() {
        this.isUploading = false
        this.$emit('openInt')
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.isUploading = true
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        console.log('response', response)
        this.isUploading = false
        this.$refs.upload.clearFiles()
        if (response.code != 200) {
          this.$emit('openInt')
          this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + (response.msg || response.message) + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
        } else {
          this.$emit('openInt', 'getList', response)
        }
      },
      /** 下载模板操作 */
      download() {
        this.$parent.setExport()
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit()
      }
    }
  }
</script>
<style>

</style>
