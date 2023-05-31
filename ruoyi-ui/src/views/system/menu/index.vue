<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('menuName')" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          :placeholder="$t('pleaseEnter') + $t('menuName')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('menuStatus')" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{$t('search')}}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{$t('elRefresh')}}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:menu:add']"
        >{{$t('add')}}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >{{$t('expand')}}/{{$t('collapse')}}
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
<!--      <el-table-column :prop="localeLangTab == 'zh' ? 'menuName' : 'menuEnName'" :label="$t('menuName')" :show-overflow-tooltip="true" width="160"></el-table-column>-->
      <el-table-column prop="menuName" :label="$t('menuName')" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" :label="$t('icon')" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" :label="$t('sort')" width="60"></el-table-column>
      <el-table-column prop="perms" :label="$t('perms')" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" :label="$t('component')" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" :label="$t('status')" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('creatTime')" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('tableHead.operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >{{$t('elEdit')}}
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >{{$t('add')}}
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >{{$t('delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('parentMenu')" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                :placeholder="$t('pleaseEnter') + $t('parentMenu')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('menuType')" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">{{$t('menuCatalog')}}</el-radio>
                <el-radio label="C">{{$t('menu')}}</el-radio>
                <el-radio label="F">{{$t('menuButton')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item :label="$t('menuIcon')" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected"/>
                <el-input slot="reference" v-model="form.icon" :placeholder="$t('iconSelect')" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menuCnName')" prop="menuName">
              <el-input v-model="form.menuName" :placeholder="$t('pleaseEnter') + $t('menuCnName')"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item :label="$t('menuEnName')" prop="menuEnName">-->
<!--              <el-input v-model="form.menuEnName" :placeholder="$t('pleaseEnter') + $t('menuCnName')"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item :label="$t('orderNum')" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <span slot="label">
                <el-tooltip :content="$t('tips18')" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                {{$t('isExtralinks')}}
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">{{$t('radioYes')}}</el-radio>
                <el-radio label="1">{{$t('radioNo')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip :content="$t('tips19')" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                {{$t('routingAddress')}}
              </span>
              <el-input v-model="form.path" :placeholder="$t('pleaseEnter') + $t('routingAddress')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip :content="$t('tips20')" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                 {{$t('component')}}
              </span>
              <el-input v-model="form.component" :placeholder="$t('pleaseEnter') + $t('component')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" :placeholder="$t('pleaseEnter') + $t('perms')" maxlength="100"/>
              <span slot="label">
                <el-tooltip :content="$t('tips14') + '：@PreAuthorize(`@ss.hasPermi(\'system:user:list\')`)'"
                            placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                {{$t('roleKey')}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input v-model="form.query" :placeholder="$t('pleaseEnter') + $t('routingQuery')" maxlength="255"/>
              <span slot="label">
                <el-tooltip :content="$t('tips21')" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                 {{$t('routingQuery')}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <span slot="label">
                <el-tooltip :content="$t('tips22')" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                 {{$t('isCache')}}
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">{{$t('cache')}}</el-radio>
                <el-radio label="1">{{$t('notCache')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="visible">
              <span slot="label">
                <el-tooltip :content="$t('tips23')" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                 {{$t('showStatus')}}
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in dict.type.sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="status">
              <span slot="label">
                <el-tooltip :content="$t('tips24')" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                {{$t('menuStatus')}}
              </span>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{$t('confirm')}}</el-button>
        <el-button @click="cancel">{{$t('cancels')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/system/menu'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import IconSelect from '@/components/IconSelect'
  import Cookies from "js-cookie";

  export default {
    name: 'Menu',
    dicts: ['sys_show_hide', 'sys_normal_disable'],
    components: { Treeselect, IconSelect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams: {
          menuName: undefined,
          visible: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          menuName: [
            { required: true, message: this.$t('menuNameRules'), trigger: 'blur' }
          ],
          menuEnName: [
            { required: true, message:  this.$t('menuEnNameRules'), trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message:  this.$t('orderNumRules'), trigger: 'blur' }
          ],
          path: [
            { required: true, message:  this.$t('pathRules'), trigger: 'blur' }
          ]
        },
        localeLangTab: '',
      }
    },
    created() {
      this.localeLangTab = Cookies.get('localeLang')
      this.getList()
    },
    methods: {
      // 选择图标
      selected(name) {
        this.form.icon = name
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true
        listMenu(this.queryParams).then(response => {
          this.menuList = this.handleTree(response.data, 'menuId')
          this.loading = false
        })
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        }
      },
      /** 查询菜单下拉树结构 */
      getTreeselect() {
        listMenu().then(response => {
          this.menuOptions = []
          const menu = { menuId: 0, menuName: this.$t('mainCategory'), children: [] }
          menu.children = this.handleTree(response.data, 'menuId')
          this.menuOptions.push(menu)
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          menuId: undefined,
          parentId: 0,
          menuName: undefined,
          icon: undefined,
          menuType: 'M',
          orderNum: undefined,
          isFrame: '1',
          isCache: '0',
          visible: '0',
          status: '0'
        }
        this.resetForm('form')
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
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset()
        this.getTreeselect()
        if (row != null && row.menuId) {
          this.form.parentId = row.menuId
        } else {
          this.form.parentId = 0
        }
        this.open = true
        this.title = this.$t('addMenu')
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false
        this.isExpandAll = !this.isExpandAll
        this.$nextTick(() => {
          this.refreshTable = true
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        this.getTreeselect()
        getMenu(row.menuId).then(response => {
          this.form = response.data
          this.open = true
          this.title = this.$t('updateMenu')
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.menuId != undefined) {
              updateMenu(this.form).then(response => {
                this.$modal.msgSuccess(this.$t('modificationSucceeded'))
                this.open = false
                this.getList()
              })
            } else {
              addMenu(this.form).then(response => {
                this.$modal.msgSuccess(this.$t('successfullyAdded'))
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm(this.$t('tips25') + '"' + row.menuName + this.$t('tips12') + '"？').then(function() {
          return delMenu(row.menuId)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('deletionSucceeded'))
        }).catch(() => {
        })
      }
    }
  }
</script>
<style scoped>
  .el-col-12{
    min-height: 51px;
  }
</style>
