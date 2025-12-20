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
            <el-col :span="6">
              <el-form-item label="名称">
                <el-input clearable v-model="searchParam.menuCatalogName" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间">
                <el-date-picker v-model="searchParam.createTime" placeholder="请输入创建时间" type="date" style="width: 100%"
                  value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="状态">
                <el-select clearable v-model="searchParam.delFlag" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="失效" value="1"></el-option>
                  <el-option label="正常" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button type="primary" @click="queryCatalog">查询</el-button>
                <el-button @click="reset">重置</el-button>
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
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="shopName" label="所属门店" align="center">
          </el-table-column>
          <el-table-column prop="menuCatalogName" label="名称" width="120" align="center">
          </el-table-column>
          <el-table-column prop="showIndex" label="排序" width="80" align="center">
          </el-table-column>
          <el-table-column prop="itemNum" label="关联商品" width="100" align="center">
          </el-table-column>
          <el-table-column label="点单页显示" width="240" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.showSide" active-text="显示" inactive-text="隐藏"
                @change="handleSwitch(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="delFlag" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.delFlag === 1" type="info">失效</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
          </el-table-column> -->
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
      <EditForm @close="handleClose" :title="title" :row-id="selectedId" :dialogVisible="dialogVisible" :select-store-id="selectedNode?.id" />
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
// Computed
const treeData = computed(() => {
  let treeData = []
  for (let i = 0; i < stores.value.length; i++) {
    const val = stores.value[i]
    if (!val) return
    treeData.push({
      label: val.shopName,
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
}


const handleClose = () => {
  dialogVisible.value = false
  query()
}

const handleEdit = (row) => {
  title.value = '编辑分类'
  dialogVisible.value = true
  selectedId.value = row.id
}

const handleNodeClick = (node) => {
  searchParam.value.shopId = node.id
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
}
</style>