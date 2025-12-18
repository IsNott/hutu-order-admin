<template>
  <div class="contianer">
    <div class="left">
      <div class="title">
        门店分类树
      </div>
      <el-tree :data="shopCatalogTree" node-key="index" v-loading="tLoading" :props="defaultProps"
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
                  <el-option label="已删除" value="1"></el-option>
                  <el-option label="正常" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" @click="queryCatalog">查询</el-button>
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
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column prop="shopName" label="所属门店" align="center">
          </el-table-column>
          <el-table-column label="封面" width="120" align="center">
            <template #default="scope">
              <img :src="scope.row.cover" style="width: 64px; height: 64px" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" width="120" align="center">
          </el-table-column>
          <el-table-column prop="price" label="单价" width="120" align="center">
          </el-table-column>
          <el-table-column prop="index" label="排序" width="80" align="center">
          </el-table-column>
          <el-table-column prop="description" label="描述" width="160" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="delFlag" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.delFlag === 1" type="danger">已删除</el-tag>
              <el-tag v-else>正常</el-tag>
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
        @current-change="queryItem" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { itemApi } from './api'
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
// Computed
// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  quertTree()
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
      overflow-y: scroll;
      height: calc(100vh - 300px);
      margin-bottom: 30px;
    }
  }
}
</style>