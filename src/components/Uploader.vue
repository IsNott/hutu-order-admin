<template>
  <el-upload 
    v-if="fileList.length < props.fileLimit"
    class="uploader" 
    :file-list="fileList" 
    :action="action"
    :accept="props.accept" 
    :drag="props.drag" 
    :multiple="props.multiple"
    :list-type="props.type === 'img' ? 'picture-card' : 'text'" 
    :on-success="handleSuccess"
    :before-upload="beforeUpload" 
    :on-preview="props.type === 'img' ? handlePictureCardPreview : ''"
    :on-remove="handleRemove" 
    :headers="headers"
    :limit="props.fileLimit"
  >
    <el-icon class="uploader-icon" v-if="props.type === 'img'">
      <Plus />
    </el-icon>
    <template v-else-if="props.type !== 'img'">
      <el-button>点击上传</el-button>
    </template>
    <template #tip>
      <div class="el-upload__tip">
        {{ props.tip }}
      </div>
    </template>
  </el-upload>
  
  <div v-else class="file-list-container">
    <div v-for="file in fileList" :key="file.uid" class="file-item">
      <div v-if="props.type === 'img'" class="image-container">
        <img 
          :src="file.url" 
          :alt="file.name" 
          class="preview-image"
          @click="handlePictureCardPreview(file)"
        />
        <div class="remove-btn" @click="removeFile(file)">
          <el-icon><Close /></el-icon>
        </div>
      </div>
      <div v-else class="file-container">
        <span>{{ file.name }}</span>
        <el-icon class="remove-icon" @click="removeFile(file)">
          <Close />
        </el-icon>
      </div>
    </div>
  </div>
  
  <el-dialog v-model="dialogVisible">
     <el-image
        ref="imageRef"
        :src="dialogImageUrl"
        show-progress
        fit="Preview Image"
      />
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, computed, watch, defineExpose } from 'vue'
import { getToken } from '@/utils/auth'
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const action = import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_UPLOAD_URL + '/oss/upload'
const headers = computed(() => {
  return {
    Token: getToken()
  }
})

const props = defineProps({
  tip: {
    type: String,
    default: '文件最大1MB'
  },
  type: {
    type: String,
    default: 'img'
  },
  accept: {
    type: String,
    default: 'image/jpeg, image/png'
  },
  drag: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  fileLimit: {
    type: Number,
    default: 1
  },
  size: {
    type: Number,
    default: 1
  }
})

const fileList = ref([])

const getFileRequest = () => {
  if(!fileList.value){
    return
  }
  return fileList.value.map(item => item.response)
}

defineExpose({
  fileList,getFileRequest
})



watch(() => props.data, (newValue) => {
  if (newValue) {
    if (Array.isArray(newValue)) {
      fileList.value = newValue.map(item => {
        return {
          url: item.url,
          name: item.fileName,
          uid: item.id,
          status: 'success',
          response: item
        }
      })
    } else if (typeof newValue === 'string') {
      fileList.value = [{
        url: newValue,
        name: '文件',
        uid: '1',
        status: 'success',
        response: newValue
      }]
    }
  }
})

const handleSuccess = (resp, uploadFile) => {
  if (resp.code === 200) {
    fileList.value.push({
      url: resp.data.url,
      name: resp.data.fileName,
      uid: resp.data.id,
      status: 'success', 
      response:resp.data
    })
  }
}

const beforeUpload = (rawFile) => {
  // 文件校验逻辑
  if(rawFile.size > props.size * 1024 * 1024){
    this.$message.error('文件大小不能超过' + props.size + 'MB')
    return false
  }
  return true
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 新增：手动删除文件的方法
const removeFile = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index !== -1) {
    fileList.value.splice(index, 1)
  }
}

// 修改：保留原有的handleRemove用于上传组件内部的删除
const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

</script>

<style scoped>
.uploader .img {
  width: 178px;
  height: 178px;
  display: block;
}

/* 文件列表容器样式 */
.file-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 图片容器样式 */
.image-container {
  position: relative;
  width: 178px;
  height: 178px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
}

.remove-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

/* 普通文件容器样式 */
.file-container {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.remove-icon {
  margin-left: 10px;
  cursor: pointer;
  color: #f56c6c;
}

.remove-icon:hover {
  color: #f78989;
}
</style>

