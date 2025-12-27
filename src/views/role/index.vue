<template>
  <div class="contianer">
    <div class="query-form">
      <el-form ref="queryForm" :model="searchParam" label-width="80px">
        <el-row gutter="10">
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="searchParam.role" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
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
      <el-table :data="roleList" stripe style="width: 100%" border v-loading="loading">
        <template #empty>
          <img src="@/assets/img/empty.png" />
          <p style="font-size: 20px">Nothing to load....</p>
        </template>
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="role" label="角色名称" width="120" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" width="120" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleSettingUser(scope.row)">设置用户</el-button>
            <el-button type="primary" size="small" @click="handleSettingMenu(scope.row)">设置菜单</el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-model:current-page="page.page" v-model:page-size="page.size" :page-sizes="[20, 50, 100, 200]"
      background layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
      @current-change="query" />
    <EditForm :key="formKey" @close="handleClose" :title="title" :row-id="selectedId" :dialogVisible="dialogVisible" />
    <el-dialog title="设置用户" width="800px" v-model="settingUserVisiable" :before-close="handleUserDialogClose">
      <el-table ref="userTableRef" :data="userList" style="width: 100%" border v-loading="userTableLoading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="checkSelectable" width="50" align="center" />
        <el-table-column prop="realName" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120" align="center"></el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" @click="handleSettingUserConfirm">确定</el-button>
        <el-button @click="handleUserDialogClose">取消</el-button>
      </template>
      <el-pagination v-model:current-page="userPage.page" v-model:page-size="userPage.size"
        :page-sizes="[20, 50, 100, 200]" background layout="total, sizes, prev, pager, next" :total="userPage.total"
        @size-change="handleUserPageChange" @current-change="queryUser" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import EditForm from './components/EditForm.vue'
import { roleApi } from './api'
import { userApi } from '../user/api'
import { userRoleApi } from '../user-role/api'
// Data
const emptySearchParam = {}
const emptyPage = {
  page: 1,
  size: 10,
  total: 0
}
const searchParam = ref({})
const roleList = ref([])
const page = ref(emptyPage)
const userPage = ref({ ...emptyPage })
const loading = ref(false)
const userTableLoading = ref(false)
const queryForm = ref(null)
const title = ref('新增系统角色')
const dialogVisible = ref(false)
const selectedId = ref(null)
const formKey = ref(0)
const settingUserVisiable = ref(false)
const userList = ref([])
const userTableRef = ref(null)
const currentRole = ref(null)
const selectedUser = ref([])
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
  roleApi.queryPage(searchParam.value, page.value.page, page.value.size).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    roleList.value = res.data.records
    page.value.total = res.data.total
    page.value.size = res.data.size
  }).finally(() => {
    loading.value = false
  })
}

const handleAdd = () => {
  title.value = '新增系统角色'
  dialogVisible.value = true
  formKey.value = Math.random()
}


const handleSwitch = (row) => {
  roleApi.update(row.id, row).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    query()
  })
}

const checkSelectable = (row) => {
  return !row?.roles.find(role => role.id === currentRole.value?.id)
}

const handleSettingUser = (row) => {
  userTableLoading.value = true
  userApi.queryPage({}, 1, 10).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    userList.value = res.data.records
    userPage.value.total = res.data.total
    userPage.value.size = res.data.size
    settingUserVisiable.value = true
    currentRole.value = row
    nextTick(() => {
      userList.value.forEach(item => {
        if (item.roles.find(role => role.id === row.id)) {
          userTableRef.value.toggleRowSelection(item, true)
        }
      })
    })
  }).finally(
    userTableLoading.value = false
  )

}

const handleUserPageChange = () => {
  queryUser()
}

const queryUser = () => {
  userTableLoading.value = true
  userApi.queryPage({}, userPage.value.page, userPage.value.size).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    userPage.value.total = res.data.total
    userPage.value.size = res.data.size
    userList.value = res.data.records
    nextTick(() => {
      userList.value.forEach(item => {
        if (item.roles.find(role => role.id === currentRole.value.id)) {
          userTableRef.value.toggleRowSelection(item, true)
        }
      })
    })
  }).finally(
    userTableLoading.value = false
  )
}

const handleUserDialogClose = () => {
  userTableRef.value.clearSelection()
  currentRole.value = null
  userList.value = []
  settingUserVisiable.value = false
}

const handleSelectionChange = (selection) => {
  console.log(selection);
  selectedUser.value = selection
}

const handleSettingUserConfirm = async () => {
  try {
    const needToAddList = selectedUser.value.filter(user => !user?.roles.map(role=>role.id).includes(currentRole.value.id))
    if(!needToAddList || needToAddList.length == 0){
      handleUserDialogClose()
      return
    }
    await Promise.all(needToAddList.map(user => {
      return userRoleApi.add({
        roleId: currentRole.value.id,
        userId: user.id
      })
    })).then(res => {
      ElMessage.success('设置用户成功')
      handleUserDialogClose()
    })
  } catch (error) {
    console.error('设置用户失败:', error)
  }
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
  title.value = '编辑系统角色'
  dialogVisible.value = true
  selectedId.value = row.id
  formKey.value = Math.random()
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    roleApi.delete(row.id).then(res => {
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