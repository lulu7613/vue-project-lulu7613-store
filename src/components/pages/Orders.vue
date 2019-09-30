<template>
  <div>
    <loading :active.sync="isLoading" loader="dots"></loading>
    <div class="row my-3">
      <div class="col-md-6">
        <Page @postPage="getOrders" :pages="pagination" />
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
        <tr
          v-for="(item, key) in orders"
          :key="key"
          :class="{'text-secondary': !item.is_paid}"
        >
          <td>{{ item.create_at | date }}</td>
          <td>
            <span v-text="item.user.email" v-if="item.user"></span>
          </td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total | currency }}</td>
          <td>
            <strong v-if="item.is_paid" class="text-success">已付款</strong>
            <span v-else class="text-muted">尚未起用</span>
          </td>
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
      orders: [], // 接收 ajax 的訂單列表
      pagination: {} // 接收 ajax 的 page 資料，要 props 給 Pagination.vue
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
        this.pagination = response.data.pagination
      })
    }
  },
  created () {
    this.getOrders()
  }
}
</script>
