<template>
  <el-dialog title="名单管理人" width="980px" :visible.sync="deptVisible" append-to-body :close-on-click-modal="false"   :close-on-press-escape="false" :showClose="false">
    <el-button class="closeBtn" type="text" icon="el-icon-close" @click="close('rest')"></el-button>
    <el-form :model="form" ref="form" size="small" :inline="true">
      <el-form-item label="员工编号" prop="employeeNumber">
        <el-input v-model="form.employeeNumber" style="width: 100%" placeholder="" clearable @clear="getList"/>
      </el-form-item>

      <el-form-item label="员工中文名称" prop="zhName">
        <el-input v-model="form.zhName" style="width: 100%" placeholder="" clearable @clear="getList"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" :loading="loading" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table class="selectTable" :data="deptList" v-loading="loading"  @row-click="singleElection">
      <el-table-column label="" width="70">
        <template slot-scope="scope">
          <el-radio class="radio" v-model="templateSelection" :label="scope.$index"></el-radio>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" prop="employeeId" label="员工ID" width="80"></el-table-column>-->
      <el-table-column align="center" prop="employeeNumber" label="员工编号"></el-table-column>
      <el-table-column align="center" prop="zhName" label="员工中文名称"></el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList"/>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary"  :disabled="selectDisabled" @click="close(templateRadio)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    wecommemberapiServe
  } from '@/api/hvacEventManagementApi'

  export default {
    props: {},
    components: {},
    data() {
      return {
        deptVisible: false,
        loading: false,
        deptList: [],
        form: {
          pageNum: 1,
          pageSize: 10,
          zhName: '',
          employeeNumber: '',
        },
        total: 0,
        selectDisabled: true,
        templateSelection: '',
        templateRadio: {},
      }
    },
    created() {
      this.getList(('rest'))
    },
    mounted() {
    },
    methods: {
      singleElection(row) {
        this.templateSelection = this.deptList.indexOf(row)
        console.log('templateSelection123', row, this.templateSelection)
        this.templateRadio = row
        this.selectDisabled = false
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('form')
        this.handleQuery()
      },
      /** 查询 */
      getList(type) {
        if (type === 'rest') {
          this.form.pageNum = 1
          this.form.pageSize = 10
        }
        this.loading = true
        wecommemberapiServe({
          pageNum: this.form.pageNum,
          pageSize: this.form.pageSize,
          param: {
            zhName: this.form.zhName,
            employeeNumber: this.form.employeeNumber,
          }
        }).then(res => {
          if (res.code == 200) {
            this.deptList = res.data.data
            this.total = res.data.total
            this.templateSelection = ''
            this.selectDisabled = true
          }
        }).finally(() => {
          this.loading = false
        })
      },

      close(obj) {
        this.deptVisible = false
        this.templateSelection = ''
        this.selectDisabled = true
        this.resetForm('form')
        this.$emit('deptInit', obj)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
  .selectTable .el-radio__label {
    opacity: 0;
  }
</style>
