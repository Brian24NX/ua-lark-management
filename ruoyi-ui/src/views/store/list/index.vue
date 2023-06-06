<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">

        <el-form-item label="Store">
          <el-select @change="getList('rest')" clearable v-model="queryParams.store">
            <el-option v-for="(dict, index) in storeSelect" :key="index" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button :loading="loading" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-row type="flex" class="row-bg" justify="space-between">
          <div></div>
          <el-button type="primary" icon="el-icon-upload2" @click="openVisible = true">{{$t('import')}}</el-button>
        </el-row>
      </el-row>
      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column label="Store" align="center" prop="Store" min-width="120" />
          <el-table-column label="Address" align="center" prop="Address" min-width="120" />
          <el-table-column label="Phone Number" align="center" prop="Phone Number" min-width="120" />
          <el-table-column label="Contact" align="center" prop="Contact" min-width="120" />
          <el-table-column label="Status" align="center" prop="Status" min-width="220">
            <template slot-scope="scope">
              <span>Active</span>
            </template>
          </el-table-column>
          <el-table-column label="Create Time" align="center" prop="CreateTime" min-width="120" />

          <el-table-column label="Action" align="center" width="240" fixed="right">
            <template slot-scope="scope">
              <el-button  type="text" @click="handleInfo('edit' ,scope.row)">Modify</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <el-dialog append-to-body :close-on-click-modal="false" :close-on-press-escape="false" width="668px"
               :title="(type=='add'?$t('add') : $t('edit'))" :visible.sync="visible" @close="cancel">

      <el-row>
        <el-col :offset="1" :span="22">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">

            <el-form-item label="Address" prop="address">
              <el-input type="text"  v-model="form.address"></el-input>
            </el-form-item>

            <el-form-item label="Contact" prop="contact">
              <el-input type="text"  v-model="form.contact"></el-input>
            </el-form-item>

            <el-form-item label="Phone Number" prop="phoneNumber">
              <el-input type="text"  v-model="form.phoneNumber"></el-input>
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

  import { page, del } from '@/api/hvacEventManagementApi'

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
          Store: '',
        },
        storeSelect: [],
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],

        visible: false,
        loadingSave: false,
        type:'',
        form:{
          id: '',
          address: '',
          contact: '',
          phoneNumber: '',
        },
        rules:{
          supplierName: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        }
      }
    },
    created() {
      this.getList(('rest'))
    },
    mounted() {
    },
    methods: {
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
        if (type === 'rest') {
          this.queryParams.pageNum = 1
          this.queryParams.pageSize = 10
        }

        console.log(this.queryParams)
        this.loading = false

        for (var i = 0; i < 12; i++){
          this.list.push({
            id: i,
            Code: i++
          })
        }
        this.total = this.list.length
        return
        page({
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          param: {
            activityName: this.queryParams.activityName
          }
        }).then(res => {
          if (res.code == 200) {
            this.list = res.data
            this.total = res.total
          }
        }).finally(() => {
          this.loading = false
        })
      },

      toPath(){
        this.$router.push({ path: '/material/list', query: { id: "" } })
      },

      /** 操作按钮集合 */
      handleInfo(type, scope) {
        console.log('typescope', type, scope)
        this.type = type
        // if (type == 'edit') {
        //  this.detailData = scope
        // }
        this.visible = true
        this.loadingSave = false
      },

      del(row){
        this.$confirm('请确认是否删除？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.loading = true
          del({
            id: row.id
          }).then(res => {
            if (res.code == 200) {
              this.getList()
            }
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
        })
      },
      restPassword(row){
        this.$confirm('请确认是否重置密码？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.loading = true
          del({
            id: row.id
          }).then(res => {
            if (res.code == 200) {
              this.getList()
            }
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
        })
      },

      cancel() {
        this.visible = false
        this.$refs['form'].resetFields();
      },

      confirm() {
        console.log('this.form', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.cancel()
            return
            this.loadingSave = true
            if (!!this.form.id){
              updateTemplateMessage(this.form).then(res => {
                if (res.code === 200) {
                  this.cancel()
                  this.getList()
                }
              }).finally(() => {
                this.loadingSave = false
              })
            } else {
              templateMessage(this.form).then(res => {
                if (res.code === 200) {
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

      removeEmail(item) {
        var index = this.form.emails.indexOf(item)
        if (index !== -1) {
          this.form.emails.splice(index, 1)
        }
      },
      addEmail() {
        this.form.emails.push({
          value: '',
          key: Date.now()
        });
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
