<template>
  <el-dialog title="设置用户" width="800px" v-model="settingUserVisiable" :before-close="handleUserDialogClose">
    <el-table ref="userTableRef" :data="userList" style="width: 100%" border v-loading="userTableLoading"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="checkSelectable" width="50" align="center" />
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
</template>

<script setup>
import { userApi } from '../../user/api'
import { userRoleApi } from '../../user-role/api'
const userList = ref([])
const userTableRef = ref(null)
const currentRole = ref(null)
const selectedUser = ref([])
</script>

<style></style>