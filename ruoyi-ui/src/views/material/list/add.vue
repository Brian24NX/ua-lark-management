<template>
  <el-dialog class="eventList-dialog" :title="(pageType =='add' ? $t('add') : $t('edit')) + '物料'" :visible.sync="visible" width="800px"
             :close-on-press-escape="false"
             :close-on-click-modal="false" :showClose="false">
    <el-button class="closeBtn" type="text" icon="el-icon-close" @click="cancel('form')"></el-button>

    <el-form ref="form" :model="form" :rules="rules" label-width="150px">

      <el-form-item label="Full Name"  prop="fullName">
        <el-input v-model="form.fullName"></el-input>
      </el-form-item>

      <el-form-item label="Short Name"  prop="shortName">
        <el-input v-model="form.shortName"></el-input>
      </el-form-item>

      <el-form-item label="Code"  prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>

      <el-form-item label="Category"  prop="category">
        <el-select clearable v-model="form.category1">
          <el-option v-for="(dict, index) in unitList" :key="index" :label="dict.label" :value="dict.value"/>
        </el-select>
        <el-select class="ml20" clearable v-model="form.category2">
          <el-option v-for="(dict, index) in unitList" :key="index" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Specifications"  prop="specifications">
        <el-input v-model="form.specifications"></el-input>
      </el-form-item>

      <el-form-item label="Unit"  prop="unit">
        <el-select clearable v-model="form.unit">
          <el-option v-for="(dict, index) in unitList" :key="index" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Retail Price"  prop="retailPrice">
        <el-input v-model="form.retailPrice"></el-input>
      </el-form-item>

      <el-form-item label="Cost Price"  prop="costPrice">
        <el-input v-model="form.costPrice"></el-input>
      </el-form-item>

      <el-form-item label="image" prop="image">
        <ImageUpload :limit="1" :isShowTip="false" v-model="form.image"></ImageUpload>
      </el-form-item>

      <el-form-item  label="Status" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="On sale"></el-radio>
          <el-radio label="Off sale"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">{{$t('cancels')}}</el-button>
      <el-button :loading="formLoading" type="primary" @click="save('form')">{{$t('confirm')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
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
    components: {},
    computed: {},
    data() {
      return {
        loading: false,
        formLoading: false,
        visible: false,
        form: {
          id: '',
          fullName: '',
          shortName: '',
          code: '',
          category: '',
          category1: '',
          category2: '',
          specifications: '',
          unit: '',
          retailPrice: '',
          costPrice: '',
          image: '',
          status: '',
        },
        rules: {
          fullName: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          // shortName: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          code: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          category: [
            {
              required: true, validator: (rule, value, callback) => {
                if (this.form.category1 && this.form.category2) {
                  callback()
                } else {
                  callback(new Error('请选择'))
                }
              }, trigger: ['blur', 'change']
            }
          ],
          unit: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
          retailPrice: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          costPrice: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          image: [{ required: true, message: '请上传', trigger: ['blur', 'change'] }],
        },
        unitList: [],
        provinceList: [],
        cityList: []
      }
    },
    created() {
      console.log('pageType', this.pageType)
      if (this.pageType !== 'add') {
        this.getDetail()
      }
    },
    mounted() {
    },
    methods: {
      getDetail() {
        // this.loading = true
        // detail(this.detailData.id).then(res => {
        //   if (res.code == 200) {
        //   }
        // }).finally(() => {
        //   this.loading = false
        // })
      },

      cancel(formName) {
        this.visible = false
        this.$refs[formName].resetFields();
        setTimeout(() => {
          this.$parent.visibleHandle = false
        }, 200)
      },

      save(type) {
        console.log('form123', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.form))
            console.log('params', params)
            return
            this.formLoading = true

            let url = this.pageType == 'add' ? 'add' : this.pageType == 'edit' ? 'update' : ''
            addAndUpdate(url, params).then(res => {
              if (res.code == 200) {
                this.cancel('form')
                this.$notify({
                  title: '成功',
                  message: type == 0 ? '保存成功' : '发布成功',
                  type: 'success'
                })
              }
            }).finally(() => {
              this.formLoading = false
            })
          }
        })
      },

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
