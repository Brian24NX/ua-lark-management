<template>
  <div class="app-container">

    <div class="search backBg">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-position="top" v-show="showSearch">
        <el-row type="flex" justify="space-between" align="bottom">
          <el-col :xs="24" :span="20">
            <el-form-item label="Supplier">
              <el-select @change="getList('rest')" clearable v-model="queryParams.supplier">
                <el-option v-for="(dict, index) in supplierSelect" :key="index" :label="dict.label" :value="dict.value"/>
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
          <el-button type="primary" icon="el-icon-plus" @click="handleInfo('add')">Add Supplier</el-button>
        </div>
      </el-row>


      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column label="Supplier" align="center" prop="Supplier" min-width="120" />
          <el-table-column label="Email Address" align="center" prop="EmailAddress" min-width="120" />
          <el-table-column label="RelevantMaterial" align="center" prop="RelevantMaterial" min-width="220">
            <template slot-scope="scope">
              <el-button @click="toPath" type="text">81 Mateial</el-button>
            </template>
          </el-table-column>
          <el-table-column label="Create Time" align="center" prop="CreateTime" min-width="120" />

          <el-table-column label="Action" align="center" width="240" fixed="right">
            <template slot-scope="scope">
              <el-button  type="text" @click="handleInfo('edit' ,scope.row)">Modify</el-button>
              <el-button  type="text" @click="del(scope.row)"> Delete </el-button>
              <el-button  type="text" @click="restPassword(scope.row)">Reset Password</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>
    </div>

    <el-dialog append-to-body :close-on-click-modal="false" :close-on-press-escape="false" width="668px"
               :title="(type=='add'?$t('add') : $t('edit')) + 'Supplier'" :visible.sync="visible" @close="cancel">

      <el-row>
        <el-col :offset="1" :span="22">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">

            <el-form-item label="Supplier Name" prop="supplierName">
              <el-input type="text"  v-model="form.supplierName"></el-input>
            </el-form-item>

            <el-form-item
              v-for="(domain, index) in form.emails"
              :label="'Email Address' + (index + 1)"
              :key="index"
              :prop="'emails.' + index + '.value'"
              :rules="{
                  required: true, message: '邮箱不能为空', trigger: 'blur'
                }"
            >
              <el-row>
                <el-col :span="17">
                  <el-input v-model="domain.value"></el-input>
                </el-col>
                <el-button type="primary" class="ml10" @click.prevent="addEmail">新增</el-button>
                <el-button v-if="form.emails.length > 1" @click.prevent="removeEmail(domain)">删除</el-button>
              </el-row>
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
    name: 'supplierList',
    data() {
      return {
        openVisible: false,
        // 显示搜索条件
        showSearch: true,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          supplier: '',
        },
        supplierSelect: [],
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
          supplierName: '',
          emails:[
            {
              value: '',
              key: Date.now()
            }
          ]
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
