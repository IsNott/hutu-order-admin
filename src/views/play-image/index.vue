<template>
  <div class="contianer">
    <div class="query-form">
      <el-form ref="queryForm" :model="searchParam" label-width="80px">
        <el-row gutter="10">
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select clearable v-model="searchParam.type" placeholder="请选择">
                <el-option label="门店" value="0"></el-option>
                <el-option label="首页活动" value="1"></el-option>
                <el-option label="我的" value="2"></el-option>
              </el-select>
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
              <el-button type="primary" @click="query">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="imgList" stripe style="width: 100%" border v-loading="loading">
        <template #empty>
          <img src="@/assets/img/empty.png" />
          <p style="font-size: 20px">Nothing to load....</p>
        </template>
        <el-table-column type="index" width="50" align="center"/>
        <el-table-column label="图片" width="120"  align="center">
          <template #default="scope">
            <img :src="scope.row.url" style="width: 64px; height: 64px;" />
          </template>
        </el-table-column>
        <el-table-column label="类型" width="180" align="center">
          <template #default="scope">
            <span v-if="scope.row.type == 0">门店</span>
            <span v-if="scope.row.type == 1">首页活动</span>
            <span v-if="scope.row.type == 2">我的</span>
          </template>
        </el-table-column>
        <el-table-column prop="index" label="排序" width="180" align="center">
        </el-table-column>
        <el-table-column prop="navigation" show-overflow-tooltip label="跳转路径"  align="center">
        </el-table-column>
        <el-table-column prop="delFlag" label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.delFlag === 1" type="info">失效</el-tag>
              <el-tag v-else>正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { imageApi } from './api'
// Data
const emptySearchParam = {}
const emptyPage = {
  page: 1,
  size: 10,
  total: 0
}
const searchParam = ref({})
const imgList = ref([])
const page = ref(emptyPage)
const loading = ref(false)
const queryForm = ref(null)
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
  imageApi.queryPage(searchParam.value, page.value.page, page.value.size).then(res => {
    console.log(res);
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    imgList.value = res.data.records
    page.value.total = res.data.total
    page.value.size = res.data.size
  }).finally(() => {
    loading.value = false
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
const handleEdit = (row) => {

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