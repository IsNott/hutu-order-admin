<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="600px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="100px">
      <el-form-item label="店名" prop="shopName">
        <el-input v-model="editForm.shopName" placeholder="请输入店名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="editForm.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="经纬度">
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label-width="0px" label="" prop="longitude">
              <el-input v-model.number="editForm.longitude" placeholder="请输入经度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="0px" label="" prop="latitude">
              <el-input v-model.number="editForm.latitude" placeholder="请输入纬度" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="店休" prop="closeNow">
        <el-switch v-model="editForm.closeNow" :active-value="1" :inactive-value="0" active-text="是"
          inactive-text="否" />
      </el-form-item>
      <el-form-item label="是否总店" prop="mainShop">
        <el-switch v-model="editForm.mainShop" :active-value="1" :inactive-value="0" active-text="是"
          inactive-text="否" />
      </el-form-item>
      <el-form-item label="营业时间" required>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label-width="0px" label="" prop="startBusinessTime">
              <el-time-picker v-model="editForm.startBusinessTime" placeholder="请选择开始营业时间" value-format="HH:mm"
                :disabled-seconds="() => [1, 60]" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="0px" label="" prop="endBusinessTime">
              <el-time-picker v-model="editForm.endBusinessTime" placeholder="请选择结束营业时间" value-format="HH:mm"
                :disabled-seconds="() => [1, 60]" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="营业日期" required>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label-width="0px" label="" prop="weekStartDate">
              <el-select v-model="editForm.weekStartDate" placeholder="请选择每周营业开始日" style="width: 100%">
                <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="0px" label="" prop="weekEndDate">
              <el-select v-model="editForm.weekEndDate" placeholder="请选择每周营业结束日" style="width: 100%">
                <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
import { ref, defineEmits, defineProps, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { storeApi } from '../api'

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
const empty = {
  id: null,
  shopName: null,
  address: null,
  longitude: null,
  latitude: null,
  closeNow: 0,
  mainShop: 0,
  startBusinessTime: null,
  endBusinessTime: null,
  weekStartDate: null,
  weekEndDate: null
}
const editForm = ref(empty)
const editFormRef = ref(null)

const rules = {
  shopName: [
    { required: true, message: '请输入店名', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  startBusinessTime: [
    { required: true, message: '请选择开始营业时间', trigger: 'change' }
  ],
  endBusinessTime: [
    { required: true, message: '请选择结束营业时间', trigger: 'change' }
  ],
  weekStartDate: [
    { required: true, message: '请选择开始营业日期', trigger: 'change' }
  ],
  weekEndDate: [
    { required: true, message: '请选择结束营业日期', trigger: 'change' }
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
      storeApi.details(props.rowId).then(res => {
        if (res.code !== 200) {
          ElMessage.error(res.message)
          return
        }
        editForm.value = res.data
      })
    }
  }
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

<style scoped lang="scss">
::v-deep(.el-dialog__footer) {
    text-align: center;
}
</style>