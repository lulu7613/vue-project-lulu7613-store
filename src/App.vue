<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // 客戶端伺服器路徑 https://vue-course-api.hexschool.io/api/lulu7613/products
    // 將會變動的 1.站點、2.API 設定到 config 的 dev.env.js
    // process.env.API_PATH = https://vue-course-api.hexschool.io
    // process.env.CUSTOM_PATH = lulu7613
    const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`

    this.$http.get(api).then(response => {
      console.log(response.data)
    })
  }
}
</script>

<style lang="scss">
@import "./assets/all";
</style>
