import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import '../access.ts'
import 'vue-cropper/dist/index.css'
import VueCropper from 'vue-cropper'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)
app.component('VueCropper', VueCropper)

app.mount('#app')
