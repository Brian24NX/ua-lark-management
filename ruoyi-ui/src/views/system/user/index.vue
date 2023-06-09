<template>
  <div class="app-container">
    <div class="pageCont">
      <el-row :gutter="20">
        <!--部门数据-->
        <el-col class="treeBox">
          <div class="head-container">
            <el-input
              v-model="deptName"
              :placeholder="$t('deptNamePlaceholder')"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container head-list">
            <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <!--用户数据-->
        <el-col class="user-page-box">

            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-position="top" v-show="showSearch" label-width="120px">

              <div class="search backBg">
                <el-row type="flex" justify="space-between" align="bottom">
                  <el-col :xs="24" :span="20">
                    <el-form-item :label="$t('userName')" prop="userName">
                      <el-input
                        v-model="queryParams.userName"
                        :placeholder="$t('userNamePlaceholder')"
                        clearable
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item :label="$t('phonenumbers')" prop="phonenumber">
                      <el-input
                        v-model="queryParams.phonenumber"
                        :placeholder="$t('phonenumbersPlaceholder')"
                        clearable
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item :label="$t('status')" prop="status">
                      <el-select
                        v-model="queryParams.status"
                        :placeholder="$t('placeholderPlaceholder')"
                        clearable
                        style="width: 240px"
                      >
                        <el-option
                          v-for="dict in dict.type.sys_normal_disable"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('creatTime')">
                      <el-date-picker
                        v-model="dateRange"
                        style="width: 240px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        :start-placeholder="$t('startPlaceholder')"
                        :end-placeholder="$t('endPlaceholder')"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-form-item :xs="24" class="findBtn">
                    <div slot="label" class="labelNull"></div>
                    <el-button type="primary" icon="el-icon-search"  @click="handleQuery">{{$t('search')}}</el-button>
                    <el-button icon="el-icon-refresh"  @click="resetQuery">{{$t('elRefresh')}}</el-button>
                  </el-form-item>
                </el-row>
              </div>
            </el-form>


          <div class="tableMain backBg">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"

                  @click="handleAdd"
                  v-hasPermi="['system:user:add']"
                >{{$t('add')}}</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-edit"

                  :disabled="single"
                  @click="handleUpdate"
                  v-hasPermi="['system:user:edit']"
                >{{$t('elEdit')}}</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-delete"

                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPermi="['system:user:remove']"
                >{{$t('delete')}}</el-button>
              </el-col>

              <el-col :span="1.5">
                <el-button
                  type="info"
                  plain
                  icon="el-icon-upload2"

                  @click="handleImport"
                  v-hasPermi="['system:user:import']"
                >{{$t('import')}}</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="warning"
                  plain
                  icon="el-icon-download"

                  @click="handleExport"
                  v-hasPermi="['system:user:export']"
                >{{$t('export')}}</el-button>
              </el-col>

              <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
            </el-row>

            <el-table stripe v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column :label="$t('userId')" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
              <el-table-column :label="$t('userName')"  align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
              <el-table-column :label="$t('nickName')"  align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
              <el-table-column :label="$t('deptName')"  align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
              <el-table-column :label="$t('phonenumber')"  align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
              <el-table-column :label="$t('status')"  align="center" key="status" v-if="columns[5].visible">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-value="0"
                    inactive-value="1"
                    @change="handleStatusChange(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column :label="$t('creatTime')" align="center" prop="createTime" v-if="columns[6].visible" width="160">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('tableHead.operation')"
                align="center"
                width="160"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope" v-if="scope.row.userId !== 1">
                  <el-button

                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:user:edit']"
                  >{{$t('elEdit')}}</el-button>
                  <el-button

                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:user:remove']"
                  >{{$t('delete')}}</el-button>
                  <el-dropdown  @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i> {{$t('more')}}
                </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                                        v-hasPermi="['system:user:resetPwd']">{{$t('resetPassword')}}</el-dropdown-item>
                      <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                                        v-hasPermi="['system:user:edit']">{{$t('assignRoles')}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>

        </el-col>
      </el-row>
    </div>



    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('nickName')" prop="nickName">
              <el-input v-model="form.nickName" :placeholder="$t('nickNamePlaceholder')" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deptId')" prop="deptId">
              <treeselect class="treeselectBox" v-model="form.deptId" :options="deptOptions" :show-count="true" :placeholder="$t('deptIdPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('phonenumber')" prop="phonenumber">
              <el-input v-model="form.phonenumber" :placeholder="$t('phonenumberPlaceholder')" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('email')" prop="email">
              <el-input v-model="form.email" :placeholder="$t('emailPlaceholder')" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" :label="$t('userName')" prop="userName">
              <el-input v-model="form.userName" :placeholder="$t('userNamePlaceholder')" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" :label="$t('password')" prop="password">
              <el-input v-model="form.password" :placeholder="$t('passwordPlaceholders')" type="password" maxlength="20" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('role')">
              <el-select v-model="form.roleIds" multiple :placeholder="$t('rolePlaceholder')">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
<!--            <el-form-item label="用户性别">-->
<!--              <el-select v-model="form.sex" placeholder="请选择性别">-->
<!--                <el-option-->
<!--                  v-for="dict in dict.type.sys_user_sex"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.label"-->
<!--                  :value="dict.value"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('status')">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
<!--            <el-form-item label="岗位">-->
<!--              <el-select v-model="form.postIds" multiple placeholder="请选择岗位">-->
<!--                <el-option-->
<!--                  v-for="item in postOptions"-->
<!--                  :key="item.postId"-->
<!--                  :label="item.postName"-->
<!--                  :value="item.postId"-->
<!--                  :disabled="item.status == 1"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
          </el-col>
          <el-col :span="12">

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('remarks')">
              <el-input v-model="form.remark" type="textarea" :placeholder="$t('remarksPlaceholders')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{$t('confirm')}}</el-button>
        <el-button @click="cancel">{{$t('cancels')}}</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >

        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('tips1')}}<em>{{$t('tips2')}}</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> {{$t('tips3')}}
          </div>
          <span>{{$t('tips4')}}。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">{{$t('tips5')}}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">{{$t('confirm')}}</el-button>
        <el-button @click="upload.open = false">{{$t('cancels')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: this.$t('userId'), visible: true },
        { key: 1, label: this.$t('userName'), visible: true },
        { key: 2, label: this.$t('nickName'), visible: true },
        { key: 3, label: this.$t('deptName'), visible: true },
        { key: 4, label: this.$t('phonenumber'), visible: true },
        { key: 5, label: this.$t('status'), visible: true },
        { key: 6, label: this.$t('creatTime'), visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: this.$t('userNameMessage1'), trigger: "blur" },
          { min: 2, max: 100, message: this.$t('userNameMessage2'), trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: this.$t('nickNameMessage1'), trigger: "blur" }
        ],
        password: [
          { required: true, message: this.$t('passwordMessage1'), trigger: "blur" },
          { min: 5, max: 20, message: this.$t('passwordMessage2'), trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: this.$t('emailMessage1'),
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: this.$t('phonenumberMessage1'),
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? this.$t('enable') : this.$t('deactivate');
      this.$modal.confirm(this.$t('tips6') + '"' + text + '""' + row.userName + '"' + this.$t('tips7')).then(function() {
        return changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + this.$t('tipsSuccess'));
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = this.$t('addUser');

        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = this.$t('modifyUser');
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt(this.$t('pleaseEnter') + '"' + row.userName + '"' + this.$t('tips8'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: this.$t('tips9')
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.$modal.msgSuccess(this.$t('tips10') + "：" + value);
          });
        }).catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess(this.$t('modificationSucceeded'));
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.$modal.msgSuccess(this.$t('successfullyAdded'));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal.confirm(this.$t('tips11') + '"' + userIds + '"'+ this.$t('tips12') +'？').then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.$t('deletionSucceeded'));
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = this.$t('userImport');
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", this.$t('importResults'), { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style lang="scss" scoped>
.treeBox{
  width: 220px;
  margin: 0 10px;
  padding: 10px;
  background: #fff;
  height: calc(100vh - 80px);
  .head-list{
    height: calc(100% - 80px);
    &::-webkit-scrollbar {
      width: 6px;
      height: 10px;
    }

    &::-webkit-scrollbar-track {
    }

    &::-webkit-scrollbar-thumb {
      background: #666;
      border-radius: 10px;
    }
  }
}

.user-page-box{
  width: calc(100% - 240px);
  height: calc(100vh - 65px);
  padding-right: 0!important;
  padding-left: 5px!important;
  position: relative;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 10px;
  }
}
</style>

<style>
  .head-container .el-tree{
    width: max-content;
    min-width: 100%;
  }
  .treeselectBox.vue-treeselect .vue-treeselect__menu-container div{
    max-width: max-content;
    min-width: 100%;
    width: max-content;
  }
</style>
