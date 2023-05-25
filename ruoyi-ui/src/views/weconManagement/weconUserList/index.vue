<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="员工ID" prop="param.employeeNumber">
          <el-input
            v-model="queryParams.param.employeeNumber"
            placeholder="员工ID"
            clearable
          />
        </el-form-item>

        <el-form-item label="员工姓名" prop="param.zhName">
          <el-input
            v-model="queryParams.param.zhName"
            placeholder="员工姓名"
            clearable
          />
        </el-form-item>

        <el-form-item label="员工入职日期" prop="joinDateQueryStarting">
          <el-date-picker
            v-model="dateRange"
            @change="dateRangeChange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" :loading="loading" @click="resetQuery">重置</el-button>
          <el-button type="primary" plain @click="openVisible = true">导入</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8 cssBuntton">

        <el-badge class="itemBadge">
          <el-button @click="handleCheckedCitiesChange('all')" :type="activeType=='all' ? 'primary' : 'info'">所有
          </el-button>
        </el-badge>

        <el-badge value="" class="itemBadge">
          <el-button @click="handleCheckedCitiesChange('ENTERPRISE')" :type="activeType=='ENTERPRISE' ? 'primary' : 'info'">
            已启用企业版 {{usedEnterpriseLicenseNum}} / {{enterpriseLicenseNum}}
          </el-button>
        </el-badge>

        <el-badge value="" class="itemBadge">
          <el-button @click="handleCheckedCitiesChange('OFFICE')" :type="activeType=='OFFICE' ? 'primary' : 'info'">
            已启用办公版 {{usedOfficeLicenseNum}} / {{officeLicenseNum}}
          </el-button>
        </el-badge>

        <el-badge class="itemBadge">
          <el-button @click="handleCheckedCitiesChange('DISABLE')" :type="activeType=='DISABLE' ? 'primary' : 'info'">
            无企微访问权限 {{wecomDisableNum}}
          </el-button>
        </el-badge>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column label="员工ID" align="center" prop="employeeNumber" min-width="120"/>
          <el-table-column label="员工姓名" align="center" prop="zhName" min-width="120"/>
          <el-table-column label="员工入职日期" align="center" prop="utcJoinDate" min-width="220"/>
          <el-table-column label="成本中心" align="center" prop="jobId4" min-width="120"/>
          <el-table-column label="部门" align="center" prop="bu" min-width="120"/>
          <el-table-column label="操作" align="center" width="280" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.licenseType">
                <span v-if="scope.row.licenseType == 'ENTERPRISE'"
                      @click="handleInfo(scope.row.employeeId, scope.row.licenseType)">转为办公版</span>
                <span v-if="scope.row.licenseType == 'OFFICE'"
                      @click="handleInfo(scope.row.employeeId, scope.row.licenseType)">转为企业版</span>
              </el-button>
              <el-button type="text" v-if="!scope.row.licenseType"
                         @click="handleInfo(scope.row.employeeId, 'ENTERPRISE')">启用办公版
              </el-button>
              <el-button type="text" v-if="!scope.row.licenseType" @click="handleInfo(scope.row.employeeId, 'OFFICE')">
                启用企业版
              </el-button>
              <!--     无企微访问权限         -->
              <el-button v-if="!!scope.row.licenseType" type="text" @click="forbiddenWeCode(scope.row.employeeId)">
                <span>禁用企微</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <import-upload :fileType="['.xls', '.xlsx', '.csv']" @openInt="openInt" :openVisible="openVisible" :apiUrl="importUploadUrl" />

  </div>
</template>

<script>
  import ImportUpload from '@/components/ImportUpload'
  import {
    employeeapiServe,
    employeelicense,
    wecomstatusdisable,
    employeecountstats
  } from '@/api/hvacEventManagementApi'

  export default {
    name: 'hvacServiceSenter',
    components: {ImportUpload},
    data() {
      return {
        importUploadUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_WECOM_PATH + 'employee/data/file',
        openVisible: false,
        showPreview: false,
        previewImages: [],
        // 显示搜索条件
        showSearch: true,
        // 日期范围
        dateRange: '',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          param: {
            employeeNumber: '',
            zhName: '',
            licenseType: null,      // 应用版本： OFFICE-启用办公版；ENTERPRISE-启用企业版
            wecomStatus: null,     // 企微访问权限：DISABLE-无权限；ENABLE-有权限
            joinDateQueryStarting: '', //  入职时间查询终点
            joinDateQueryEnding: ''  //  入职时间查询起点
          }
        },
        activeType: 'all',
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        usedEnterpriseLicenseNum: null,
        usedOfficeLicenseNum: null,
        enterpriseLicenseNum: null,
        officeLicenseNum: null,
        wecomDisableNum: null,
      }
    },
    created() {
      this.getList(('rest'))
    },
    mounted() {
    },
    methods: {
      // 下载文件
      setExport() {
        window.open('https://qiwei-havc.oss-cn-shanghai.aliyuncs.com/carrier/employee/EmployeeTemplate.csv')
      },

      openInt(type) {
        this.openVisible = false
        if (type === 'getList') {
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success'
          })
          this.getList()
        }
      },
      handleCheckedCitiesChange(value) {
        console.log('value123', value)
        if (this.activeType === value) return
        this.activeType = value

        if (value == 'all') {
          this.queryParams.param.licenseType = null
          this.queryParams.param.wecomStatus = null
        }
        if (value == 'OFFICE') {
          this.queryParams.param.licenseType = 'OFFICE'
          this.queryParams.param.wecomStatus = null
        }
        if (value == 'ENTERPRISE') {
          this.queryParams.param.licenseType = 'ENTERPRISE'
          this.queryParams.param.wecomStatus = null
        }
        if (value == 'DISABLE') {
          this.queryParams.param.licenseType = null
          this.queryParams.param.wecomStatus = 'DISABLE'
        }

        this.getList()
      },
      // handleCheckedCitiesChange1(value) {
      //   console.log('value', value)
      //   this.queryParams.param.licenseStatus = value ? 1 : null
      // },
      // handleCheckedCitiesChange0(value) {
      //   console.log('value', value)
      //   this.queryParams.param.wecomStatus = value ? 0 : 1
      // },
      dateRangeChange(row) {
        if (row) {
          this.queryParams.param.joinDateQueryStarting = row[0]
          this.queryParams.param.joinDateQueryEnding = row[1]
        } else {
          this.queryParams.param.joinDateQueryStarting = ''
          this.queryParams.param.joinDateQueryEnding = ''
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.handleCheckedCitiesChange('all')
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },

      /** 查询 */
      getList(type) {
        if (type === 'rest') {
          this.queryParams.pageNum = 1
          this.queryParams.pageSize = 10
        }
        this.loading = true
        employeeapiServe(this.queryParams).then(res => {
          if (res.code == 200) {
            this.list = res.data.data
            this.total = res.data.total
            this.getemployeecountstats()
          }
        }).finally(() => {
          this.loading = false
        })
      },

      getemployeecountstats(){
        employeecountstats().then(res => {
          if (res.code == 200) {
            this.usedEnterpriseLicenseNum = res.data.usedEnterpriseLicenseNum
            this.usedOfficeLicenseNum = res.data.usedOfficeLicenseNum
            this.enterpriseLicenseNum = res.data.enterpriseLicenseNum
            this.officeLicenseNum = res.data.officeLicenseNum
            this.wecomDisableNum = res.data.wecomDisableNum
          }
        })
      },

      /** 操作按钮集合 */
      handleInfo(employeeId, licenseType) {
        console.log('typescope', employeeId, licenseType)
        this.loading = true
        licenseType = licenseType == 'OFFICE' ? 'ENTERPRISE' : 'OFFICE'
        employeelicense({
          employeeId,
          licenseType: licenseType
        }).then(res => {
          if (res.code == 200) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
          }
        }).finally(() => {
          this.loading = false
        })
      },

      // 禁用企微
      forbiddenWeCode(employeeId) {
        this.loading = true
        wecomstatusdisable({
          employeeId
        }).then(res => {
          if (res.code == 200) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
          }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
