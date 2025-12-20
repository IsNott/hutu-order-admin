<template>
  <div class="contianer">
    <div class="query-form">
      <el-form ref="queryForm" :model="searchParam" label-width="80px">
        <el-row gutter="10">
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input clearable v-model="searchParam.shopName" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地址">
              <el-input clearable v-model="searchParam.address" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker v-model="searchParam.createTime" placeholder="请输入创建时间" type="date" style="width: 100%"
                value-format="YYYY-MM-DD" />
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
              <el-button type="primary" @click="query">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="storeList" stripe style="width: 100%" border v-loading="loading">
        <template #empty>
          <img src="@/assets/img/empty.png" />
          <p style="font-size: 20px">Nothing to load....</p>
        </template>
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="shopName" label="店名" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="240" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="180" align="center">
        </el-table-column>
        <el-table-column label="是否总店" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.mainShop == 1" type="success">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="店休中" width="180" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.closeNow" :active-value="1" :inactive-value="0" active-text="是"
              inactive-text="否" @change="handleSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="营业日期" width="180" align="center">
          <template #default="scope">
            <span>{{ getWeekStr(scope.row.weekStartDate) }}至{{ getWeekStr(scope.row.weekEndDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营业时间" width="180" align="center">
          <template #default="scope">
            <el-tag>{{ scope.row.startBusinessTime }} - {{ scope.row.endBusinessTime }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" width="180" align="center">
        </el-table-column> -->
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
      @current-change="query" />
    <EditForm @close="handleClose" :title="title" :row-id="selectedId" :dialogVisible="dialogVisible" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import EditForm from './components/EditForm.vue'
import { storeApi } from './api'
import { getWeekStr } from '@/utils'
// Data
const emptySearchParam = {}
const emptyPage = {
  page: 1,
  size: 10,
  total: 0
}
const searchParam = ref({})
const storeList = ref([])
const page = ref(emptyPage)
const loading = ref(false)
const queryForm = ref(null)
const title = ref('新增门店')
const dialogVisible = ref(false)
const selectedId = ref(null)
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
  storeApi.quertStroePage(searchParam.value, page.value.page, page.value.size).then(res => {
    console.log(res);
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    storeList.value = res.data.records
    page.value.total = res.data.total
    page.value.size = res.data.size
  }).finally(() => {
    loading.value = false
  })
}

const handleAdd = () => {
  title.value = '新增门店'
  dialogVisible.value = true
}


const handleSwitch = (row) => {
  storeApi.update(row.id, row).then(res => {
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
  query()
}
const handleEdit = (row) => {
  title.value = '编辑门店'
  dialogVisible.value = true
  selectedId.value = row.id
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    storeApi.delete(row.id).then(res => {
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