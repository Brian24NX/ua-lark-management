<template>
  <el-dialog class="eventList-dialog" :title="title" :visible.sync="visible" width="1200px"
             :close-on-press-escape="false"
             :close-on-click-modal="false" :showClose="false">
    <el-button class="closeBtn" type="text" icon="el-icon-close" @click="close('rest')"></el-button>


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
    components: {
    },
    computed: {
    },
    data() {
      return {
        loading: false,
        loadingSave: false,
        loadingPublish: false,
        visible: false,
        previewData: {},
        form: {
          id: '',
          activityName: '',
          activityTime: null,
          registrationTime: null,
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          addr: '',
          pic: '',
          activityDetail: '',
          activityRedirectUrl: '',
          listAdminId: '',
          listAdminName: ''
        },
        rules: {
          activityName: [
            { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] }
          ],
          activityTime: [
            {
              required: true, validator: (rule, value, callback) => {
                if (!this.form.activityTime) {
                  callback(new Error('请选择活动时间'))
                } else {
                  callback()
                }
              }, trigger: ['blur', 'change']
            }
          ],
          registrationTime: [
            {
              required: true, validator: (rule, value, callback) => {
                if (!this.form.registrationTime) {
                  callback(new Error('请选择报名时间'))
                } else if (!this.form.activityTime) {
                  this.form.registrationTime = []
                  this.$refs.form.validateField('activityTime')
                  callback(new Error('请先选择活动时间'))
                } else if (!!this.form.activityTime && !!this.form.registrationTime) {
                  let startTime = this.form.activityTime[0]
                  let endTime = this.form.registrationTime[1]
                  if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
                    callback()
                  } else {
                    this.form.registrationTime = []
                    callback(new Error('报名的结束时间需在活动开始时间之前'))
                  }
                } else {
                  callback()
                }
              }, trigger: ['blur', 'change']
            }
          ],
          provinceId: [
            { required: true, message: '请选择省', trigger: ['blur', 'change'] }
          ],
          cityId: [
            { required: true, message: '请选择市', trigger: ['blur', 'change'] }
          ],
          addr: [
            { required: true, message: '请输入详细地址', trigger: ['blur', 'change'] }
          ],
          pic: [
            { required: true, message: '请上传活动海报', trigger: 'change' }
          ],
          listAdminId: [
            { required: true, message: '请先添加名单管理人', trigger: ['blur', 'change'] }
          ]
        },
        provinceList: [],
        cityList: [],
        listAdminList: [
          { label: '测试人1', value: '1' },
          { label: '测试人2', value: '2' },
          { label: '测试人3', value: '3' }
        ],
        editorLoading: true,
        // 开始时间限制
        pickerOptionsStart: {
          // disabledDate: time => {
          //   // return time.getTime() < Date.now() - 8.64e7;  //如果没有后面的-8.64e7就是不可以选择今天的
          // }
        },
        // 结束时间限制
        pickerOptionsEnd: {
          disabledDate: time => {
            // 获取开始时间
            let startTime = (this.form.activityTime && this.form.activityTime[0]) || ''
            // 如果有开始时间，结束时间必须在开始时间及以后
            if (startTime) {
              // 选择开始时间以前
              return ((time.getTime() >= new Date(startTime).getTime()))
            } else {
              return time.getTime() < Date.now() - 8.64e7  //如果没有后面的-8.64e7就是不可以选择今天的
            }
          }
        },
        restaurants: [],
        //
        deptVisible: false
      }
    },
    created() {
      this.getProvinceList(0)
      console.log('pageType', this.pageType)
      if (this.pageType !== 'add') {
        this.getDetail()
      }

    },
    mounted() {
      setTimeout(() => {
        this.editorLoading = false
      }, 200)
    },
    methods: {

      addUser() {
        this.deptVisible = true
        this.$nextTick(() => {
          this.$refs['deptList'].deptVisible = true
        })
      },
      deptInit(obj) {
        console.log('obj', obj)
        this.deptVisible = false
        if (!!obj.employeeNumber) {
          this.form.listAdminId = obj.employeeNumber
          this.form.listAdminName = obj.zhName || ''
        }
      },

      activityTimeChange(row) {
        console.log('row123', row)
        if (!row) {
          this.form.activityTime = null
          this.form.registrationTime = null
          this.form.activityStartTime = ''
          this.form.activityEndTime = ''
          this.form.registrationStartTime = ''
          this.form.registrationEndTime = ''
          console.log('this.form', this.form)
        }
      },
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
      handleAddressChange(e) {
        console.log('handleAddressChange', e)
      },

      getDetail() {
        this.loading = true
        detail(this.detailData.id).then(res => {
          if (res.code == 200) {
            if (res.data.provinceId) {
              this.getCityList(res.data.provinceId)
            }
            let form = res.data
            form.provinceName = this.getName(form.provinceId, this.provinceList)
            form.cityName = this.getName(form.cityId, this.cityList)

            form.activityTime = [res.data.activityStartTime, res.data.activityEndTime]
            form.registrationTime = [res.data.registrationStartTime, res.data.registrationEndTime]

            this.form = form

            console.log('this.form123', this.form)
            this.$nextTick(() => {
              //  this.$refs['form'].clearValidate()
              if (this.pageType == 'detail') {
                this.previewFn()
              }
            })
          }
        }).finally(() => {
          this.loading = false
        })
      },

      previewFn() {
        this.previewData = JSON.parse(JSON.stringify(this.form))
        this.previewData.provinceName = this.getName(this.previewData.provinceId, this.provinceList)
        this.previewData.cityName = this.getName(this.previewData.cityId, this.cityList)
      },

      getName(key, list) {
        let obj = []
        if (list.length > 0) {
          obj = list.filter((item) => item.value === key)
        }
        return obj.length && obj[0].label || ''
      },

      save(type) {
        console.log('form123', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.form))
            console.log('params', params)
            params.provinceName = this.getName(params.provinceId, this.provinceList)
            params.cityName = this.getName(params.cityId, this.cityList)
            // params.listAdminName = this.getName(params.listAdminId, this.listAdminList)
            params.published = type
            params.activityStartTime = params.activityTime[0]
            params.activityEndTime = params.activityTime[1]
            params.registrationStartTime = params.registrationTime[0]
            params.registrationEndTime = params.registrationTime[1]

            if (type == 0) {
              this.loadingSave = true
            }
            if (type == 1) {
              this.loadingPublish = true
            }

            let url = this.pageType == 'add' ? 'add' : this.pageType == 'edit' ? 'update' : ''
            addAndUpdate(url, params).then(res => {
              if (res.code == 200) {
                this.closeFn()
                this.$notify({
                  title: '成功',
                  message: type == 0 ? '保存成功' : '发布成功',
                  type: 'success'
                })
              }
            }).finally(() => {
              if (type == 0) {
                this.loadingSave = false
              }
              if (type == 1) {
                this.loadingPublish = false
              }
            })
          }
        })
      },

      close(type) {
        this.closeFn()
      },
      closeFn() {
        this.visible = false
        this.$refs['form'].clearValidate()
        this.$refs['form'].resetFields()
        this.$refs['editor'].setContent('')
        setTimeout(() => {
          this.$parent.visibleHandle = false
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
  .eventList-dialog {
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
      /*width: calc(100% - 220px);*/

      .el-form-item__label::before {
        content: none !important;
      }
    }

    .el-row {
      margin-bottom: 45px;
    }

    .nomb {
      margin-bottom: 0;
    }
  }

</style>
