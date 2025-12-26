<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="600px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="100px">
      <el-form-item label="商品ID" prop="itemId">
        <el-input v-model="editForm.itemId" :placeholder="'请输入商品ID'" />
      </el-form-item>
      <el-form-item label="规格名称" prop="specLabel">
        <el-input v-model="editForm.specLabel" :placeholder="'请输入规格名称'" />
      </el-form-item>
      <el-form-item label="是否多选（0:单选，1:多选）" prop="multi">
        <el-input v-model="editForm.multi" :placeholder="'请输入是否多选（0:单选，1:多选）'" />
      </el-form-item>
      <el-form-item label="排序" prop="sortOrder">
        <el-input v-model="editForm.sortOrder" :placeholder="'请输入排序'" />
      </el-form-item>
      <el-form-item label="是否必选" prop="required">
        <el-input v-model="editForm.required" :placeholder="'请输入是否必选'" />
      </el-form-item>
      <el-form-item label="删除标识" prop="delFlag">
        <el-input v-model="editForm.delFlag" :placeholder="'请输入删除标识'" />
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
import { itemSkuSpecApi } from '../api'

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

const rules = {
  itemId: [
    { required: true, message: '请输入商品ID', trigger: 'blur' }
  ],
  specLabel: [
    { required: true, message: '请输入规格名称', trigger: 'blur' }
  ],
  multi: [
    { required: true, message: '请输入是否多选（0:单选，1:多选）', trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  required: [
    { required: true, message: '请输入是否必选', trigger: 'blur' }
  ],
  delFlag: [
    { required: true, message: '请输入删除标识', trigger: 'blur' }
  ],
}

onMounted(async () => {
  if (props.rowId) {
    itemSkuSpecApi.details(props.rowId).then(res => {
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
    const apiCall = editForm.value.id ? itemSkuSpecApi.update : itemSkuSpecApi.add
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