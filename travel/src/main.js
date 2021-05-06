// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入公用基础样式
// import './assets/styles/reset.css'
// 多倍屏幕/一像素边框
// import './assets/styles/border.css'
//引入外部字体图标库
import './assets/styles/iconfont.css'
//安装fastClick(npm install fastClick --save),避免出现的点击延迟效果
import fastClick from 'fastclick'
Vue.config.productionTip = false
fastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
