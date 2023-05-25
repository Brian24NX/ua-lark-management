<template>
  <el-dialog class="serviceList-dialog" :title="title" :visible.sync="visible" width="720px"
             :close-on-press-escape="false"
             :close-on-click-modal="false" :showClose="false">
    <el-button class="closeBtn" type="text" icon="el-icon-close" @click="close('rest')"></el-button>

    <el-form v-loading="loading" label-position="top" :model="form" :rules="rules" ref="form" label-width="120px"
             class="demo-form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="网点名称" prop="centerName">
            <el-input v-model.trim="form.centerName" maxlength="20" show-word-limit/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item style="margin-bottom: 0;" prop="provId">
            <span slot='label'>活动地点  <span class="tips-addRess"><i class="el-icon-warning"></i> 具体地址仅会通知报名审核通过的客户，不会展示给其他客户</span></span>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item prop="provId" class="box-address">
            <el-select clearable v-model="form.provId" @change="getCityList" placeholder="请选择省">
              <el-option v-for="(item,index) of provinceList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5" :offset="1">
          <el-form-item clearable prop="cityId" class="box-address">
            <el-select clearable v-model="form.cityId" placeholder="请选择市">
              <el-option v-for="(item,index) of cityList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" :offset="1">
          <el-form-item prop="centerAddress" class="box-address">
            <el-input clearable v-model.trim="form.centerAddress" maxlength="60" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="网点位置图片" prop="addressPicPath">
            <ImageUpload class="notification-add" :limit="1" :isShowTip="false" :fileSize="20"
                         v-model="form.addressPicPath" apiUrl="service-center/address/img"/>
            <div style="color: #f27d00;">仅支持上传jpg、jpeg、png格式图片,图片小于20M</div>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loadingSave" type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    add,
    getServiceDetail,
    edit
  } from '@/api/hvacServiceSenter'

  import {
    getProvinceListServe
  } from '@/api/hvacEventManagementApi'

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
        loadingPublish: false,
        visible: false,
        previewVal: '',
        provinceList: [],
        cityList: [],
        form: {
          centerId: '',
          centerName: '',
          provId: '',
          provName: '',
          cityId: '',
          cityName: '',
          centerAddress: '',
          addressPicPath: ''
        },
        rules: {
          centerName: [
            { required: true, message: '请输入网点名称', trigger: 'blur' }
          ],
          provId: [
            { required: true, message: '请选择省', trigger: ['blur', 'change'] }
          ],
          cityId: [
            { required: true, message: '请选择市', trigger: ['blur', 'change'] }
          ],
          centerAddress: [
            { required: true, message: '请输入详细地址', trigger: ['blur', 'change'] }
          ],
          addressPicPath: [
            { required: true, message: '请上传网点位置图片', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.getProvinceList(0)
      console.log('detailData123', this.detailData.centerId)
      if (this.pageType === 'edit') {
        this.getDetail()
      }
    },
    mounted() {
    },
    methods: {
      getProvinceList(level) {
        getProvinceListServe(level).then(res => {
          if (res.code == 200) {
            res.data.forEach(item => {
              this.provinceList.push({
                value: item.areaId,
                label: item.areaName
              })
            })
          }
        })
      },
      getCityList(id) {
        this.form.cityId = ''
        if (id) {
          this.cityList = []
          getProvinceListServe(id).then(res => {
            if (res.code == 200) {
              res.data.forEach(item => {
                this.cityList.push({
                  value: item.areaId,
                  label: item.areaName
                })
              })
            }
          })
        }
      },

      getDetail() {
        this.loading = true
        getServiceDetail(this.detailData.centerId).then(res => {
          if (res.code == 200) {
            if (res.data.provId) {
              this.getCityList(res.data.provId)
            }
            this.form = res.data
          }
        }).finally(() => {
          this.loading = false
        })
      },

      getName(key, list) {
        let obj = []
        if (list.length > 0) {
          obj = list.filter((item) => item.value === key)
        }
        return obj.length && obj[0].label || ''
      },

      save() {
        console.log('form123', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {

            let params = JSON.parse(JSON.stringify(this.form))
            params.provName = this.getName(params.provId, this.provinceList)
            params.cityName = this.getName(params.cityId, this.cityList)

            this.loadingSave = true
            if (this.pageType === 'add') {
              add(params).then(res => {
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
              edit(params).then(res => {
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
        if (type === 'rest') {
          this.$confirm('是否直接关闭？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.closeFn()
          }).catch(() => {
          })
        } else {
          this.closeFn()
        }
      },

      closeFn() {
        this.visible = false
        this.$refs['form'].clearValidate()
        this.$refs['form'].resetFields()
        setTimeout(() => {
          this.$parent.visible = false
          this.$emit('emitInit')
        }, 200)
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
