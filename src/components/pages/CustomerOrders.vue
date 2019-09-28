<template>
  <div>
    <loading :active.sync="isLoading" loader="dots"></loading>
    <div class="row mt-3">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{'background-image': `url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <del class="h6">原價 {{ item.origin_price | currency }} 元</del>
              <div class="h5">現在只要 {{ item.price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm">
              <i class="fas fa-spinner fa-spin"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto">
              <i class="fas fa-spinner fa-spin"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: [],
      tempProduct: {},
      pagination: {},

      isLoading: false
    }
  },

  methods: {
    getProducts (page = 1) {
      this.isLoading = true
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products/?page=${page}`
      this.$http.get(api).then((response) => {
        console.log('CustomerOrders', response.data)
        vm.isLoading = false
        vm.products = response.data.products
        vm.pagination = response.data.pagination
      })
    }
  },

  created () {
    this.getProducts()
  }
}
</script>
