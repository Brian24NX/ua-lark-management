<template>
  <div v-loading="isLoading" class="comp-tree">

    <div style="display:;margin-bottom: 20px;padding: 0 10px;">
      <el-input class="mr10" prefix-icon="el-icon-search" clearable placeholder="输入关键字进行过滤"
                v-model="filterText"></el-input>
      <el-button type="primary" class="add_new_question" @click="handleAdd()">添加父节点</el-button>
    </div>

    <div class="treeList">
      <div class="treeListCont">
        <el-tree
          ref="tree"
          node-key="id"
          :data="data"
          :props="defaultProps"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :default-expanded-keys="defaultExpandedCids"
          @node-click="handleNodeClick">

          <div class="comp-tr-node" slot-scope="{ node, data }">

            <!-- 编辑状态 -->
            <template v-if="node.isEdit">
              <el-input v-model="data.label"
                        autofocus
                        class="treeInput"
                        :ref="'treeInput'+data[NODE_KEY]"
                        @blur.stop="handleInput(node, data)"
                        @keyup.enter.native="handleInput(node, data)"></el-input>
            </template>

            <!-- 非编辑状态 -->
            <template v-else>
              <!-- 名称： 新增节点增加class（is-new） -->
              <span :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']">
							{{ node.label }}
						</span>

              <!-- 按钮 -->
              <span class="comp-tr-node--btns">
							<!-- 新增 -->
							<el-button icon="el-icon-plus"
                         size="mini"
                         circle
                         type="primary"
                         @click="handleAdd(node, data)"></el-button>

                <!-- 编辑 -->
							<el-button icon="el-icon-edit"
                         size="mini"
                         circle
                         type="info"
                         @click="handleEdit(node, data)"></el-button>

                <!-- 删除 -->
							<el-button icon="el-icon-delete"
                         size="mini"
                         circle
                         type="danger"
                         @click="handleDelete(node, data)"></el-button>
						</span>
            </template>

          </div>

        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTree, add, del, edit } from '@/api/material'

  export default {
    props: {
      pageType: {
        type: String,
        default: ''
      },
      detailData: {
        type: Object,
        default: null
      }
    },
    components: {},
    computed: {},
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    data() {
      return {
        isLoading: false,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultExpandedCids: [],
        NODE_KEY: 'id',// id对应字段
        MAX_LEVEL: 10,// 设定最大层级
        NODE_ID_START: 0,// 新增节点id，逐次递减
        initParam: {// 新增参数
          label: '新增节点',
          pid: 0,
          children: []
        },
        // tree
        filterText: ''
      }
    },
    created() {
      // 初始值
      this.getgetTree()
    },
    mounted() {
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      copyObj(obj) {
        obj.isEdit = false
        if (!!obj['children'] && obj['children'].length > 0) {
          for (var j = 0; j < obj.children.length; j++) {
            obj.children[j] = this.copyObj(obj.children[j])
          }
        }
        return obj
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys())
      },
      getgetTree() {
        this.isLoading = true
        getTree().then(res => {
          this.isLoading = false
          if (res.code == 200) {
            if (res.data.length > 0) {
              let newData = []
              res.data.forEach((item) => {
                newData.push(this.copyObj(item))
              })
              this.data = newData
            }
          }
        })
      },
      //  选中当前节点
      handleNodeClick(_node, _data) {
        console.log(_node)
        console.log(_data)
      },

      // 新增节点
      handleAdd(_node, _data) {
        console.log('_node', _node)
        console.log('_data', _data)

        let params = {
          categoryName: '新增节点',
          tenantCode: 'tenantCode',
          updateUser: '',
          createUser: '' // 创建人唯一code
        }
        if (typeof _data === 'object') {
          // 判断层级
          if (_node.level >= this.MAX_LEVEL) {
            this.$message.warning('当前已达到' + this.MAX_LEVEL + '级，无法新增！')
            return false
          }

          params.categoryPath = _data.path + '/新增节点'
          params.corder = !!_data.children && _data.children.length > 0 ? _data.children.length + 1 : 0
          params.parentId = _data.id
          params.rootId = _data.rootId

          console.log('params111', this.$refs.tree.root.childNodes)

          // let pathId = _node.store.root.childNodes[0].store.nodesMap
          // this.defaultExpandedCids = []
          // for(var key in pathId) {
          //   console.log('pathId', pathId[key])
          //   if (pathId[key].expanded){
          //     this.defaultExpandedCids.push(pathId[key].id)
          //   }
          // }
          //
          // console.log('123', this.defaultExpandedCids)

        } else {
          params.parentId = 0
          params.rootId = 0
        }
        console.log('params', params)


        add(params).then(res => {
          if (res.code == 200) {
            // 展开节点
            //this.getCheckedKeys()
            this.getgetTree()
          }
        })
      },
      // 开启编辑节点
      handleEdit(_node, _data) {
        if (!_node.isEdit) {
          this.$set(_node, 'isEdit', true)
        }
      },
      // 提交编辑节点
      handleInput(_node, _data) {
        console.log(_node, _data)

        let params = {
          categoryName: _data.label,
          categoryPath: _data.path,
          cid: _data.id,
          parentId: _data.parentId,
          rootId: _data.rootId,
          tenantCode: 'tenantCode',
          updateUser: '',
          createUser: ''
        }
        console.log('params', params)

        edit(params).then(res => {
          if (res.code == 200) {
            this.getgetTree()
          }
        })

        // 退出编辑状态
        if (_node.isEdit) {
          //  this.$set(_node, 'isEdit', false)
        }
      },
      // 删除节点
      handleDelete(_node, _data) {
// 判断是否存在子节点
        if (_data.children && _data.children.length !== 0) {
          this.$message.error('此节点有子级，不可删除！')
          return false
        } else {
          del(_data.id).then(res => {
            if (res.code == 200) {
              // 展开节点
              this.getgetTree(() => {
                if (!_node.expanded) {
                  _node.expanded = true
                }
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  /* common */

  // 显示按钮
  .show-btns {
    opacity: 1;
  }

  /* common end */

  .comp-tree {
    width: 100%;

    .add_new_question{
      width: 100%;
      margin-top: 10px;
    }
    .treeList{
      font-size: 14px;
      height: calc(100vh - 235px);
      overflow: scroll;
      margin: 0 5px 0 5px;
      padding-bottom: 15px;

      .treeListCont{
        width: max-content;
        min-width: 100%;
      }

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-track {
      }

      &::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 10px;
      }
    }

    // 自定义节点
    .comp-tr-node {
      // label
      .comp-tr-node--name {
        display: inline-block;
        line-height: 40px;
        min-height: 40px;
        // 新增
        &.is-new {
          font-weight: bold;
        }
      }

      // button
      .comp-tr-node--btns {
        margin-left: 10px;
        opacity: 0;
        transition: opacity .1s;

        .el-button {
          transform: scale(0.8); // 缩小按钮
          & + .el-button {
            margin-left: -1px;
          }
        }
      }
    }

    // 高亮显示按钮
    .is-current {
      & > .el-tree-node__content {
        .comp-tr-node--btns {
          @extend .show-btns;
        }
      }
    }

    // 悬浮显示按钮
    .el-tree-node__content {
      &:hover {
        .comp-tr-node--btns {
          @extend .show-btns;
        }
      }
    }
  }
</style>
<style>
  .treeInput .el-input__inner {
    height: 26px;
    line-height: 26px;
  }
</style>
