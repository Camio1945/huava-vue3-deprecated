<template>
  <div class="app-container">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          :type="oldPasswordVisible ? 'text' : 'password'"
          class="ls-input"
          v-model="formData.oldPassword"
          placeholder="请输入旧密码"
          maxlength="20"
        >
          <template #suffix>
            <span @click="oldPasswordVisible = !oldPasswordVisible" style="cursor: pointer">
              <el-icon v-if="oldPasswordVisible"><View /></el-icon>
              <el-icon v-else><Hide /></el-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          :type="newPasswordVisible ? 'text' : 'password'"
          class="ls-input"
          v-model="formData.newPassword"
          placeholder="请输入新密码"
          maxlength="20"
        >
          <template #suffix>
            <span @click="newPasswordVisible = !newPasswordVisible" style="cursor: pointer">
              <el-icon v-if="newPasswordVisible"><View /></el-icon>
              <el-icon v-else><Hide /></el-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>
      <div class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="handleSubmit"> 确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { Hide, View } from "@element-plus/icons-vue"
import { reactive, shallowRef, ref } from "vue"
import { Arrayable } from "element-plus/lib/utils"
import { ElMessage, type FormInstance, FormItemRule } from "element-plus"
import { updatePassword, type UpdatePasswordData } from "@/api/sys/user"

const formRef = shallowRef<FormInstance>()
const oldPasswordVisible = ref<boolean>(false)
const newPasswordVisible = ref<boolean>(false)

const formData: UpdatePasswordData = reactive({
  oldPassword: "",
  newPassword: ""
})

const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: ["blur", "change"] }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: ["blur", "change"] },
    {
      min: 8,
      max: 20,
      message: "密码长度应该为 8 ~ 20 个字符",
      trigger: ["blur", "change"]
    }
  ]
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  await updatePassword(formData)
  ElMessage.success("操作成功")
  popupRef.value?.close()
  emit("success")
}
</script>
