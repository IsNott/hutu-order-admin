<template>
  <div class="contianer">
    <div class="left">
      <div class="title">
        门店列表
      </div>
      <el-tree :data="treeData" node-key="index" v-loading="tLoading" :default-checked-keys="[1]" :props="defaultProps"
        @node-click="handleNodeClick" />
    </div>
    <div class="right">
      <div class="query-form">
        <el-form ref="queryForm" :model="searchParam" label-width="80px">
          <el-row gutter="10">
            <el-col :span="6" :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
              <el-form-item label="名称">
                <el-input clearable v-model="searchParam.menuCatalogName" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
              <el-form-item label="创建时间">
                <el-date-picker v-model="searchParam.createTime" placeholder="请输入创建时间" type="date" style="width: 100%"
                  value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>  
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button type="primary" @click="queryCatalog">查询</el-button>
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" v-if="catalogList.length > 0" @click="handleCopy" plain >复制</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="list">
        <el-table :data="catalogList" border style="width: 100%" v-loading="loading">
          <template #empty>
            <img src="@/assets/img/empty.png" />
            <p style="margin-top: 10px; font-size: 20px">Nothing to load....</p>
          </template>
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column prop="shopName" label="所属门店" align="center">
          </el-table-column>
          <el-table-column prop="menuCatalogName" label="名称" width="120" align="center">
          </el-table-column>
          <el-table-column prop="showIndex" label="排序" width="80" align="center">
          </el-table-column>
          <!-- <el-table-column prop="itemNum" label="关联商品" width="100" align="center">
          </el-table-column> -->
          <el-table-column label="点单页显示" width="240" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.showSide" active-text="显示" inactive-text="隐藏"
                @change="handleSwitch(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination v-model:current-page="page.page" v-model:page-size="page.size" :page-sizes="[20, 50, 100, 200]"
        background layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
        @current-change="queryCatalog" />
      <EditForm :key="formKey" @close="handleClose" :title="title" :row-id="selectedId" :dialogVisible="dialogVisible" :selected-store-id="selectedNode?.id" />
      <el-dialog v-model="copyDialogVisible" title="复制分类" width="600px">
        <div class="copy-tree">
          <div class="left-tree">
            <div class="tree-title">目标门店</div>
            <div class="tree">
              <el-tree ref="storeTreeRef" :data="copyStoreTreeData" v-loading="tLoading" show-checkbox :props="defaultProps" />
            </div>
          </div>
          <div class="right-tree">
            <div class="tree-title">菜单分类</div>
            <div class="tree">
              <el-tree ref="catalogTreeRef" :data="catalogTreeData" v-loading="tLoading" show-checkbox :props="defaultProps" />
            </div>
          </div>
        </div>
        <template #footer>
          <el-button @click="copyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCopySubmit">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeApi } from '@/views/store/api'
import { catalogApi } from './api'
import EditForm from './components/EditForm.vue'

// Data
const defaultProps = {
  children: 'children',
  label: 'label',
}
const stores = ref([])
const emptyPage = {
  page: 1,
  size: 10,
  total: 0
}
const tLoading = ref(false)
const searchParam = ref({})
const catalogList = ref([])
const page = ref(emptyPage)
const loading = ref(false)
const queryForm = ref(null)
const selectedNode = ref(null)
const title = ref('新增分类')
const dialogVisible = ref(false)
const selectedId = ref(null)
const formKey = ref(0)
const storeTreeRef = ref(null)
const catalogTreeRef = ref(null)
const copyDialogVisible = ref(false)
// Computed
const treeData = computed(() => {
  let treeData = []
  for (let i = 0; i < stores.value.length; i++) {
    const val = stores.value[i]
    if (!val) continue
    treeData.push({
      label: val.shopName,
      id: val.id,
      index: i + 1,
      children: val?.children || []
    })
  }
  return treeData
})

const copyStoreTreeData = computed(() => {
  let treeData = []
  for (let i = 0; i < stores.value.length; i++) {
    const val = stores.value[i]
    if (!val) continue
    treeData.push({
      label: val.shopName,
      id: val.id,
      disabled: selectedNode.value?.id === val.id,
      index: i + 1,
      children: val?.children || []
    })
  }
  return treeData
})

const catalogTreeData = computed(() => {
  let treeData = []
  for (let i = 0; i < catalogList.value.length; i++) {
    const val = catalogList.value[i]
    if (!val) continue
    treeData.push({
      label: val.menuCatalogName,
      id: val.id,
      index: i + 1,
      children: val?.children || []
    })
  }
  return treeData
})
// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  queryStore()
  queryCatalog()
})

// Watchers
watch(() => treeData.value, (newValue) => {
  handleNodeClick(newValue[0])
})
// Methods
const queryStore = () => {
  tLoading.value = true
  storeApi.quertStroePage({}, 1, 1000).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    stores.value = res.data.records
  }).finally(() => {
    tLoading.value = false
  })
}
const queryCatalog = () => {
    loading.value = true
    catalogApi.query(searchParam.value, page.value.page, page.value.size).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      catalogList.value = res.data.records
      page.value.total = res.data.total
      page.value.size = res.data.size
    }).finally(() => {
      loading.value = false
    })
  }

const handleSwitch = (row) => {
  catalogApi.update(row.id, row).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    queryCatalog()
  })
}
const reset = () => {
  searchParam.value = {}
  queryForm.value.resetFields()
  queryCatalog()
}

const handleAdd = () => {
  title.value = '新增分类'
  dialogVisible.value = true
  console.log('selectedNode', selectedNode.value);
  formKey.value = Math.random()
}


const handleClose = () => {
  selectedId.value = null
  dialogVisible.value = false
  queryCatalog()
}

const handleEdit = (row) => {
  title.value = '编辑分类'
  dialogVisible.value = true
  selectedId.value = row.id
  formKey.value = Math.random()
}

const handleCopy = (row) => {
  copyDialogVisible.value = true
  queryCatalog()
}

const handleNodeClick = (node) => {
  searchParam.value.shopId = node.id
  selectedNode.value = node
  queryCatalog()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    catalogApi.delete(row.id).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success(res.message)
      query()
    })
  })
}

const handleSizeChange = (size) => {
  page.value.size = size
  queryCatalog()
}

const handleCopySubmit = () => { 
  const storeRows = storeTreeRef.value.getCheckedNodes()
  if (!storeRows.length) {
    ElMessage.error('请选择要复制的店铺')
    return
  }
  const catalogRows = catalogTreeRef.value.getCheckedNodes()
  if (!catalogRows.length) {
    ElMessage.error('请选择要复制的分类')
    return
  }
  const menuCatalogIds = catalogRows.map(item => item.id)
  const shopIds = storeRows.map(item => item.id)
  catalogApi.copy2shop({
    shopIds,
    menuCatalogIds
  }).then(res => { 
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    copyDialogVisible.value = false
    queryCatalog()
  })
}
</script>

<style scoped lang="scss">
.contianer {
  display: flex;
  width: 100%;
  // height: 100vh;

  .left {
    width: 240px;
    height: 100%;
    overflow: auto;
    // background-color: #f5f5f5;
  }

  .title {
    padding: 10px;
    font-size: 16px;
    // font-weight: bold;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    text-align: center;
  }

  .el-tree {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  .right {
    flex: 1;
    width: calc(100% - 280px);

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
      margin-bottom: 30px;
    }
  }

  .copy-tree{
    display: flex;
    align-items: center;
    .tree{
      height: 300px;
      overflow-y: auto;
      border: 1px solid #eee;
    }

    .tree-title{
      padding: 10px;
      font-size: 16px;
      margin-bottom: 10px;
      text-align: center;
    }

    .left-tree{
      width: 240px;
    }

    .right-tree{
      flex: 1;
    }
  }
}
</style>