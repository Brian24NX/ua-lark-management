<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="Material/Code" prop="code">
          <el-input v-model="queryParams.code" placeholder="Material/Code" clearable/>
        </el-form-item>

        <el-form-item label="Category">
          <el-select @change="getList('rest')" clearable v-model="queryParams.category">
            <el-option v-for="(dict, index) in categorySelect" :key="index" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="Supplier">
          <el-select @change="getList('rest')" clearable v-model="queryParams.supplier">
            <el-option v-for="(dict, index) in supplierSelect" :key="index" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="Status">
          <el-select @change="getList('rest')" clearable v-model="queryParams.status">
            <el-option v-for="(dict, index) in statusSelect" :key="index" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button :loading="loading" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd('add')">Add Material</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd('add')">Import</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd('add')">Export</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="Image" align="center" prop="Image" min-width="120">
            <template slot-scope="scope">
              <img src="">
            </template>
          </el-table-column>
          <el-table-column label="Material" align="center" prop="Material" min-width="220">
            <template slot-scope="scope">
              Material
            </template>
          </el-table-column>
          <el-table-column label="Code" align="center" prop="Code" min-width="120" />
          <el-table-column label="Category" align="center" prop="Category" min-width="120" />
          <el-table-column label="Specifications" align="center" prop="Specifications" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.published || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Unit" align="center" prop="Unit" min-width="120"/>
          <el-table-column label="Retail Price" align="center" prop="Retail" min-width="120"/>
          <el-table-column label="Cost Price" align="center" prop="Cost" min-width="120"/>
          <el-table-column label="Material Status" align="center" prop="Status" min-width="120"/>
          <el-table-column label="Update Time" align="center" prop="UpdateTime" min-width="120"/>
          <el-table-column label="Supplier" align="center" prop="Supplier" min-width="120"/>

          <el-table-column label="Action" align="center" width="240" fixed="right">
            <template slot-scope="scope">
              <el-button  type="text" @click="handleInfo('Off' ,scope.row)"> Off-sale </el-button>
              <el-button  type="text" @click="handleInfo('On' ,scope.row)">On-sale</el-button>
              <el-button  type="text" @click="handleInfo('Modify' ,scope.row)">Modify</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <div v-if="handleSelection.length">
      Total：{{handleSelection.length}} materials
    </div>

    <add v-if="visibleHandle" ref="eventListAdd" :pageType="pageType" :detailData="detailData" @emitInit="getList"/>

  </div>
</template>

<script>
  import add from './add'
  import { page, del, publish } from '@/api/hvacEventManagementApi'

  export default {
    name: 'materialList',
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
          code: '',
          category: '',
          supplier: '',
          status: '',
        },
        categorySelect: [],
        supplierSelect: [],
        statusSelect: [],
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        handleSelection: [],
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.handleSelection = selection.map(item => item.roleId)
        console.log("this.handleSelection", this.handleSelection)
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
        if (type === 'rest') {
          this.queryParams.pageNum = 1
          this.queryParams.pageSize = 10
        }

        console.log(this.queryParams)
        this.loading = false

        for (var i = 0; i < 12; i++){
          this.list.push({
            roleId: i,
            Code: i++
          })
        }
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
