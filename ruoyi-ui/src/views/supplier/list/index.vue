<template>
  <div class="app-container">
    Supplier List
  </div>
</template>

<script>
  import { page, del, publish } from '@/api/hvacEventManagementApi'

  export default {
    name: 'hvacServiceSenterServiceList',
    components: {
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
