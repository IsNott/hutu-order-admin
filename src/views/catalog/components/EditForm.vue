<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="600px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="100px">
      <el-form-item label="所属门店" prop="shopId" >
         <el-select v-model="editForm.shopId" placeholder="请选择所属门店" :disabled="props.rowId != null">
          <el-option v-for="item in stores" :key="item.id" :label="item.shopName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="showIndex">
        <el-input v-model="editForm.showIndex" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="点单页显示" prop="showSide">
        <el-switch v-model="editForm.showSide" active-text="显示" inactive-text="隐藏" :inactive-value="0" :active-value="1" ></el-switch>
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
import { catalogApi } from '../api'
import { storeApi } from '@/views/store/api'
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
const stores = ref([])

const empty = {
  id: null,
  showIndex: null,
  showSide: null,
  shopId: null
}
const editForm = ref(empty)
const editFormRef = ref(null)

const rules = {
  shopId: [
    { required: true, message: '请输入所属门店', trigger: 'blur' }
  ],
  showIndex: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  showSide: [
    { required: true, message: '请输入点单页显示', trigger: 'blur' }
  ]
}

const weekOptions = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 7 }
]

watch(() => props.dialogVisible, (val) => {
  if (val) {
    editForm.value = { ...empty }
    if (props.rowId) {
      catalogApi.details(props.rowId).then(res => {
        if (res.code !== 200) {
          ElMessage.error(res.message)
          return
        }
        editForm.value = res.data
      })
    }
  }
})

onMounted(() => {
  storeApi.quertStroePage({}, 1, 100).then(res => {
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    stores.value = res.data.records
  })
})

const submitEdit = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }
    const apiCall = editForm.value.id ? storeApi.update : storeApi.add
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