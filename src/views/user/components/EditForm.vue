<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="600px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="100px">
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="editForm.realName" :placeholder="'请输入姓名'" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" :placeholder="'请输入用户名'" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="editForm.password" type="password" :placeholder="'请输入密码'" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="editForm.phone" :placeholder="'请输入联系电话'" />
      </el-form-item>
      <el-form-item label="是否冻结" prop="isLock">
        <!-- <el-input v-model="editForm.isLock" :placeholder="'请输入是否冻结'" /> -->
        <el-switch v-model="editForm.isLock" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="头像" required>
        <!-- <el-input v-model="editForm.avatarUrl" :placeholder="'请输入头像'" /> -->
        <Uploader
          ref="uploaderRef"
          :accept="'image/jpeg, image/png'"
          :data="editForm.avatarUrl"
          :multiple="false"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '../api'
import Uploader from '@/components/Uploader.vue'
const props = defineProps({
  title: {
    type: String,
    default: '操作'
  },
  rowId: {
    type: Number,
    required: false,
  },
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update:dialogVisible'])
const empty = {}
const editForm = ref(empty)
const editFormRef = ref(null)
const uploaderRef = ref(null)
const rules = {
  realName: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    // { pattern: /^1[3456789]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  avatarUrl: [
    { required: true, message: '请上传头像', trigger: 'blur' }
  ],
  isLock: [
    { required: false, message: '请输入是否冻结', trigger: 'blur' }
  ],
}

onMounted(async () => {
  if (props.rowId) {
    userApi.details(props.rowId).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      editForm.value = res.data
    })
  }
})

const submitEdit = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }
    editForm.value.avatarUrl = uploaderRef.value.fileList[0].url
    if(!editForm.value.avatarUrl){
      ElMessage.error('请上传头像')
      return
    }
    const apiCall = editForm.value.id ? userApi.update : userApi.add
    const res = await apiCall(editForm.value)
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    handleClose()
  })
}

const handleClose = () => {
  emit('update:dialogVisible', false)
  emit('close')
  editForm.value = { ...empty }
  editFormRef.value?.resetFields()
  editFormRef.value?.clearValidate()
}
</script>

<style scoped lang="scss">
::v-deep(.el-dialog__footer) {
  text-align: center;
}
</style>