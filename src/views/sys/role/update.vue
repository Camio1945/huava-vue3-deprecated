<template>
  <div class="edit-popup">
    <popup
      ref="popupRef"
      :title="popupTitle"
      :async="true"
      width="550px"
      @confirm="handleSubmit"
      @close="handleClose"
    >
      <el-form
        class="ls-form"
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-width="60px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            class="ls-input"
            v-model="formData.name"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
// import { roleAdd, roleDetail, roleEdit } from '@/api/perms/role'
import Popup from "@/components/Popup/index.vue";
import { type FormInstance, ElMessage } from "element-plus";
import { computed, reactive, ref, shallowRef } from "vue";

const emit = defineEmits(["success", "close"]);
const formRef = shallowRef<FormInstance>();
const popupRef = shallowRef<InstanceType<typeof Popup>>();
const mode = ref("add");
const popupTitle = computed(() => {
  return mode.value == "edit" ? "编辑角色" : "新增角色";
});
const formData = reactive({
  id: "",
  name: "",
  remark: "",
  sort: 0,
  isDisable: 0,
  menus: [],
});

const rules = {
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: ["blur"],
    },
  ],
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  const params = { ...formData, menuIds: formData.menus.join() };
  mode.value == "edit" ? await roleEdit(params) : await roleAdd(params);
  popupRef.value?.close();
  ElMessage.success("操作成功");
  emit("success");
};

const handleClose = () => {
  emit("close");
};

const open = (type = "add") => {
  mode.value = type;
  popupRef.value?.open();
};

const setFormData = async (row: Record<any, any>) => {
  const data = await roleDetail({
    id: row.id,
  });
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key];
    }
  }
};

defineExpose({
  open,
  setFormData,
});
</script>
