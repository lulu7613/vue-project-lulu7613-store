<!-- 製作產品列表 -->
<template>
  <div>
    <div class="text-right my-3">
      <button class="btn btn-primary">建立新的產品</button>
    </div>
    <table class="table table-hover">
      <!--
        ESLint 規範一定要加 :key
        金額的部分都靠右對齊
        th 可用 width 限定欄位寬度，搭配 bootstrap 自由調整沒有 width 的欄位寬度
      -->
      <thead>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">啟用狀態</th>
        <th width="120">編輯</th>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">{{ item.origin_price }}</td>
          <td class="text-right">{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm">編輯</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 接收 ajax 的產品內容，提供各元件使用
      products: []
    }
  },
  methods: {
    // 接收 ajax 的資料，存放進 this.product (先接收測試版)
    getProducts () {
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products`
      this.$http.get(api).then(response => {
        // console.log(response.data)
        // 存進 this.product
        vm.products = response.data.products
      })
    }
  },
  created () {
    // 將 getProducts () 放入，透過 created 傳送 AJAX
    this.getProducts()
  }
}
</script>
