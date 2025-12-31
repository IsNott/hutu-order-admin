<template>
  <div class="contianer">
    <div class="query-form">
      <el-form ref="queryForm" :model="searchParam" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="handleCreatDir()">新增目录</el-button>
              <el-button type="primary" @click="handleAdd(2)">新增菜单</el-button>
              <el-button type="primary" plain v-if="selectMenus.length > 0" @click="handleChangeParent">
                变更上级
              </el-button>
              <el-button type="primary" @click="query">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table ref="tableRef" :data="menuList" stripe style="width: 100%" border row-key="id" v-loading="loading"
        @selection-change="handleSelectionChange"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren', checkStrictly: true }">
        <template #empty>
          <img src="@/assets/img/empty.png" />
          <p style="font-size: 20px">Nothing to load....</p>
        </template>
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="title" label="标题" width="120" align="center"></el-table-column>
        <el-table-column prop="name" label="菜单编码" width="120" align="center"></el-table-column>
        <el-table-column prop="path" label="访问路由" width="180" align="center"></el-table-column>
        <el-table-column prop="component" label="组件路径" width="240" align="center"></el-table-column>
        <el-table-column prop="icon" label="图标" width="120" align="center">
          <template #default="scope">
            <el-icon>
              <component :is="getIconComponent(scope.row.icon)" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="120" align="center"></el-table-column>
        <el-table-column prop="visible" label="侧边栏显示" width="120" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.visible" @change="handleSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" width="230" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" v-if="scope.row.type == 1"
              @click="handleAdd(null, scope.row.id)">添加子项</el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-model:current-page="page.page" v-model:page-size="page.size" :page-sizes="[20, 50, 100, 200]"
      background layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
      @current-change="query" />
    <EditForm :key="formKey" :type="addType" @close="handleClose" :title="title" :row-id="selectedId"
      :dialogVisible="dialogVisible" :parentId="parentId" />
    <el-dialog v-model="menuDirTreeVisible" width="500px" :title="'选择上级目录'">
      <el-tree ref="menuDirTree" :data="dirMenuList" show-checkbox
        :props="{ id: 'id', label: 'title', children: 'children', hasChildren: 'hasChildren' }" node-key="id">
        <template #default="scope">
          <el-icon>
            <component :is="getIconComponent(scope.node.data.icon)" />
          </el-icon>
          <span>{{ scope.node.data.title }}</span>
        </template>
        <template #empty>
          <img src="@/assets/img/empty.png" />
          <p style="font-size: 20px">Nothing to load....</p>
        </template>
      </el-tree>
      <template #footer>
        <el-button @click="menuDirTreeVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, defineComponent, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import EditForm from './components/EditForm.vue'
import { menuApi } from './api'
import { getIconComponent } from '@/utils'
// Data
const emptySearchParam = {}
const emptyPage = {
  page: 1,
  size: 10,
  total: 0
}
const searchParam = ref({
  parentId: '0'
})
const menuDirTreeVisible = ref(false)
const menuDirTree = ref(null)
const tableRef = ref(null)
const dirMenuList = ref([])
const menuList = ref([])
const page = ref(emptyPage)
const loading = ref(false)
const queryForm = ref(null)
const title = ref('新增系统菜单')
const dialogVisible = ref(false)
const selectedId = ref(null)
const formKey = ref(0)
const addType = ref(1)
const parentId = ref('')
const selectMenus = ref([])
// Computed
// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  query()
})

// Watchers
// Methods
const query = () => {
  loading.value = true
  menuApi.treePage(searchParam.value, page.value.page, page.value.size).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    menuList.value = res.data.records
    page.value.total = res.data.total
    page.value.size = res.data.size
  }).finally(() => {
    loading.value = false
  })
}

const handleAdd = (type, pid) => {
  if (type) {
    addType.value = type
  }
  if (pid) {
    parentId.value = pid
  }
  title.value = '新增系统菜单'
  dialogVisible.value = true
  formKey.value = Math.random()
}

const handleSelectionChange = (selection) => {
  selectMenus.value = selection
}

const handleChangeParent = () => {
  menuApi.treePage({
      parentId: '0',
      type: 1
    }, 1, 500).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      dirMenuList.value = res.data.records
      menuDirTreeVisible.value = true
    })
}

const handleCreatDir = () => {
  title.value = '新增菜单目录'
  dialogVisible.value = true
  formKey.value = Math.random()
  addType.value = 1
}

const handleUpdate = () => {
  const ids = tableRef.value.getSelectionRows().map(item => item.id)
  const pids = menuDirTree.value.getCheckedKeys()
  if(pids.length == 0){
    ElMessage.error('请选择上级目录')
    return
  }
  menuApi.updateParent(pids[0], ids).then(res => { 
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    menuDirTreeVisible.value = false
    query()
  })
}


const handleSwitch = (row) => {
  menuApi.update(row).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    query()
  })
}

const handleSizeChange = (size) => {
  page.value.size = size
  query()
}

const reset = () => {
  searchParam.value = emptySearchParam
  queryForm.value.resetFields()
  page.value = emptyPage
  query()
}

const handleClose = () => {
  selectedId.value = null
  dialogVisible.value = false
  addType.value = null
  parentId.value = ''
  query()
}
const handleEdit = (row) => {
  title.value = '编辑系统菜单'
  dialogVisible.value = true
  selectedId.value = row.id
  formKey.value = Math.random()
  addType.value = row.type
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    menuApi.delete(row.id).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success(res.message)
      query()
    })
  })
}
</script>

<style scoped lang="scss">
.contianer {
  .query-form {
    margin-bottom: 20px;
  }

  .el-table {
    // margin-bottom: 30px;
  }

  .el-pagination {
    display: flex;
    justify-content: flex-end;
  }

  .list {
    overflow-y: auto;
    max-height: calc(100vh - 340px);
    margin-bottom: 20px;
  }
}
</style>