// 透過 event bus 觸發事件:
// 1.在 src/ 下建立 bus.js
// 2.import Vue 的設定檔
// 3.掛載 Vue.prototype.$bus (在 Vue 元件掛載一個叫 bus 的變數)
// 4.在 main.js import 這個檔案

// 因將 bus.js 掛載在 vue 的原型下，可以直接用 this.$bus 使用
// 關於 Vue.prototype.$bus = new Vue();$bus 的用途：在 Vue 本體下註冊這個變數，使得所有組件都能夠取用，且這個變數是客製化的，$的功能是要提醒使用者：它是一個全域變數。
// 在$bus透過$on自定義一個事件，叫做message:push。
// EventBus 主要是可以跨元件傳遞資料，因此你這樣做是可行的，但我們通常不會把程式碼寫進 App.vue ，看在哪個元件會觸發事件，就在那個元件寫 $bus.$on

import Vue from 'vue'

Vue.prototype.$bus = new Vue() // 將 bus.js 掛載在 vue 的原型下

// 避免忘記自訂了那些方法，養成習慣將方法記錄在這

// AlertMessage
// this.$bus.$emit('messsage:push', message, status)
// message(string): 訊息內容
// ststus(string): Alert 樣式
// 元件: AlertMessage.vue
// 掛載元件: Dashboard.vue
