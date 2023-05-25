<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="问题" prop="keyWord">
          <el-input v-model="queryParams.keyWord" style="width: 100%" placeholder="问题" clearable @clear="getList"
                    @keyup.enter.native="getList"/>
        </el-form-item>

        <el-form-item label="状态" prop="active">
          <el-select v-model="queryParams.active" size="small" placeholder="状态" clearable filterable style="width: 100%"
                     @change="getList">
            <el-option v-for="(item, index) in activeList" :key="item.index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" :loading="loading" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="handleAdd('add')"
          >新增问题
          </el-button>
          <el-button type="primary" plain @click="openVisible = true">导入</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column label="问题编号" prop="id"  width="80"></el-table-column>
          <el-table-column align="center" label="问题名称" prop="question">
            <template scope="scope">
              <span style="white-space: pre-line;cursor: pointer;text-decoration: underline;" @click="handleDetail(scope.row)">{{ scope.row.question }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="关键词" prop="faqKeywords"/>
          <el-table-column label="关联问题" prop="faqRelations" align="center">
            <template scope="scope">
              {{ scope.row.faqRelations }}
              <el-button type="text" icon="el-icon-search" @click="editrelations(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" prop="active" width="150px">
            <template scope="scope">
              {{ transactive(scope.row) }}
              <el-tooltip :ref="`popover-${scope.$index}`" class="item" effect="dark" :content="scope.row.checkRemark"
                          placement="top">
                <i v-show="scope.row.active === 3" style="color: #e10202;" class="el-icon-question"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建人" prop="creator"/>
          <el-table-column align="center" label="创建时间" prop="createTime" :formatter="formatDate" min-width="160px"/>
          <el-table-column label="操作" align="center" fixed="right" width="180px">
            <template scope="scope">
              <el-button v-if="scope.row.active !== 1" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.active === 0" type="text" @click="handleUpdateStatus(scope.row, 1)">启用
              </el-button>
              <el-button v-if="scope.row.active === 1" type="text" @click="handleUpdateStatus(scope.row, 0)">禁用
              </el-button>
              <el-button type="text" class="danger" @click="handleDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <add v-if="visible" ref="eventListAdd" :pageType="pageType" :detailData="detailData" @emitInit="getList"/>

    <import-upload @openInt="openInt" :openVisible="openVisible" :apiUrl="importUploadUrl" />

    <!--编辑relations-->
    <el-dialog title="关联问题" :visible.sync="relationsdialog" destroy-on-close :close-on-click-modal="false">
      <el-form ref="relationsform" :model="relationsform" :rules="relationsrules">
        <el-form-item label="关联问题" prop="faqRelations">
          <el-select v-model="relationsform.faqRelations" multiple clearable filterable style="width: 100%"
                     placeholder="请选择">
            <el-option v-for="item in faqLists" :key="item.value" :label="item.question" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="subLoading" type="primary" @click="submitrelations">确定</el-button>
        <el-button @click="canclerelations">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { formatDate } from '@/utils/index'
  import add from './add'
  import ImportUpload from '@/components/ImportUpload'
  import { faqList, faqAdd, faqDel, faqEdit, faqDetail, faqEditRelations, faqActive } from '@/api/faq'
  import qs from 'qs'

  export default {
    name: 'hvacServiceSenter',
    components: {
      add,
      ImportUpload
    },
    data() {
      return {
        importUploadUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_CCR_PATH + 'faqImport',
        openVisible: false,
        showPreview: false,
        previewImages: [],
        // 显示搜索条件
        showSearch: true,
        provinceList: [],
        cityList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          keyWord: '',
          active: ''
        },
        activeList: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
          // { label: '待审核', value: 2 },
          // { label: '已驳回', value: 3 }
        ],
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        pageType: '',
        visible: false,
        detailData: {},

        relationsdialog: false,
        relationsform: {
          id: '',
          faqRelations: []
        },
        faqLists: [],
        relationsrules: {
          faqRelations: { required: true, message: '关联问题必填', trigger: 'blur' }
        },
        subLoading: false
      }
    },
    created() {
      this.getList(('rest'))
    },
    mounted() {},
    methods: {
      // 下载文件
      setExport() {
        window.open('https://qiwei-havc.oss-cn-shanghai.aliyuncs.com/Import%20FAQs.xlsx')
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

        this.loading = true
        faqList(qs.stringify(this.queryParams)).then(res => {
          if (res.code == 200) {
            this.list = res.data.list
            this.total = res.data.total
          }  else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },

      /** 新增按钮操作 */
      handleAdd(type) {
        this.pageType = type
        this.visible = true
        this.$nextTick(() => {
          this.$refs['eventListAdd'].visible = true
        })
      },

      // 编辑关联问题
     async editrelations(row) {
        await this.getFaqLists()
        const relationsform = JSON.parse(JSON.stringify(row))
        this.relationsform = {
          id: relationsform.id,
          faqRelations: relationsform.faqRelations ? relationsform.faqRelations.split(',').map(Number) : []
        }
        this.relationsdialog = true
      },

      // 激活启用
      transactive(data) {
        if (data.active === 1) {
          return '启用'
        } else if (data.active === 0) {
          return '禁用'
        } else if (data.active === 2) {
          return '待审核'
        } else if (data.active === 3) {
          return '拒绝'
        }
      },

      formatDate(row, column, cellValue, index) {
        return formatDate(cellValue)
      },

      // 编辑
      handleDetail(row) {
        this.detailData = row
        this.handleAdd('detail')
      },

      // 编辑
      handleEdit(row) {
        this.detailData = row
        this.handleAdd('edit')
      },

      // 删除数据
      handleDel(id) {
        this.$confirm('请确认是否删除', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.loading = true
          faqDel(id).then(res => {
            if (res.code == 200) {
              this.getList()
            }
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
        })
      },

      // 状态改变
      handleUpdateStatus(row, active) {
        faqActive({
          id: row.id,
          active: active
        }).then(res => {
          if (res.code == 200) {
            this.getList()
          }
        }).finally(() => {
          this.loading = false
        })
      },

      getFaqLists() {
        faqList(qs.stringify({
          pageNum: 1,
          pageSize: 9999,
          keyWord: '',
          active: '1'
        })).then((res) => {
          this.faqLists = res.data.list
        })
      },

      // 编辑并修改问题
      async submitrelations() {
        this.$refs['relationsform'].validate(async(valid) => {
          if (valid) {
            const data = {
              id: this.relationsform.id,
              faqRelations: this.relationsform.faqRelations.join(',')
              // updateUser: JSON.parse(localStorage.getItem('userInfo')).id
            }
            this.subLoading = true
            await faqEditRelations(data)
            // this.$refs.pagination.pageRequest()
            this.getList()
            this.relationsdialog = false
            this.subLoading = false
          } else {
            return false
          }
        })
      },

      // 去掉提交relations
      canclerelations() {
        this.relationsdialog = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
