// 透過 event bus 觸發事件:
// 1.在 src/ 下建立 bus.js
// 2.import Vue 的設定檔
// 3.掛載 Vue.prototype.$bus (在 Vue 元件掛載一個叫 bus 的變數)
// 4.在 main.js import 這個檔案

// eventBus 建置流程:
// Vue.prototype.$bus = new Vue()
// 0. 將 bus 這個變數新增 Vue 的實體，在此就直接將 Vue 的實體建立在 $bus 原型內，也就是直接將 data 存放在 $bus 這個實體
// 1. 在 alert.vue 中將 message:push 和 message, status 塞入 bus 這個全域實體
// 2. 在 product.vue 使用了 bus 這個全域變數內的 message:push 方法，並透過 emit 傳遞參數
// 3. 最後觸發了 updateMessage 這個方法將資料渲染到畫面上

// 因將 bus.js 掛載在 vue 的原型下，可以直接用 this.$bus 使用
// 關於 Vue.prototype.$bus = new Vue();$bus 的用途：在 Vue 本體下註冊這個變數，使得所有組件都能夠取用，且這個變數是客製化的，$的功能是要提醒使用者：它是一個全域變數。
// 在$bus透過$on自定義一個事件，叫做message:push。
// EventBus 主要是可以跨元件傳遞資料，因此你這樣做是可行的，但我們通常不會把程式碼寫進 App.vue ，看在哪個元件會觸發事件，就在那個元件寫 $bus.$on

import Vue from 'vue'

Vue.prototype.$bus = new Vue()

// 避免忘記自訂了那些方法，養成習慣將方法記錄在這

// AlertMessage
// this.$bus.$emit('messsage:push', message, status)
// message(string): 訊息內容
// ststus(string): Alert 樣式
// 元件: AlertMessage.vue
// 掛載元件: Dashboard.vue
