import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif




// #ifdef VUE3
import { createSSRApp } from 'vue'
// 引入store
import store from './store'
// 引入组件
import postCard from './components/post-card/post-card.vue'
import popupBottom from './components/popup-bottom/popup-bottom.vue'
// 引入uniIcon 图标库
import uniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
import uniDateformat from '@/uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.vue'
import uniSegmentedControl from '@/uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.vue'



export function createApp() {
  const app = createSSRApp(App)
  // 引用store
  app.use(store)
  // 调用app.component方法全局注册组件
  app.component('post-card', postCard)
  app.component('popup-bottom',popupBottom)
  // 调用app.component方法全局注册组件
  app.component('uni-icons',uniIcons)
  app.component('uni-dateformat',uniDateformat)
  app.component('uni-segmented-control',uniSegmentedControl)
  
  return {
    app
  }
}
// #endif

