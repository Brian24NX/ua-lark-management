<template>
  <div class="app-container">

    <div class="treeBox">

      <h2>
        <span>Material Category</span>
        <hamburger id="categoryContainer" class="categoryContainer" @toggleClick="toggleSideBar" />
      </h2>
      <div class="treeList">
        <cate-tree></cate-tree>
      </div>

    </div>

    <div class="pageRight">
      <div class="search backBg">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-position="top" v-show="showSearch">
          <el-row type="flex" justify="space-between" align="bottom">
            <el-col :xs="24" :span="20">
              <el-form-item label="Material/Code" prop="code">
                <el-input v-model="queryParams.code" placeholder="Material/Code" clearable/>
              </el-form-item>

              <!--            <el-form-item label="Category">-->
              <!--              <el-select @change="getList('rest')" clearable v-model="queryParams.category">-->
              <!--                <el-option v-for="(dict, index) in categorySelect" :key="index" :label="dict.label" :value="dict.value"/>-->
              <!--              </el-select>-->
              <!--            </el-form-item>-->

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
          <div>
            <el-button type="" :disabled="!handleSelection.length > 0 " @click="sale('all')">On Sale</el-button>
            <el-button type="" :disabled="!handleSelection.length > 0 "  @click="sale('all')">Off Sale</el-button>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="handleInfo('add')">Add Material</el-button>
            <el-button icon="el-icon-upload2" @click="openVisible = true">{{$t('import')}}</el-button>
            <el-button icon="el-icon-download" @click="download">{{$t('export')}}</el-button>
          </div>
        </el-row>

        <div class="content">
          <el-table stripe ref="table" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column fixed="left" type="selection" width="55" align="center" />
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
                <el-button  type="text" @click="sale('off', scope.row)"> Off-sale </el-button>
                <el-button  type="text" @click="sale('on', scope.row)">On-sale</el-button>
                <el-button  type="text" @click="handleInfo('Modify' ,scope.row)">Modify</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-row class="mb10" type="flex" justify="space-between">
          <div>
            <span style="margin-top: 45px;display: block;" v-if="handleSelection.length">Total：{{handleSelection.length}} materials</span>
          </div>

          <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </el-row>
      </div>
    </div>

    <add v-if="visibleHandle" ref="eventListAdd" :pageType="pageType" :detailData="detailData" @emitInit="getList"/>

<!--  导入   -->
    <import-upload @openInt="openInt" :apiUrl="'/school/importStudentAccountData/'" :openVisible="openVisible"></import-upload>

  </div>
</template>

<script>
  import Hamburger from '@/components/Hamburger'
  import ImportUpload from '@/components/ImportUpload'
  import add from './add'
  import cateTree from './tree'
  import { page, del, categoryTree } from '@/api/material'

  export default {
    name: 'materialList',
    components: {
      add,
      ImportUpload,
      cateTree,
      Hamburger
    },
    data() {
      return {
        openVisible: false,
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
        detailData: {},
      }
    },

    created() {
      this.getList(('rest'))
    },
    mounted() {
      window.onresize = () => {
        return (() => {
           this.toggleSideBar()
        })();
      };
    },
    methods: {

      toggleSideBar() {

        if (document.querySelector('.treeBox').offsetWidth > 220) {
          document.querySelector('.treeBox').style.width = 220 + 'px'
          document.querySelector('.pageRight').style.width = document.querySelector('.app-container').offsetWidth - 220 + 'px'
        } else {
          let wid = document.querySelector('.treeListCont').offsetWidth
          document.querySelector('.treeBox').style.width = wid + 20 + 'px'
          document.querySelector('.pageRight').style.width = document.querySelector('.app-container').offsetWidth - wid - 20 + 'px'
        }

      },

      openInt(type){
        this.openVisible = false
        if (type === 'getList'){
          this.getList()
        }
      },

      download() {
        downStudentAccount(this.queryParams).then(result => {
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
          let filename = 'Account Information ' + sessionStorage.getItem('academicSystemName') + year + month + day
          let blob = new Blob([result], {type: 'application/vnd.ms-excel'})
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


      // 多选框选中数据
      handleSelectionChange(selection) {
        this.handleSelection = selection.map(item => item.id)
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

      /** 操作按钮集合 */
      handleInfo(type, scope) {
        console.log('typescope', type, scope)

        if (type == 'edit') {
          this.detailData = scope
        }

        this.handleAdd(type)
      },

      sale(type, scope) {
        console.log('sale', type, scope)
        let ids = []
        if (type == 'all') {
          ids = this.handleSelection
        } else {
          ids = [scope.id]
        }


        this.$confirm('请确认是否该操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.loading = true
          del({
            id: ids
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
.treeBox{
  width: 220px;
  margin: 0;
  background: #fff;
  height: calc(100vh - 80px);
  float: left;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  h2{
    font-size: 16px;
    margin: 15px 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    .categoryContainer{
      padding: 0!important;
      cursor: pointer;
    }
  }
}
  .pageRight{
    width: calc(100% - 220px);
    height: calc(100vh - 60px);
    transition: all 0.3s;
    padding: 10px;
    margin: -7px;
    position: relative;
    overflow-y: scroll;
    float: right;
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
    }

    &::-webkit-scrollbar-thumb {
      background: #666;
      border-radius: 10px;
    }
  }
</style>
