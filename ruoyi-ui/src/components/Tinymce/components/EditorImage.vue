<template>
  <div class="upload-container">
    <el-button icon="el-icon-upload" type="primary" @click=" dialogVisible=true">上传</el-button>
    <el-dialog title="上传" :append-to-body="true" :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        name="img"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :headers="headers"
        :action="uploadImgUrl"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken, userCode } from '@/utils/auth'

  export default {
    name: 'EditorSlideUpload',
    props: {
      color: {
        type: String,
        default: '#1890ff'
      }
    },
    data() {
      return {
        dialogVisible: false,
        listObj: {},
        fileList: [],
        headers: {
          Authorization: 'Bearer ' + getToken(),
          userCode: userCode()
        },
        uploadImgUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_HVAC_PATH + 'activity/upload-img' // 上传的图片服务器地址
      }
    },
    methods: {
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      },
      handleSubmit() {
        const arr = Object.keys(this.listObj).map(v => this.listObj[v])
        if (!this.checkAllSuccess()) {
          this.$message('请等待所有图像成功上载。如果存在网络问题，请刷新页面并再次上载!')
          return
        }
        this.$emit('successCBK', arr)
        this.listObj = {}
        this.fileList = []
        this.dialogVisible = false
      },
      handleSuccess(response, file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        console.log('objKeyArr', objKeyArr, response)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = response.data.url + '?id=' + response.data.id
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
      },
      handleRemove(file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            delete this.listObj[objKeyArr[i]]
            return
          }
        }
      },
      beforeUpload(file) {
        const _self = this
        const _URL = window.URL || window.webkitURL
        const fileName = file.uid
        this.listObj[fileName] = {}
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
          }
          resolve(true)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;

    ::v-deep .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
