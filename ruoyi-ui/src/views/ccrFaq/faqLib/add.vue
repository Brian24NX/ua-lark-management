<template>
  <el-dialog class="serviceList-dialog" :title="title" :visible.sync="visible" width="1100px"
             :close-on-press-escape="false"
             :close-on-click-modal="false" :showClose="false">
    <el-button class="closeBtn" type="text" icon="el-icon-close" @click="close('rest')"></el-button>

    <el-form v-loading="loading" label-position="top" :model="form" :rules="rules" ref="form" label-width="120px"
             class="demo-form" :disabled="pageType === 'detail'">
      <el-row>
        <el-col :span="24">
          <el-form-item label="问题" prop="question">
            <el-input v-model.trim="form.question"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="答案" prop="answer">
            <div v-if="editorLoading" v-loading="editorLoading" style="height: 450px;"></div>
            <div v-else>
              <Tinymce  :readonly="pageType == 'detail'" ref="editor" v-model="form.answer" :height="450"/>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="关键词" prop="faqKeywords">
            <el-input v-model.trim="form.faqKeywords" autocomplete="off"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="状态" prop="active">

            <el-radio-group v-model="form.active">
              <el-radio v-for="(dict, index) in activeList" :label="dict.value">{{dict.label}}</el-radio>
            </el-radio-group>

          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button v-if="pageType !== 'detail'" :loading="loadingSave" type="primary" @click="save">保存</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import {faqList, faqAdd, faqDel, faqEdit, faqDetail, faqEditRelations, faqActive} from '@/api/faq'
  import qs from 'qs'

  export default {
    props: {
      pageType: {
        type: String,
        default: ''
      },
      detailData: {
        type: Object,
        default: null
      }
    },
    components: {Tinymce},
    computed: {
      title() {
        let title = ''
        switch (this.pageType) {
          case 'add':
            title = '新增'
            break
          case 'edit':
            title = '编辑'
            break
          case 'detail':
            title = '详情'
            break
        }
        return title
      }
    },
    data() {
      return {
        loading: false,
        loadingSave: false,
        editorLoading: true,
        visible: false,
        previewVal: '',
        provinceList: [],
        cityList: [],
        form: {
          id: '',
          question: '',
          answer: '',
          faqKeywords: '',
          active: 1 // 0: 禁用 1: 启用  2: 待审核
        },
        rules: {
          question: [
            {required: true, message: '请输入问题', trigger: 'blur'}
          ],
          answer: [
            {required: true, message: '请输入答案', trigger: ['blur', 'change']}
          ],
          faqKeywords: [
            {required: true, message: '请输入关键词', trigger: ['blur', 'change']}
          ],
          active: [
            {required: true, message: '请选择状态', trigger: ['change']}
          ],
        },
        activeList: [
          {label: '启用', value: 1},
          {label: '禁用', value: 0}
        ]
      }
    },
    created() {
      console.log('detailData123', this.detailData)
      if (this.pageType === 'edit' || this.pageType === 'detail') {
        this.getDetail()
      }
    },
    mounted() {
      setTimeout(() => {
        this.editorLoading = false
        //this.form = this.detailData
      }, 200)
    },
    methods: {
      getDetail() {
        this.loading = true
        faqDetail(this.detailData.id).then(res => {
          if (res.code == 200) {
            this.form = res.data
          }
        }).finally(() => {
          this.loading = false
        })
      },

      save() {
        console.log('form123', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {

            let params = JSON.parse(JSON.stringify(this.form))

            this.loadingSave = true
            if (this.pageType === 'add') {
              faqAdd(params).then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success'
                  })
                  this.closeFn()
                } else {
                  this.$message.error(res.message)
                }
              }).finally(() => {
                this.loadingSave = false
              })
            }

            if (this.pageType === 'edit') {
              faqEdit(params).then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '编辑成功',
                    type: 'success'
                  })
                  this.closeFn()
                } else {
                  this.$message.error(res.message)
                }
              }).finally(() => {
                this.loadingSave = false
              })
            }

          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      close(type) {
        if (this.pageType === 'detail'){
          this.closeFn()
          return
        }
        if (type === 'rest') {
          this.$confirm('是否直接关闭？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.closeFn()
          }).catch(() => {
            this.closeFn()
          })
        } else {
          this.closeFn()
        }
      },

      closeFn() {
        this.visible = false
        this.$refs['form'].clearValidate()
        this.$refs['form'].resetFields()
        this.resetForm('form')
        setTimeout(() => {
          this.$parent.visible = false
          this.$emit('emitInit')
        }, 50)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tips-addRess {
    color: #999;
    font-size: 12px;
    font-weight: normal;
    margin-left: 10px;
  }
</style>
<style lang="scss">


  .serviceList-dialog {
    .notification-add {
      width: 312px;
      height: 221px;
      overflow: hidden;
    }

    .notification-add .el-upload--picture-card,
    .notification-add .el-upload-list--picture-card .el-upload-list__item {
      width: 312px;
      height: 221px;
      line-height: 221px;
    }

    .box-address {


      .el-form-item__label::before {
        content: none !important;
      }
    }
  }

</style>
