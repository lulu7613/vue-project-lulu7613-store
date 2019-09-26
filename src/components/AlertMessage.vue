<!--
  製作錯誤訊息回饋元件:
    1.在 src/components/ 下建立 AlertMessage.vue
    2.元件掛載在 Dashboard.vue 中

  透過 event bus 觸發事件:
    1.在 src/ 下建立 bus.js
    2.掛載 Vue.prototype.$bus (在 Vue 元件掛載一個叫 bus 的變數)
-->
<template>
  <div class="message-alert">
    <div class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, i) in messages" :key="i">
      {{ item.message }}
      <button type="button" class="close" @click="removeMessage(i)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: [] // 屆時會傳入物件{}
    }
  },
  methods: {
    // 產生 alert ，5 秒後自己移除
    // 觸發方式: 自定義事件
    updateMessage (message, status) {
      const timestamp = Math.floor(new Date() / 1000) // 產生 id
      this.messages.push({
        message, // 文字內容
        status, // bootstrap 的樣式 (如: alert-primary，status = primary，status)
        timestamp // 利用 timestamp 產生 id
      })
      this.removeMessageWithTiming(timestamp) // 自動移除 alert
    },

    // 透過 alert 裡的 x 手動刪除
    removeMessage (num) {
      this.messages.splice(num, 1)
    },

    // 設定 5 秒後自動移除自己
    removeMessageWithTiming (timestamp) {
      const vm = this
      setTimeout(() => { // setTimeout('要執行的代碼/function', '等待的毫秒數')
        // 尋找相符的 timestamp
        vm.messages.filter((item, index) => {
          if (item.timestamp === timestamp) {
            return vm.messages.splice(index, 1)
          }
        })
      }, 5000)

      // setTimeout(() => {
      //   vm.messages.forEach((item, i) => {
      //     if (item.timestamp === timestamp) {
      //       vm.messages.splice(i, 1)
      //     }
      //   })
      // }, 5000)
    }
  },

  // 自定義觸發方法
  created () {
    const vm = this
    // $on 自定義事件 (類似原生 JS 的 addEventListener)
    // 自定義名稱 'messsage:push'
    // message: 傳入參數
    // status: 樣式，預設值為 warning
    vm.$bus.$on('messsage:push', (message, status = 'warning') => {
      vm.updateMessage(message, status)
    })
    // 內層傳外層透過 $emit
    // vm.$bus.$emit('messsage:push');
  }
}
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>
