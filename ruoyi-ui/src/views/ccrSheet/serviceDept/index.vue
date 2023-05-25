<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="CCR编号" prop="ccrId">
          <el-input v-model="queryParams.ccrId" style="width: 100%" placeholder="反馈编号" clearable @clear="getList"
                    @keyup.enter.native="getList"/>
        </el-form-item>

        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="queryParams.customerName" style="width: 100%" placeholder="客户姓名" clearable @clear="getList"
                    @keyup.enter.native="getList"/>
        </el-form-item>

        <el-form-item>
          <el-form-item label="问题类别" prop="problemCategory">
            <el-select clearable v-model="queryParams.problemCategory" @change="problemCategoryChange" placeholder="">
              <el-option v-for="(item,index) of problemCategoryList" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>

          <el-form-item clearable prop="problemCode">
            <el-select clearable v-model="queryParams.problemCode" @change="getList" placeholder="">
              <el-option v-for="(item,index) of problemDescriptionList" :key="index" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form-item>


        <el-form-item label="产品类型" prop="productType">
          <el-select v-model="queryParams.productType" size="small" placeholder="产品类型" clearable filterable
                     style="width: 100%" @change="getList">
            <el-option v-for="(item, index) in productTypeList" :key="item.index" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="反馈时间">
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
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" :loading="loading" @click="resetQuery">重置</el-button>
          <el-button icon="el-icon-download" :loading="loading" @click="exports">导出</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8 cssBuntton">
        <!--        1:All 2:未处理 3:运营质量已完成 4:提报人未评价    -->
        <el-badge class="itemBadge" v-for="(item,index) of statusSearchList" :key="index">
          <el-button @click="handleCheckedChange(item.value)" :type="queryParams.queryType== item.value ? 'primary' : 'info'">
            {{item.label}} <span v-if="item.value == 2">{{noTreatedTotal}}</span>
          </el-button>
        </el-badge>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column align="center" label="CCR#" prop="ccrId" min-width="120px"/>
          <el-table-column align="center" label="反馈时间" prop="customerSubmitTime" min-width="160px"/>
          <el-table-column align="center" label="提报人" prop="customerName" min-width="160px"/>
          <el-table-column align="center" label="产品类型" prop="productType" min-width="160px"/>
          <el-table-column align="center" label="产品型号" prop="productCode" min-width="160px"/>
          <el-table-column align="center" label="状态" prop="serviceDeptStatus" min-width="160px" :formatter="formatStatus"/>

          <el-table-column align="center" label="问题分类" prop="problemCategory" min-width="160px"/>
          <el-table-column align="center" label="缺陷分类" prop="defectClassification" min-width="160px"/>
          <el-table-column align="center" label="推送时间" prop="checkQualityTime" min-width="160px"/>
          <el-table-column align="center" label="责任部门" prop="responsibleDepartment" min-width="160px"/>
          <el-table-column align="center" label="措施提交" prop="measuresStatus" min-width="160px"/>
          <el-table-column align="center" label="措施有效性" prop="measuresEffective" min-width="160px"/>
          <el-table-column align="center" label="确认时间" prop="finialCheckTime" min-width="160px"/>
          <el-table-column label="操作" align="center" fixed="right" width="120px">
            <template scope="scope">
              <el-button type="text" class="danger" @click="detail(scope.row.ccrId)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <add v-if="visible" ref="detail" :ccrId="ccrId" title="工单详情" submitUrl="serviceDeptSubmit" :pagetype="3" @emitInit="getList"/>
  </div>
</template>

<script>
  import add from '../components/add'
  import {
    ccrproblemCategoryListApi,
    ccrproblemDescriptionListApi,
    ccrdownloadFeedbackListApi,
    ccrproductTypeListApi,
    ccrserviceFeedbackListApi,
    ccrgetFeedBackCountApi
  } from '@/api/ccrSheet'

  export default {
    name: 'hvacServiceSenter',
    components: {
      add
    },
    data() {
      return {
        openVisible: false,
        // 显示搜索条件
        showSearch: true,
        // 日期范围
        dateRange: '',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          ccrId: '',
          customerName: '',
          problemCategory: '', // 一级
          problemCode: '',   // 一级
          productType: '',
          submitTimeStartDate: '',
          submitTimeEndDate: '',
          queryType: 1  // 1:All 2:未处理 3:运营质量已完成 4:提报人未评价
        },
        activeList: [
          { label: '未激活', value: 0 },
          { label: '已激活', value: 1 },
          { label: '待审核', value: 2 },
          { label: '已驳回', value: 3 }
        ],
        // 遮罩层
        loading: false,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        visible: false,
        detailData: {},
        status: '',
        problemCategoryList: [],
        problemDescriptionList: [],
        productTypeList: [],

        // 查询类型（1:All 2:未处理 ）
        statusSearchList: [
          { label: 'All', value: 1 },
          { label: '未处理', value: 2 },
        ],
        noTreatedTotal: '',
        statusList: [
          { label: '', value: 1 },
          { label: '', value: 2 },
          { label: '', value: 3 },
          { label: '', value: 4 },
          { label: '未处理', value: 5 },
          { label: '未处理', value: 6 },
          { label: '已完成', value: 7 },
          { label: '已完成', value: 8 },
          { label: '已完成', value: 9 },
          { label: '已完成', value: 10 },
          { label: '已完成', value: 11 },
          { label: '已完成', value: 12 },
          { label: '已完成', value: 13 },
          { label: '已完成', value: 14 },
          { label: '已完成', value: 15 },
          { label: '已完成', value: 16 },
        ],
        ccrId:'',
      }
    },
    created() {
      this.ccrproductTypeListFun()
      this.ccrproblemCategoryListFun()
      this.getList(('rest'))
    },
    mounted() {
    },
    methods: {
      formatStatus(row, column, cellValue, index) {
        return row.serviceDeptStatus == 2 ? '未处理' : '已完成'
      },

      ccrproductTypeListFun() {
        ccrproductTypeListApi().then(res => {
          if (res.code == 200) {
            let data = []
            for (let key in res.data) {
              data.push({
                label: res.data[key],
                value: key
              })
            }
            console.log('datae', data)
            this.productTypeList = data
          }
        })
      },

      ccrproblemCategoryListFun() {
        ccrproblemCategoryListApi().then(res => {
          if (res.code == 200) {
            this.problemCategoryList = res.data
          }
        })
      },

      problemCategoryChange(e) {
        console.log('e', e)
        this.queryParams.problemCode = ''
        ccrproblemDescriptionListApi({
          problemCategory: e
        }).then(res => {
          if (res.code == 200) {
            let data = []
            for (let key in res.data) {
              data.push({
                label: res.data[key],
                value: key
              })
            }
            console.log('datae', data)
            this.problemDescriptionList = data
          }
        })
      },

      handleCheckedChange(value) {
        console.log('value12',this.queryParams.queryType, value)
        if (this.queryParams.queryType != value){
          this.queryParams.pageNum = 1
          this.queryParams.queryType = value
          this.handleQuery()
        }
      },
      dateRangeChange(row) {
        if (row) {
          this.queryParams.submitTimeStartDate = row[0]
          this.queryParams.submitTimeEndDate = row[1]
        } else {
          this.queryParams.submitTimeStartDate = ''
          this.queryParams.submitTimeEndDate = ''
        }
      },

      openInt(type) {
        this.openVisible = false
        if (type === 'getList') {
          this.getList()
        }
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },

      exports() {
        ccrdownloadFeedbackListApi().then(result => {
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
          let filename = 'CCR反馈工单列表' + year + month + day
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
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = []
        this.queryParams.submitTimeStartDate = ''
        this.queryParams.submitTimeEndDate = ''
        this.resetForm('queryForm')
        this.queryParams.queryType = 1
        this.handleQuery()
      },

      /** 查询 */
      getList(type) {
        if (type === 'rest') {
          this.queryParams.pageNum = 1
          this.queryParams.pageSize = 10
        }
        this.loading = true
        ccrserviceFeedbackListApi({ ...this.queryParams }).then(res => {
          if (res.code == 200) {
            this.list = res.data.list
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
        this.noGetList()
      },

      noGetList() {
        ccrgetFeedBackCountApi({
          deptType: 3,
        }).then(res => {
          if (res.code == 200) {
            this.noTreatedTotal = res.data.noTreatedTotal
          }
        })
      },

      detail(id) {
        console.log('id', id)
        this.visible = true
        this.ccrId = id
        this.$nextTick(() => {
          this.$refs['detail'].visible = true
        })
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
