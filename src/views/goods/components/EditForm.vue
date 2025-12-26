<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="600px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="120px">
      <el-form-item label="封面" required>
         <uploader
          ref="uploaderRef"
          :type="'img'"
          :accept="'image/jpeg, image/png'"
          :drag="true"
          :multiple="false"
          :tip="'文件最大1MB, 仅支持jpg、png格式'"
          :data="editForm.coverUrl"
        ></uploader>
      </el-form-item>
      <el-form-item label="商品名称" prop="itemName">
        <el-input v-model="editForm.itemName" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="单价" prop="itemPrice">
        <el-input v-model.number="editForm.itemPrice" placeholder="请输入单价" >
          <template #append>
            元
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="预计制作时长" prop="expectMakeTime">
        <el-input v-model.number="editForm.expectMakeTime" placeholder="请输入预计制作时长" prefix="el-icon-time" >
          <template #append>
            分
          </template>
          </el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="itemDescription">
        <el-input type="textarea" v-model="editForm.itemDescription" placeholder="请输入商品描述" />
      </el-form-item>
      <el-form-item label="轮播图" required> 
        <uploader
          ref="imageRef"
          :type="'img'"
          :accept="'image/jpeg, image/png'"
          :drag="true"
          :tip="'文件最大1MB, 仅支持jpg、png格式'"
          :file-limit="9"
          :data="editForm.images"
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
import { itemApi } from '../api'
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
  },
  selectedStoreId: {
    type: String,
    required: false,
  }
})

const emit = defineEmits(['close', 'update:dialogVisible'])
const stores = ref([])
const editForm = ref({})
const editFormRef = ref(null)
const uploaderRef = ref(null)
const imageRef = ref(null)
const rules = {
  itemName: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  itemPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' }
  ],
  expectMakeTime: [
    { required: true, message: '请输入预计制作时长', trigger: 'blur' }
  ]
}


onMounted(() => {
  if (props.rowId) {
    itemApi.details(props.rowId).then(res => {
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
    editForm.value.coverUrl = uploaderRef.value.fileList[0].url
    if(!editForm.value.coverUrl){
      ElMessage.error('请上传封面')
      return
    }
    editForm.value.images = imageRef.value.getFileRequest()
    if(!editForm.value.images || editForm.value.images.length === 0){
      ElMessage.error('请上传轮播图')
      return
    }
    const apiCall = editForm.value.id ? itemApi.update : itemApi.add
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
  editForm.value = {}
  editFormRef.value?.resetFields()
  editFormRef.value?.clearValidate()
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__footer) {
    text-align: center important;
}

</style>