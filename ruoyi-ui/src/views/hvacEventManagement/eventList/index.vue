<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="活动名称" prop="activityName">
          <el-input
            v-model="queryParams.activityName"
            placeholder="请输入活动名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button :loading="loading" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="handleAdd('add')"
          >新增
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column label="活动名称" align="center" prop="activityName" min-width="220">
            <template slot-scope="scope">
              <el-button type="text" @click="handleInfo('detail' ,scope.row)">
                <span style="border-bottom: 1px solid #84868a;">{{scope.row.activityName}}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="活动时间" align="center" min-width="220">
            <template slot-scope="scope">
              <span>{{scope.row.activityStartTime}}</span> <span>~</span><br/>
              <span>{{scope.row.activityEndTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报名状态" align="center" prop="registrationStatus" min-width="120">
            <template slot-scope="scope">
              <span class="status-color status-color-Not" v-if="scope.row.enrollmentStatus == 1">报名未开始</span>
              <span class="status-color status-color-In" v-if="scope.row.enrollmentStatus == 2">报名进行中</span>
              <span class="status-color status-color-Over" v-if="scope.row.enrollmentStatus == 3">报名已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="活动状态" align="center" prop="activityStatus" min-width="120">
            <template slot-scope="scope">
              <span class="status-color status-color-Not" v-if="scope.row.activityStatus == 1">活动未开始</span>
              <span class="status-color status-color-In" v-if="scope.row.activityStatus == 2">活动进行中</span>
              <span class="status-color status-color-Over" v-if="scope.row.activityStatus == 3">活动已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="发布状态" align="center" prop="published" min-width="120">
            <template slot-scope="scope">
              <span class="status-color status-color-Not" v-if="scope.row.published == 0">未发布</span>
              <span class="status-color status-color-In" v-if="scope.row.published == 1">已发布</span>
            </template>
          </el-table-column>
          <el-table-column label="已报名人数" align="center" prop="numberOfApplicants" min-width="120"/>
          <el-table-column label="操作" align="center" width="240" fixed="right">
            <template slot-scope="scope">
              <!--   1）发布状态为【已发布】时  展示 【取消发布】、【编辑】、【名单管理】   -->
              <!--   2）发布状态为【未发布】时 展示  【发布】、【编辑】、【名单管理】、【删除】    -->
              <el-button v-if="scope.row.published == 1" type="text" @click="handleInfo('Unpublish' ,scope.row)">取消发布
              </el-button>
              <el-button v-if="scope.row.published == 0" type="text" @click="handleInfo('publish' ,scope.row)">发布
              </el-button>
              <el-button v-if="scope.row.published == 0" type="text" @click="handleInfo('edit' ,scope.row)">编辑</el-button>
              <el-button type="text" @click="handleInfo('managementList' ,scope.row.id)">名单管理</el-button>
              <el-button v-if="scope.row.published == 0" type="text" @click="handleInfo('del' ,scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <add v-if="visibleHandle" ref="eventListAdd" :pageType="pageType" :detailData="detailData" @emitInit="getList"/>

  </div>
</template>

<script>
  import add from './add'
  import { page, del, publish } from '@/api/hvacEventManagementApi'

  export default {
    name: 'hvacServiceSenterServiceList',
    components: {
      add
    },
    data() {
      return {
        // 显示搜索条件
        showSearch: true,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activityName: ''
        },
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],

        pageType: '',
        visibleHandle: false,
        detailData: {}
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
        this.loading = true
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

      /** 操作按钮集合 */
      handleInfo(type, scope) {
        console.log('typescope', type, scope)
        if (type == 'edit' || type == 'detail') {
          this.detailData = scope
          this.handleAdd(type)
        }
        if (type == 'managementList') {
          this.$router.push({ path: '/hvacEventManagement/nameList', query: { id: scope } })
        }
        if (type == 'publish' || type == 'Unpublish') {
          this.loading = true
          publish({
            id: scope.id,
            published: type == 'publish' ? 1 : 0
          }).then(res => {
            if (res.code == 200) {
              this.getList()
            }
          }).finally(() => {
            this.loading = false
          })
        }
        if (type == 'del') {
          this.$confirm('请确认是否删除', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.loading = true
            del({
              id: scope
            }).then(res => {
              if (res.code == 200) {
                this.getList()
              }
            }).finally(() => {
              this.loading = false
            })
          }).catch(() => {
          })
        }

      },

      /** 新增按钮操作 */
      handleAdd(type) {
        this.pageType = type
        this.visibleHandle = true
        this.$nextTick(() => {
          this.$refs['eventListAdd'].visible = true
        })
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
