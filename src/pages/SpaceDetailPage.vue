<template>
  <!--展示空间基本信息-->
  <div id="spaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">
          + 创建图片
        </a-button>
        <a-button :icon="h(EditOutlined)" @click="doBatchEdit"> 批量编辑</a-button>

        <BatchEditPictureModal
          ref="batchEditPictureModalRef"
          :spaceId="id"
          :pictureList="dataList"
          :onSuccess="onBatchEditPictureSuccess"
        />

        <!-- 占用空间组件-->
        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            type="circle"
            :percent="Number(((space.totalSize * 100) / space.maxSize).toFixed(1))"
            :size="42"
          />
        </a-tooltip>
      </a-space>
      <!-- 搜索表单 -->
    </a-flex>
  </div>
  <PictureSearchForm :onSearch="onSearch" />
  <!-- 颜色搜索 -->
  <a-form-item label="按颜色搜索" style="margin-top: 16px">
    <color-picker format="hex" @pureColorChange="onColorChange" />
  </a-form-item>
  <!--隔开-->
  <div style="margin-bottom: 16px" />
  <!-- 图片列表 -->
  <PictureList :dataList="dataList" :loading="loading" showOp :onReload="fetchData" />
  <a-pagination
    v-if="space.maxCount !== undefined"
    style="text-align: right"
    v-model:current="searchParams.current"
    v-model:pageSize="searchParams.pageSize"
    :total="total"
    :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
    @change="onPageChange"
  />
</template>
<script setup lang="ts">
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import { h, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost
} from '@/api/pictureController'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import PictureList from '@/components/PictureList.vue'
import { formatSize } from '@/utils'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
import { EditOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  id: string | number
}>()
const space = ref<API.SpaceVO>({})

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
})

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12
  // sortField: 'createTime',
  // sortOrder: 'descend',
})

const onPageChange = (page, pageSize) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

const onColorChange = async (color: string) => {
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})
const onSearch = values => {
  // 重置分页到第一页
  searchParams.current = 1
  // 合并搜索参数
  Object.assign(searchParams, values)
  // 重新加载数据
  fetchData()
}
// 分享弹窗引用
const batchEditPictureModalRef = ref()

// 批量编辑成功后，刷新数据
const onBatchEditPictureSuccess = () => {
  fetchData()
}
// 打开批量编辑弹窗
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}
</script>

<style scoped></style>
