<template>
  <div class="app-container">

    <div class="search backBg">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-row type="flex" justify="space-between" align="bottom">
          <el-col :xs="24" :span="20">
            <el-form-item label="Store" prop="name">
              <el-input v-model="queryParams.name" clearable/>
            </el-form-item>

            <el-form-item label="Phone Number" prop="mobile">
              <el-input v-model="queryParams.mobile" clearable/>
            </el-form-item>

            <el-form-item label="Status" prop="status">
              <el-select @change="getList('rest')" clearable v-model="queryParams.status">
                <el-option v-for="(dict, index) in storeSelect" :key="index" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item :xs="24" class="findBtn">
            <div slot="label" class="labelNull"></div>
            <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button :loading="loading" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="tableMain backBg">
      <el-row class="mb10" type="flex" justify="space-between">
        <div></div>
        <div>
          <el-button type="primary" icon="el-icon-upload2" @click="openVisible = true">{{$t('import')}}</el-button>
          <el-button type="primary" icon="el-icon-upload2" @click="download">{{$t('export')}}</el-button>
        </div>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column label="Store" align="center" prop="name" min-width="180"/>
          <el-table-column label="Store Code" align="center" prop="code" min-width="180"/>
          <el-table-column label="Address" align="center" prop="address" min-width="220"/>
          <el-table-column label="Tele. Number" align="center" prop="teleNumber" min-width="180"/>
          <el-table-column label="Phone Number" align="center" prop="mobile" min-width="180"/>
          <el-table-column label="Contact" align="center" prop="Contact" min-width="180"/>
          <el-table-column label="Status" align="center" prop="Status" min-width="220">
            <template slot-scope="scope">
              <span>{{scope.row.status == 0 ? 'Inactive' : 'active'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Create Time" align="center" prop="createTime" :formatter="formatTime"
                           min-width="220"/>
          <el-table-column label="Action" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleInfo('edit' ,scope.row)">Modify</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>
    </div>

    <el-dialog append-to-body :close-on-click-modal="false" :close-on-press-escape="false" width="668px"
               :title="(type=='add'?$t('add') : $t('edit'))" :visible.sync="visible" @close="cancel">

      <el-row>
        <el-col :offset="1" :span="22">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">

            <el-form-item label="Store Code" prop="code">
              <el-input type="text" v-model="form.code"></el-input>
            </el-form-item>

            <el-form-item label="Address" prop="address">
              <el-input type="text" v-model="form.address"></el-input>
            </el-form-item>

            <el-form-item label="Phone Number" prop="mobile">
              <el-input type="text" v-model="form.mobile"></el-input>
            </el-form-item>

            <el-form-item label="Tele. Number" prop="teleNumber">
              <el-input type="text" v-model="form.teleNumber"></el-input>
            </el-form-item>

            <el-form-item label="Contact" prop="contacts">
              <el-input type="text" v-model="form.contacts"></el-input>
            </el-form-item>

          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('cancels')}}</el-button>
        <el-button :loading="loadingSave" type="primary" @click="confirm">{{$t('confirm')}}</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import { page, save, downExport } from '@/api/store'

  export default {
    name: 'storeList',
    data() {
      return {
        openVisible: false,
        // 显示搜索条件
        showSearch: true,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: '',
          mobile: '',
          status: 0
        },
        storeSelect: [
          { label: 'Inactive ', value: 0 },
          { label: 'active ', value: 1 }
        ],
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],

        visible: false,
        loadingSave: false,
        type: '',
        form: {
          id: '',
          code: '',
          address: '',
          mobile: '',
          teleNumber: '',
          contacts: ''
        },
        rules: {
          code: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          address: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          phoneNumber: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          teleNumber: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
          contacts: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
        }
      }
    },
    created() {
      this.getList(('rest'))
    },
    mounted() {
    },
    methods: {
      formatTime(row, column, cellValue, index) {
        return formatDate(cellValue)
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },

      /** 查询 */
      getList(type) {
        if (type == 'rest') {
          this.queryParams.pageNum = 1
          this.queryParams.pageSize = 10
        }

        console.log(this.queryParams)
        this.loading = true
        page({
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          param: {
            name: this.queryParams.name,
            mobile: this.queryParams.mobile,
            status: this.queryParams.status
          }
        }).then(res => {
          if (res.code == 200) {
            this.list = res.data.data
            this.total = res.data.total
          }
        }).finally(() => {
          this.loading = false
        })
      },

      /** 操作按钮集合 */
      handleInfo(type, scope) {
        console.log('typescope', type, scope)
        this.type = type
        if (type == 'edit') {
          this.form = scope
        }
        this.visible = true
        this.loadingSave = false
      },

      cancel() {
        this.visible = false
        this.$refs['form'].resetFields()
      },

      confirm() {
        console.log('this.form', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loadingSave = true
            if (!!this.form.id) {
              save(this.form).then(res => {
                if (res.code == 200) {
                  this.cancel()
                  this.getList()
                }
              }).finally(() => {
                this.loadingSave = false
              })
            }
          }
        })
      },

      download() {
        downExport().then(result => {
          function change(t) {
            if (t < 10) {
              return '0' + t
            } else {
              return t
            }
          }

          let d = new Date()
          let year = d.getFullYear()
          let month = change(d.getMonth() + 1)
          let day = change(d.getDate())
          let filename = '导出店铺-' + year + month + day
          let blob = new Blob([result], { type: 'application/vnd.ms-excel' })
          let url = window.URL.createObjectURL(blob)
          if (window.navigator.msSaveBlob) {  //IE
            try {
              window.navigator.msSaveBlob(blob, filename)
            } catch (e) {
              console.log(e)
            }
          } else {  //非IE
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
          }
          URL.revokeObjectURL(url) // 释放内存
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
