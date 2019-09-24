<!-- 製作產品列表 -->
<template>
  <div>
    <!--
      製作讀取效果:
      1.使用 vue-loading-overlay 插件 (在此做全畫面讀取)
        > npm 安裝 https://github.com/ankurk91/vue-loading-overlay
        > 放在最外層的 div 中
        > 使用 isLoading 開關效果
      2.使用 font-awesome (在此做局部讀取)
        > npm 或 cdn 安裝 (cdn 放在 index.html)
        > 新版 Fontawesome 跳過註冊流程 cdn: <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">
        > Animating Icons 選項
        > 自訂開關
        > 將 <i> 放在要跑動畫元素裡
    -->
    <loading :active.sync="isLoading" loader="dots"></loading>

    <div class="text-right my-3">
      <!-- 製作 model 效果 -->
      <button class="btn btn-primary" @click="openModal('new')">建立新的產品</button>
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
            <span v-else class="text-secondary">未啟用</span>
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', item)"
              >編輯</button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', item)"
              >刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 製作產品列表分頁
      API 已做好分頁的邏輯 (預設一頁 10 筆資料)，放在 response.data.pagination
      1. pagination.total_pages / 總頁數
      2. pagination.current_page / 當前頁數
      3. pagination.has_next / 有無下一頁
      4. pagination.has_pre / 有無上一頁
      5. API 已做好分頁切換 /api/:api_path/admin/products?page=:page
      6. 透過 :page 切換頁面
    -->
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <!-- 上一頁 -->
        <li class="page-item" :class="{'disabled': !pagination.has_pre}" @click="getProducts(pagination.current_page-1)">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <!-- 總頁數 item in 10 的概念 -->
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{'active': pagination.current_page === page}"
          @click="getProducts(page)"
        >
          <a class="page-link" href="#">{{ page }}</a>
        </li>
        <!-- 下一頁 -->
        <li class="page-item" :class="{'disabled': !pagination.has_next}" @click="getProducts(pagination.current_page+1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Modal 新增與修改 -->
    <div
      class="modal fade"
      :class="{ 'show': isShow }"
      :style="{'display': showStyle.display, 'background-color': showStyle.backgroundColor}"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <!-- font-awesome 讀取畫面圖片 -->
                    <i class="fas fa-spinner fa-spin" v-if="fileLoading"></i>
                  </label>
                  <!--
                    上傳圖片
                    使用 formData 上傳圖片 API (與一般 api 上傳方式不同))
                    使用 @change
                  -->
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile()"
                  />
                </div>
                <img
                  img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid"
                  alt
                  :src="tempProduct.imageUrl"
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <!-- is_enabled 1=true 0=false -->
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempProduct.is_enabled"
                      true-value="1"
                      false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeModal()">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct()">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 刪除 -->
    <div
      class="modal fade"
      :class="{ 'show': isShow }"
      :style="{'display': deleteShowStyle.display, 'background-color': deleteShowStyle.backgroundColor}"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="closeModal()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
              @click="closeModal()"
            >取消</button>
            <button type="button" class="btn btn-danger" @click="updateProduct()">確認刪除</button>
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
      products: [], // 接收 ajax 的產品內容，提供各元件使用
      tempProduct: {}, // 包裹新建產品的內容，名稱需對應 api 提供的參數
      pagination: {}, // 接收 ajax 的 pagination 內容
      modalType: 'new',

      // modal 使用的樣式與判斷
      isShow: false,
      showStyle: { // 新增與修改 modal style
        display: '',
        backgroundColor: ''
      },
      deleteShowStyle: { // 刪除 modal style
        display: '',
        backgroundColor: ''
      },

      isLoading: false, // vue-loading-overlay 開關
      fileLoading: false // font-awesome 開關
    }
  },
  methods: {
    // 接收 ajax 的資料，存放進 this.product (先接收測試版)
    // es6 參數預設值: page = 1，當沒有寫入參數時，預設為 1
    getProducts (page = 1) {
      this.isLoading = true // 開啟 vue-loading-overlay
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products/?page=${page}`
      this.$http.get(api).then(response => {
        console.log(response.data)
        // 存進 this.product
        this.isLoading = false // 關閉 vue-loading-overlay
        vm.products = response.data.products
        vm.pagination = response.data.pagination // 儲存頁數設定
      })
    },

    // 開啟 modal 的觸發方法 (確保遠端資料已接收完畢，才能開啟 modal)
    openModal (modalType, item) {
      // 不使用 bootstrap 的 jQuery，自製觸發方式
      this.isShow = true

      // 開啟 modal 三種按鈕: 新增產品 編輯商品 刪除商品
      // 判斷方式: modalType ( 新增產品=new / 編輯商品=deit / 刪除商品=delete )
      if (modalType === 'new') {
        // 當新增產品時
        this.modalType = 'new'
        this.tempProduct = {} // 為空物件
        this.showStyle.display = 'block' // 新增 modal 的 classStyle
        this.showStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)' // 新增 modal 的 classStyle
      } else if (modalType === 'edit') {
        // 當編輯商品時
        // this.tempProduct 為要編輯的商品的資料
        this.modalType = 'edit'
        // this.tempProduct = item 不能這樣寫，這樣會有傳參考的問題，需寫成:
        this.tempProduct = Object.assign({}, item) // 複製成新的物件
        this.showStyle.display = 'block' // 新增 modal 的 classStyle
        this.showStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)' // 新增 modal 的 classStyle
      } else if (modalType === 'delete') {
        // 當刪除商品時
        this.modalType = 'delete'
        this.tempProduct = Object.assign({}, item)
        this.deleteShowStyle.display = 'block'
        this.deleteShowStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      }
    },

    // 關閉 modal
    closeModal () {
      this.isShow = false
      if (this.modalType === 'delete') {
        // 關閉刪除 modal
        this.deleteShowStyle.display = 'none'
        this.deleteShowStyle.backgroundColor = ''
      } else {
        // 關閉新增與修改 modal
        this.showStyle.display = 'none'
        this.showStyle.backgroundColor = ''
      }
    },

    // 新增 修改 刪除完，按下確認
    updateProduct () {
      // 在 data 定義一個物件 tempProduct ，包裹產品的內容
      // 因 api 是以物件 { data: tempProduct } 接收資料，傳送時必須是同樣型式
      // 有三種傳送模式:
      // 1.新增產品 (modalType=new) api / post
      // 2.編輯商品 (modalType=new) api / put
      // 3.刪除商品 (modalType=delete) api / delete
      // 三者的 api 路徑不一樣

      // 建立會變動的參數 (預設為新增產品的路徑)
      let api = ''
      let httpMethod = ''
      const vm = this
      this.isLoading = true // 開啟 vue-loading-overlay

      if (this.modalType === 'new') { // 當新增產品時
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product`
        httpMethod = 'post'
      } else if (this.modalType === 'edit') { // 當編輯商品時
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${this.tempProduct.id}`
        httpMethod = 'put'
      } else if (this.modalType === 'delete') { // 當刪除商品時
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${this.tempProduct.id}`
        httpMethod = 'delete'
      }
      // 傳送 api
      vm.$http[httpMethod](api, {data: this.tempProduct}).then(response => {
        console.log(response.data)
        vm.closeModal() // 取消 modal
        vm.getProducts() // 重新讀取 products 內容
        this.isLoading = false // 關閉 vue-loading-overlay
      })
    },

    // 上傳檔案
    uploadFile () {
      // console.log(this)
      // 1.要上傳的檔案，放在 this 的哪呢？ 答: this.$refs.files.files[0]
      // 2.建立 formData (https://openhome.cc/Gossip/ECMAScript/FormData.html)
      // 3.將 uploadedFile 新增到設定好的 form 中 <input type="file" name="file-to-upload"> ，使用 append
      // 4.定義上傳檔案的 api 路徑(url): /api/:api_path/admin/upload
      // 5.使用 axios 上傳，post(url, 傳送內容, content-Type格式 = multipart/form-data)
      // 6.使用 vm.$set() 將上傳後圖檔的 url ，綁定到 this.tempProduct.imageUrl
      // 7.備註: 因一開始在 data 中沒有定義 imageUrl 屬性，上傳後 vue 抓不到 tempProduct.imageUrl
      this.fileLoading = true // font-awesome 開啟
      const uploadedFile = this.$refs.files.files[0] // 1.
      const formData = new FormData() // 2.
      const vm = this
      formData.append('file-to-upload', uploadedFile) // 3.file-to-upload 為 input 的 name
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/upload` // 4.
      vm.$http.post(url, formData, {
        headers: { // 5.修改 content-Type 格式
          'content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log(response.data)
        // 上傳成功，將 imageUrl 綁定到 tempProduct.imageUrl
        if (response.data.success) {
          // 6.this.$set( target, propertyName, value(修改內容) )
          vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
          this.fileLoading = false // font-awesome 關閉
        }
      })
    }
  },
  created () {
    // 將 getProducts () 放入，透過 created 傳送 AJAX
    this.getProducts()

    // 測試 $bus
    // Product.vue 是 Dashboard.vue 的子元件，使用 $emit 傳送
    // (自定義名稱, 訊息內容, status 樣式)
    // this.$bus.$emit('messsage:push', '這是一段訊息', 'success')
  }
}
</script>
