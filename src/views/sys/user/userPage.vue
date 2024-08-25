<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username">
          <el-input v-model="searchData.username" placeholder="用户名" title="用户名" />
        </el-form-item>
        <el-form-item prop="realName" label="">
          <el-input v-model="searchData.realName" placeholder="姓名" title="姓名" />
        </el-form-item>
        <el-form-item prop="phoneNumber" label="">
          <el-input v-model="searchData.phoneNumber" placeholder="手机号" title="手机号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleCreate">新增用户</el-button>
          <el-button type="danger" :icon="Delete" v-if="false">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="realName" label="姓名" align="center" />
          <el-table-column prop="phoneNumber" label="手机号" align="center" />
          <el-table-column prop="isEnabled" label="是否启用" align="center">
            <template #default="scope">
              {{ scope.row.isEnabled ? "启用" : "禁用" }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)" v-if="scope.row.id != 1">
                修改
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)" v-if="scope.row.id != 1">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <UserForm v-if="isFormVisible" ref="formRef" @success="getTableData" @close="isFormVisible = false" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, shallowRef, watch } from "vue"
import { del, page, type User } from "@/api/sys/user"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import UserForm from "./components/UserForm.vue"

const formRef = shallowRef<InstanceType<typeof UserForm>>()
const isFormVisible = ref<boolean>(false)

defineOptions({
  // 命名当前组件
  username: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 删
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`正在删除用户：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    del(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 查
const tableData = ref<User[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  realName: "",
  phoneNumber: ""
})
const getTableData = () => {
  loading.value = true
  page({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    realName: searchData.realName || undefined,
    phoneNumber: searchData.phoneNumber || undefined
  })
    .then((data) => {
      paginationData.total = data.total
      tableData.value = data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleCreate = async () => {
  isFormVisible.value = true
  await nextTick()
  // UserForm.vue -> open
  formRef.value?.open("create")
}

const handleUpdate = async (data: User) => {
  isFormVisible.value = true
  await nextTick()
  // UserForm.vue -> open
  formRef.value?.open("update")
  formRef.value?.setFormData(data.id)
}

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {
  immediate: true
})
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
