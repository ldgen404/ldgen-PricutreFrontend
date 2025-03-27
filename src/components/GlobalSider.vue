<template>
  <div id="globalSider">
    <a-layout-sider v-if="loginUserStore.loginUser.id" class="sider" width="200" breakpoint="lg">
      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, watch } from 'vue'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

// 获取路由实例
const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

// 菜单列表
const menuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

// 当前选中的菜单项
const current = ref<string[]>([route.path])

// 监听路由变化，确保菜单高亮
watch(
  () => route.path,
  (newPath) => {
    current.value = [newPath]
  },
  { immediate: true },
)

// 菜单点击事件，进行路由跳转
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<style scoped></style>
