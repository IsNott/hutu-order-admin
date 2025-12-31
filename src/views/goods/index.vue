<template>
  <div class="contianer">
    <!-- <div class="left">
      <div class="title">
        门店分类树
      </div>
      <el-tree :data="shopCatalogTree" node-key="index" v-loading="tLoading" :props="defaultProps"
        @node-click="handleNodeClick" />
    </div>
    <div class="right"> -->
    <div class="query-form">
      <el-form ref="queryForm" :model="searchParam" label-width="80px">
        <el-row gutter="10">
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input clearable v-model="searchParam.itemName" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="描述">
              <el-input clearable v-model="searchParam.itemDescription" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleAdd">新增</el-button>
              <el-button type="primary" @click="queryItem">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="itemList" border style="width: 100%" v-loading="loading">
        <template #empty>
          <img src="@/assets/img/empty.png" />
          <p style="margin-top: 10px; font-size: 20px">Nothing to load....</p>
        </template>
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="封面" width="120" align="center">
          <template #default="scope">
            <img :src="scope.row.coverUrl" style="width: 64px; height: 64px" />
          </template>
        </el-table-column>
        <el-table-column prop="itemName" label="名称" width="120" align="center">
        </el-table-column>
        <el-table-column label="单价" width="120" align="center">
          <template #default="scope">
            <span v-if="scope.row.itemPrice">{{ scope.row.itemPrice }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="预计制作时长" width="120" align="center">
          <template #default="scope" >
            <span v-if="scope.row.expectMakeTime">{{ scope.row.expectMakeTime }} 分钟</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemDescription" label="描述"  show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-model:current-page="page.page" v-model:page-size="page.size" :page-sizes="[20, 50, 100, 200]"
      background layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
      @current-change="queryItem" />
      <EditForm :key="formKey" @close="handleClose" :title="title" :row-id="selectedId" :dialogVisible="dialogVisible" />
    <!-- </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { itemApi } from './api'
import EditForm from './components/EditForm.vue'
// Data
const defaultProps = {
  children: 'children',
  label: 'label',
}
const stores = ref([])
const emptySearchParam = {}
const emptyPage = {
  page: 1,
  size: 10,
  total: 0
}
const tLoading = ref(false)
const searchParam = ref({})
const itemList = ref([])
const page = ref(emptyPage)
const loading = ref(false)
const queryForm = ref(null)
const shopCatalogTree = ref([])

const title = ref('新增商品')
const dialogVisible = ref(false)
const selectedId = ref(null)
const formKey = ref(0)

// Computed
// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  // quertTree()
  queryItem()
})

// Watchers

// Methods
const quertTree = () => {
  tLoading.value = true
  itemApi.shopCatalogTree(0).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    let treeData = []
    const data = res.data
    data.forEach(item => {
      let node = {
        label: item.shopName,
        id: item.id,
        index: item.index,
        type: item.type,
      }
      if (item.children) {
        node.children = item.children.map(item => {
          return {
            label: item.name,
            id: item.id,
            index: item.index,
            type: item.type,
            parentId: item.parentId
          }
        })
      }
      treeData.push(node)
    })
    shopCatalogTree.value = treeData
  }).finally(() => {
    tLoading.value = false
  })
}


const queryItem = () => {
  loading.value = true
  itemApi.query(searchParam.value, page.value.page, page.value.size).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    itemList.value = res.data.records
    page.value.total = res.data.total
    page.value.size = res.data.size
  }).finally(() => {
    loading.value = false
  })
}

const reset = () => {
  searchParam.value = {}
  queryForm.value.resetFields()
  queryItem()
}

const handleAdd = () => {
  title.value = '新增商品'
  dialogVisible.value = true
  formKey.value = Math.random()
}

const handleClose = () => {
  selectedId.value = null
  dialogVisible.value = false
  queryItem()
}

const handleEdit = (row) => {
  title.value = '编辑商品'
  dialogVisible.value = true
  selectedId.value = row.id
  formKey.value = Math.random()
}

const switchShow = (row) => {
  if (row.showSide === 1) {
    row.showSide = 0
  } else {
    row.showSide = 1
  }
  update(row)
}

const update = (row) => {
  itemApi.update(row.id, row).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    queryItem()
  })
}


const handleNodeClick = (node) => {
  itemList.value = []
  if (node.type === 'shop') {
    searchParam.value.shopId = node.id
    if (node.children && node.children.length > 0) {
      searchParam.value.catalogId = node.children[0].id
    }
  } else {
    searchParam.value.shopId = node.parentId
    searchParam.value.catalogId = node.id
  }
  queryItem()
}

const handleSizeChange = (size) => {
  page.value.size = size
  queryItem()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    itemApi.delete(row.id).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success(res.message)
      queryItem()
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