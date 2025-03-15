import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet, userLoginUsingPost } from '@/api/userController.ts'

/**
 * 存储登录用户的store
 */
export const useLoginUserStore = defineStore('counter', () => {
  const loginUser = ref<any>({
    userName: '未登录',
  })

  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
  }

  /**
   * 设置登录用户
   */
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
