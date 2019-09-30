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
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingCart === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 單一商品細節 -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog">
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
              <del
                class="h6"
                v-if="tempProduct.price"
              >原價 {{ tempProduct.origin_price | currency }} 元</del>
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
              @click="addCart(tempProduct.id, tempProduct.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingCart === tempProduct.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 購物車列表 -->
    <div class="row my-5 justify-content-center" v-if=" cartsLength > 0">
      <div class="col-md-6">
        <h3 class="text-center">購物車列表</h3>
        <table class="table mt-4">
          <thead>
            <th width="60"></th>
            <th>品名</th>
            <th width="100">數量</th>
            <th width="100">單價</th>
          </thead>
          <tbody>
            <tr v-for="item in carts.carts" :key="item.id">
              <td class="align-middle">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(item.id)"
                >
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total | currency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td width="100" class="text-right">{{ carts.total | currency }}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td width="100" class="text-right text-success">{{ carts.final_total | currency }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="couponCode" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCoupon()">套用優惠碼</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 建立訂單
      #使用 vee-validate 表單驗證
      npm install vee-validate@2.2.15 --save
      以下是 2.2.15 版本的使用方式， v3 版本不適用
      v-validate="'required'" ->在此條件是 'required'，所以不得為空
      errors.has('name') ->當 input 的內容是空值時為 true (此空值不包括初始狀態)
      v-validate="'required|email'" 是 vee-validate 針對 email 驗證的專屬寫法
      errors.first('email') 是 vee-validate 特別定義的寫法，會指出錯誤在哪
    -->
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="addCartOrder()">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="useremail"
            v-model="form.user.email"
            placeholder="請輸入 Email"
            v-validate="'required|email'"
            :class="{'is-invalid': errors.has('email')}"
          />
          <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input
            type="text"
            class="form-control"
            name="name"
            id="username"
            v-model="form.user.name"
            v-validate="'required'"
            :class="{'is-invalid': errors.has('name')}"
            placeholder="輸入姓名"
          />
          <span class="text-danger" v-if="errors.has('name')">請輸入姓名</span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input
            type="tel"
            class="form-control"
            name="usertel"
            id="usertel"
            v-model="form.user.tel"
            v-validate="'required'"
            :class="{'is-invalid': errors.has('usertel')}"
            placeholder="請輸入電話"
          />
          <span class="text-danger" v-if="errors.has('usertel')">收件人電話不得留空</span>
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input
            type="text"
            class="form-control"
            name="address"
            id="useraddress"
            v-model="form.user.address"
            v-validate="'required'"
            :class="{'is-invalid': errors.has('address')}"
            placeholder="請輸入地址"
          />
          <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
        </div>

        <div class="form-group">
          <label for="comment">留言</label>
          <textarea
            name
            id="comment"
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
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

      carts: [],
      cartsLength: 0, // carts 長度
      couponCode: '', // 優惠券 code

      form: {
        user: {}
      },

      isLoading: false, // vue-loading-overlay 開關
      status: { // 判斷 loading 狀態 (font-awsome loading 開關)
        loadingItem: '',
        loadingCart: ''
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
    },

    // 加入購物車，加入方法:
    // 1.點 "加到購物車" (數量+1)
    // 2.點 "查看更多" 的 "加到購物車" (數量看 tempProduct.num)
    // 送出參數 id (加到購物車的產品 id) 與 qty (數量)
    addCart (id, qty = 1) {
      this.status.loadingCart = id // 開啟 loading
      const vm = this
      const product = { // 設定成 API 規範的參數格式
        'product_id': id,
        qty
      }
      const api = `${process.env.API_PATH}/api/lulu7613/cart`
      this.$http.post(api, {data: product}).then((response) => {
        console.log('addCart', response.data)
        if (response.data.success) {
          vm.status.loadingCart = '' // 關閉 loading
          $('#productModal').modal('hide') // 關閉 modal
          vm.getCart()
          vm.$bus.$emit('messsage:push', response.data.message, 'success') // alert
        } else {
          vm.$bus.$emit('messsage:push', response.data.message, 'danger')
        }
      })
    },

    // 取得購物車列表
    getCart () {
      const vm = this
      const api = `${process.env.API_PATH}/api/lulu7613/cart`
      this.$http.get(api).then((response) => {
        console.log('getCart', response.data)
        vm.carts = response.data.data
        vm.cartsLength = response.data.data.carts.length // 計算購物車筆數
      })
    },

    // 刪除購物車項目
    removeCartItem (id) {
      const api = `${process.env.API_PATH}/api/lulu7613/cart/${id}`
      this.$http.delete(api).then((response) => {
        console.log('removeCartItem', response.data)
        if (response.data.success) {
          this.$bus.$emit('messsage:push', '商品已成功刪除', 'success')
        }
        this.getCart()
      })
    },

    // 套用優惠碼 /api/:api_path/coupon
    addCoupon () {
      const coupon = {
        code: this.couponCode
      }
      const api = `${process.env.API_PATH}/api/lulu7613/coupon`
      this.$http.post(api, {data: coupon}).then((response) => {
        console.log('addCoupont', response.data)
        if (response.data.success) {
          this.$bus.$emit('messsage:push', response.data.message, 'success')
          this.getCart()
        } else {
          this.$bus.$emit('messsage:push', response.data.message, 'danger')
        }
      })
    },

    // 送出購物訂單
    addCartOrder () {
      const vm = this
      const api = `${process.env.API_PATH}/api/lulu7613/order`

      // 使用 vee-validate 做表單驗證 ( 為 true 時才會送出表單)
      this.$validator.validate().then((result) => {
        if (result) {
          this.$http.post(api, { data: vm.form }).then((response) => {
            console.log('addCartOrder', response.data)
          })
        } else {
          this.$bus.$emit('messsage:push', '尚有欄位未填寫', 'danger')
        }
      })
    }
  },

  created () {
    this.getProducts()
    this.getCart()
  }
}
</script>
