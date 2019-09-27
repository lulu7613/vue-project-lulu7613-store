<template>
  <div>
    <loading :active.sync="isLoading" loader="dots"></loading>
    <div class="row my-3">
      <div class="col-md-6">
        <Page @postPage="getCoupons" link="coupons" />
      </div>
      <div class="col-md-6 text-right">
        <button class="btn btn-info">新增優惠券</button>
      </div>
    </div>
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
      isLoading: false // vue-loading-overlay 插件開關
    }
  },

  methods: {
    getCoupons (page = 1) {
      this.isLoading = true
      const api = `${process.env.API_PATH}/api/lulu7613/admin/coupons?page=${page}`
      this.$http.get(api).then((response) => {
        console.log('Coupons', response.data)
        this.isLoading = false
      })
    }
  },

  created () {
    this.getCoupons()
  }
}
</script>
