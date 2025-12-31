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
              <el-form-item label="用户名称">
                <el-input clearable v-model="searchParam.userName" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select v-model="searchParam.orderStatus" placeholder="请选择订单状态">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间">
                <el-date-picker v-model="searchParam.createTime" placeholder="请输入创建时间" type="date" style="width: 100%"
                  value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" @click="queryorder">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="list">
        <el-table :data="orderList" border style="width: 100%" v-loading="loading">
          <template #empty>
            <img src="@/assets/img/empty.png" />
            <p style="margin-top: 10px; font-size: 20px">Nothing to load....</p>
          </template>
          <el-table-column prop="id" label="订单id" width="180" align="center">
          </el-table-column>
          <el-table-column prop="shopName" label="门店名称" width="130" align="center">
          </el-table-column>
          <el-table-column prop="userId" label="用户id" width="180" align="center">
          </el-table-column>
          <el-table-column prop="userName" label="用户名称" width="100" align="center">
          </el-table-column>
          <el-table-column prop="shopOrderNo" label="订单叫号" width="120" align="center">
          </el-table-column>
          <el-table-column prop="payTime" label="支付时间" width="120" align="center">
          </el-table-column>
          <el-table-column prop="totalAmount" label="订单金额" width="100" align="center">
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" width="100" align="center">
            <template #default="scope">
              <span>{{ getStatusStr(scope.row.orderStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payType" label="支付方式" width="100" align="center">
          </el-table-column>
          <el-table-column prop="payCode" label="支付渠道码" width="100" align="center">
          </el-table-column>
          <el-table-column label="就餐类型" width="100" align="center">
            <template #default="scope">
              <span v-if="scope.row.pickupType == 0">堂食</span>
              <span v-if="scope.row.pickupType == 1">自取</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination v-model:current-page="page.page" v-model:page-size="page.size" :page-sizes="[20, 50, 100, 200]"
        background layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
        @current-change="queryorder" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeApi } from '@/views/store/api'
import { orderApi } from './api'
// Data
const statusOptions = [
  { label: '待支付', value: 0 },
  { label: '支付中', value: 1 },
  { label: '已支付', value: 2 },
  { label: '失败', value: 3 },
  { label: '已过期', value: 4 },
  { label: '已退款', value: 5 },
  { label: '已完成', value: 6 },
]

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
const orderList = ref([])
const page = ref(emptyPage)
const loading = ref(false)
const queryForm = ref(null)
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
  queryorder()
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
},
  queryorder = () => {
    loading.value = true
    orderApi.query(searchParam.value, page.value.page, page.value.size).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      orderList.value = res.data.records
      page.value.total = res.data.total
      page.value.size = res.data.size
    }).finally(() => {
      loading.value = false
    })
  }

const reset = () => {
  searchParam.value = {}
  queryForm.value.resetFields()
  queryorder()
}

const getStatusStr = (val) => {
  switch (val) {
    default:
      ''
    case 0:
      return '待支付'
    case 1:
      return '支付中'
    case 2:
      return '已支付'
    case 3:
      return '失败'
    case 4:
      return '已过期'
    case 5:
      return '已退款'
    case 6:
      return '已完成'
  }
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
  orderApi.update(row.id, row).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    queryorder()
  })
}


const handleNodeClick = (node) => {
  searchParam.value.shopId = node.id
  queryorder()
}

const handleSizeChange = (size) => {
  page.value.size = size
  queryorder()
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