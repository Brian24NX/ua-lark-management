<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input
            v-model="queryParams.customerName"
            placeholder="请输入活动名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNum">
          <el-input
            v-model="queryParams.phoneNum"
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-select clearable v-model="queryParams.status" placeholder="请选择审核状态">
            <el-option v-for="(item,index) of statusList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain @click="setExport(1)">导出</el-button>
          <el-button type="primary" plain @click="activityUpdate(1, ids)">批量通过</el-button>
          <el-button type="primary" plain @click="activityUpdate(2, ids)">批量驳回</el-button>
          <el-button type="primary" plain @click="openVisible = true">导入</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="客户姓名" align="center" prop="customerName"/>
          <el-table-column label="手机号码" align="center" prop="phoneNum" min-width="120"/>
          <el-table-column label="邮箱地址" align="center" prop="email" min-width="120"/>
          <el-table-column label="公司名称" align="center" prop="companyName" min-width="120"/>
          <!--       `status` int(4) NOT NULL DEFAULT '0' COMMENT '审核状态：0：待审核1：审核通过2：审核未通过',     -->
          <el-table-column label="审核状态" align="center" prop="status" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0" class="status-color status-color-wait">待审核</span>
              <span v-if="scope.row.status==1" class="status-color status-color-pass">审核通过</span>
              <span v-if="scope.row.status==2" class="status-color status-color-Failed">审核未通过</span>
            </template>
          </el-table-column>

          <el-table-column label="审核通过时间" align="center" prop="approvalTime" :formatter="formatDate" min-width="160"/>
          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
              <!--   状态为【待审核】时，展示【审核通过】、【审核未通过】按钮
                            态为【审核通过】、【审核未通过】时，不展示按钮   -->
              <el-button v-if="scope.row.status==0" type="text" @click="activityUpdate(1 , [scope.row.customerActId])">
                审核通过
              </el-button>
              <el-button v-if="scope.row.status==0" type="text" @click="activityUpdate(2 , [scope.row.customerActId])">
                审核未通过
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <import-upload @openInt="openInt" :openVisible="openVisible" :apiUrl="importUploadUrl" :params="{activityId: id}"></import-upload>

  </div>
</template>

<script>
  import qs from 'qs'
  import {
    customerPage,
    activityUpdateServe,
    downApplicationList
  } from '@/api/hvacEventManagementApi'
  import ImportUpload from '@/components/ImportUpload'
  import { formatDate } from '@/utils/index'

  export default {
    name: 'hvacServiceSenterServiceList',
    components: { ImportUpload },
    data() {
      return {
        openVisible: false,

        // 显示搜索条件
        showSearch: true,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          customerName: '',
          phoneNum: '',
          status: '',
          activityId: this.id
        },
        // 遮罩层
        loading: true,
        // 总条数
        total: 2,
        // 表格数据
        list: [],

        pageType: '',
        visible: false,
        ids: [],
        statusList: [
          { label: '待审核', value: 0 },
          { label: '审核通过', value: 1 },
          { label: '审核未通过', value: 2 }
        ],
        id: Number(this.$route.query.id),
        importUploadUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_HVAC_PATH + 'customer-activity/out-info/import',
      }
    },
    created() {
      this.getList(('rest'))
    },
    mounted() {
    },
    methods: {
      openInt(type, response) {
        this.openVisible = false
        if (type === 'getList') {
          this.$confirm('您已选择<span style=color: #334fa2;padding: 0 2px;>' + response.data + '</span>位待审核的客户，是否确认? 确认后将会直接审批以上客户，并通过微信自动推送活动信息，请谨慎处理', '确认', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.getList()
          }).catch(() => {
          })
        }
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.customerActId)
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

      formatDate(row, column, cellValue, index) {
        return formatDate(cellValue)
      },

      /** 查询 */
      getList(type) {
        if (type === 'rest') {
          this.queryParams.pageNum = 1
          this.queryParams.pageSize = 10
        }
        console.log(this.queryParams)
        this.loading = true

        customerPage({
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          param: {
            customerName: this.queryParams.customerName,
            phoneNum: this.queryParams.phoneNum,
            status: this.queryParams.status,
            activityId: this.id
          }
        }).then(res => {
          if (res.code == 200) {
            this.list = res.data.data
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading = false
        }).catch((err) => {
          console.log('err', err)
          this.$message.error(err.message)
        })
      },

      //审批驳回/通过
      activityUpdate(type, ids) {
        console.log('type, ids', type, ids)
        let that = this
        if (!ids.length) {
          this.$message.error('请先勾选！')
        } else {
          function api() {
            activityUpdateServe(ids, type).then(res => {
              if (res.code == '200') {
                that.$notify({
                  title: '成功',
                  message: '审批成功',
                  type: 'success'
                })
                that.getList()
              }
            }).finally(() => {
              that.loading = false
            })
          }

          this.$confirm('您已选择<span style=color: #334fa2;padding: 0 2px;>' + ids.length + '</span>位待审核的客户，是否确认? 确认后将会直接审批以上客户，并通过微信自动推送活动信息，请谨慎处理', '确认', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            api()
          }).catch(() => {
          })
        }

      },

      // 导出
      setExport(type) {
        let params = {}
        if (type === 1) {
          params = {
            customerName: this.queryParams.customerName,
            phoneNum: this.queryParams.phoneNum,
            status: this.queryParams.status,
            customerActIds: this.ids,
            activityId: this.id
          }
        }
        console.log('this.form', qs.stringify(params, { indices: false }))

        downApplicationList(qs.stringify(params, { indices: false })).then(result => {
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
          let filename = '名单列表' + year + month + day
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

      /** 新增按钮操作 */
      handleAdd(type) {
        this.pageType = type
        this.visible = true
        this.$nextTick(() => {
          this.$refs['eventListAdd'].visible = true
        })
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
