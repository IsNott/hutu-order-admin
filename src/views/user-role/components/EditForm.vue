<template>
    <el-dialog :title="title" :model-value="dialogVisible" width="600px" :before-close="handleClose">
        <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="100px">
                                <el-form-item label="系统用户id" prop="userId">
                        <el-input v-model="editForm.userId" :placeholder="'请输入系统用户id'" />
                    </el-form-item>
                    <el-form-item label="角色id" prop="roleId">
                        <el-input v-model="editForm.roleId" :placeholder="'请输入角色id'" />
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
    import { userRoleApi } from '../api'

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
        userId: [
            { required: true, message: '请输入系统用户id', trigger: 'blur' }
        ],
        roleId: [
            { required: true, message: '请输入角色id', trigger: 'blur' }
        ],
    }

    onMounted(async () => {
        if (props.rowId) {
            userRoleApi.details(props.rowId).then(res => {
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
            const apiCall = editForm.value.id ? userRoleApi.update : userRoleApi.add
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