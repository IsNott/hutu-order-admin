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
                <el-input clearable v-model="searchParam.name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间">
                <el-date-picker v-model="searchParam.createTime" placeholder="请输入创建时间" type="date" style="width: 100%"
                  value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select clearable v-model="searchParam.delFlag" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="失效" value="1"></el-option>
                  <el-option label="正常" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary">新增</el-button>
                <el-button type="primary" @click="querysku">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="list">
        <el-table :data="skuList" border style="width: 100%" v-loading="loading">
          <template #empty>
            <img src="@/assets/img/empty.png" />
            <p style="margin-top: 10px; font-size: 20px">Nothing to load....</p>
          </template>
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column prop="shopName" label="所属门店" align="center">
          </el-table-column>
          <el-table-column prop="name" label="分类名称" width="120" align="center">
          </el-table-column>
          <el-table-column prop="index" label="排序" width="80" align="center">
          </el-table-column>
          <el-table-column prop="description" show-overflow-tooltip label="描述"  align="center">
          </el-table-column>
          <el-table-column prop="delFlag" label="状态" align="center" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.delFlag === 1" type="info">失效</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑子项</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination v-model:current-page="page.page" v-model:page-size="page.size" :page-sizes="[20, 50, 100, 200]"
        background layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
        @current-change="querysku" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeApi } from '@/views/store/api'
import { skuApi } from './api'
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
const skuList = ref([])
const page = ref(emptyPage)
const loading = ref(false)
const queryForm = ref(null)
const selectedNode = ref(null)
// Computed
const treeData = computed(() => {
  let treeData = []
  for (let i = 0; i < stores.value.length; i++) {
    const val = stores.value[i]
    if (!val) return
    treeData.push({
      label: val.name,
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
  querysku()
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
const querysku = () => {
  loading.value = true
  skuApi.queryPage(searchParam.value, page.value.page, page.value.size).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    skuList.value = res.data.records
    page.value.total = res.data.total
    page.value.size = res.data.size
  }).finally(() => {
    loading.value = false
  })
}

const reset = () => {
  searchParam.value = {}
  queryForm.value.resetFields()
  querysku()
}

const update = (row) => {
  skuApi.update(row.id, row).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    querysku()
  })
}


const handleNodeClick = (node) => {
  searchParam.value.shopId = node.id
  querysku()
}

const handleSizeChange = (size) => {
  page.value.size = size
  querysku()
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