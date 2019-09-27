<template>
  <div>
    <loading :active.sync="isLoading" loader="dots"></loading>
    <div class=" row my-3">
      <div class="col-md-6">
        <Page @postPage="getOrders" link="orders" />
      </div>
    </div>

    <table class="table table-hover mt-3">
      <thead>
        <th width="120">購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th width="120">應付金額</th>
        <th width="120">是否付款</th>
      </thead>
      <tbody>
        <tr>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Page from '../Pagination'

export default {
  components: {
    Page
  },

  data () {
    return {
      isLoading: false, // vue-loading-overlay 插件開關
      orders: [] // 接收 ajax 的訂單列表
    }
  },

  methods: {
    // 接收 ajax 的資料，存放進 this.orders
    // 接收子元件(Pagination 分頁元件) 傳來的頁數參數
    getOrders (page = 1) {
      this.isLoading = true
      const api = `${process.env.API_PATH}/api/lulu7613/admin/orders?page=${page}`
      this.$http.get(api).then((response) => {
        console.log('Orders', response.data)
        this.isLoading = false
        this.orders = response.data.orders
      })
    }
  },
  created () {
    this.getOrders()
  }
}
</script>
