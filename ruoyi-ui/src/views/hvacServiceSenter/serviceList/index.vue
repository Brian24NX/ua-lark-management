<template>
  <div class="app-container">

    <div class="page-main">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="网点名称" prop="centerName">
          <el-input
            v-model="queryParams.centerName"
            placeholder="网点名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="地区" prop="provId">
          <el-select clearable v-model="queryParams.provId" @change="getCityList" placeholder="请选择省">
            <el-option v-for="(item,index) of provinceList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item clearable prop="cityId">
          <el-select clearable v-model="queryParams.cityId" placeholder="请选择市">
            <el-option v-for="(item,index) of cityList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="handleQuery">搜索</el-button>
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
          >新增网点
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <div class="content">
        <el-table stripe ref="table" v-loading="loading" :data="list">
          <el-table-column label="网点名称" align="center" prop="centerName" min-width="120"/>
          <el-table-column label="地区" align="center" prop="provName" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.provName}}{{scope.row.cityName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="网点地址" align="center" prop="jobId3" min-width="220">
            <template slot-scope="scope">
              <span>{{scope.row.centerAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column label="位置" align="center" prop="jobId4" min-width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="handleInfo('openPic' ,scope.row.addressPicPath)">
                <div style="position: relative;border-bottom: 1px solid #84868a;">
                  <span>查看位置</span>
                </div>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleInfo('edit' ,scope.row)">编辑</el-button>
              <el-button type="text" @click="handleInfo('del' ,scope.row.centerId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-image-viewer
      v-if="showPreview"
      :on-close="closeViewer"
      :urlList="previewImages"
    ></el-image-viewer>


    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <add v-if="visible" ref="eventListAdd" :pageType="pageType" :detailData="detailData" @emitInit="getList"/>

  </div>
</template>

<script>
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  import add from './add'
  import {
    getProvinceListServe
  } from '@/api/hvacEventManagementApi'

  import {
    pageSearch,
    deleteCenterId
  } from '@/api/hvacServiceSenter'

  export default {
    name: 'hvacServiceSenter',
    components: {
      add,
      ElImageViewer
    },
    data() {
      return {
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
          centerName: '',
          cityId: '',
          provId: ''
        },
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [
          // {
          //   jobId1: '北京办事处',
          //   jobId2: '北京市',
          //   jobId3: '北京市东城区建国门南大街7号北京璞邸酒店办公楼A座7层',
          //   jobId4: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          // },
          // {
          //   jobId1: '成都办事处',
          //   jobId2: '四川省成都市',
          //   jobId3: '四川省成都市锦江区三色路38号博瑞创意成都B座2203室',
          //   jobId4: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
          // }
        ],
        pageType: '',
        visible: false,
        detailData: {}
      }
    },
    created() {
      this.getList(('rest'))
      this.getProvinceList(0)
    },
    mounted() {
    },
    methods: {
      getProvinceList(level) {
        getProvinceListServe(level).then(res => {
          if (res.code == 200) {
            res.data.forEach(item => {
              this.provinceList.push({
                value: item.areaId,
                label: item.areaName
              })
            })
          }
        })
      },
      getCityList(id) {
        this.queryParams.cityId = ''
        if (id) {
          this.cityList = []
          getProvinceListServe(id).then(res => {
            if (res.code == 200) {
              res.data.forEach(item => {
                this.cityList.push({
                  value: item.areaId,
                  label: item.areaName
                })
              })
            }
          })
        }
      },
      closeViewer() {
        this.showPreview = false
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
        pageSearch({
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          param: {
            centerName: this.queryParams.centerName,
            cityId: this.queryParams.cityId,
            provId: this.queryParams.provId
          }
        }).then(res => {
          if (res.code == 200) {
            this.list = res.data.data
            this.total = res.data.total
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
          this.handleAdd(type)
        }

        if (type == 'openPic') {
          // 2. 点击「查看位置」，底部出蒙层弹出位置图片（可放大放小），点击叉可关闭
          this.showPreview = true
          this.previewImages = [scope]
          // this.$nextTick(() => {
          //   this.$refs.elImage.$el.addEventListener('click', () => {
          //   })
          // })
        }

        if (type == 'del') {
          this.$confirm('请确认是否删除', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.loading = true
            deleteCenterId(scope).then(res => {
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
