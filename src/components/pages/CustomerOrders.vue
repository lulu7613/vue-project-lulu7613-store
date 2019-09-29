<template>
  <div>
    <loading :active.sync="isLoading" loader="dots"></loading>

    <!-- 商品列表 -->
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
              <div class="h4" v-if="!item.price">{{ item.origin_price | currency }} 元</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price | currency }} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getSingleProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
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

    <!-- Modal 單一商品細節 -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ tempProduct.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="tempProduct.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ tempProduct.content }}</p>
              <footer class="blockquote-footer text-right">{{ tempProduct.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!tempProduct.price">{{ tempProduct.origin_price | currency }} 元</div>
              <del class="h6" v-if="tempProduct.price">原價 {{ tempProduct.origin_price | currency }} 元</del>
              <div class="h4" v-if="tempProduct.price">現在只要 {{ tempProduct.price | currency }} 元</div>
            </div>
            <select name class="form-control mt-3" v-model="tempProduct.num">
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{tempProduct.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ tempProduct.num * tempProduct.price | currency }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
            >
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
import $ from 'jquery' // 引入 $ 變數 給 jquery 使用

export default {
  data () {
    return {
      products: [],
      tempProduct: {},
      pagination: {},

      isLoading: false, // vue-loading-overlay 開關
      status: { // 判斷 loading 狀態 (font-awsome loading 開關)
        loadingItem: ''
      }
    }
  },

  methods: {
    // 取得商品列表 /api/:api_path/products?page=:page
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
    },

    // 取得單一商品細節
    // 使用 font-awsome 製作區域讀取效果
    getSingleProduct (id) {
      const vm = this
      this.status.loadingItem = id // 開啟 loading
      const api = `${process.env.API_PATH}/api/lulu7613/product/${id}`
      this.$http.get(api).then((response) => {
        console.log('getSingleProduct', response.data)
        vm.tempProduct = response.data.product
        $('#productModal').modal('show') // 開啟 modal
        this.status.loadingItem = '' // 關閉 loading
      })
    }
  },

  created () {
    this.getProducts()
  }
}
</script>
