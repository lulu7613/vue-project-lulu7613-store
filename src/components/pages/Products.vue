<!-- 製作產品列表 -->
<template>
  <div>
    <div class="text-right my-3">
      <!-- 製作 model 效果 -->
      <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
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
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
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
                    <i class="fas fa-spinner fa-spin"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" />
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: [], // 接收 ajax 的產品內容，提供各元件使用
      tempProduct: {}, // 包裹新建產品的內容，名稱需對應 api 提供的參數
      isNew: true,

      // modal 使用的樣式與判斷
      isShow: false,
      showStyle: {
        display: '',
        backgroundColor: ''
      }
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
    },

    // 開啟 modal 的觸發方法 (確保遠端資料已接收完畢，才能開啟 modal)
    openModal (isNew, item) {
      // 不使用 bootstrap 的 jQuery，自製觸發方式
      this.isShow = true
      if (this.isShow) {
        this.showStyle.display = 'block'
        this.showStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      }

      // 開啟 modal 兩種按鈕: 新增產品 與 編輯商品
      // 兩者判斷方式: isNew ( 新增產品=true / 編輯商品=false )
      // updateProduct (isNew, item)，當 isNew = false，傳入 item
      if (isNew) {
        // 當新增產品時
        // 1.isNew = true
        // 2.this.tempProduct 為空物件
        this.isNew = true
        this.tempProduct = {}
      } else {
        // 當編輯商品時
        // 1.isNew = false
        // 2.this.tempProduct 為要編輯的商品的資料
        this.isNew = false
        // this.tempProduct = item 不能這樣寫，這樣會有傳參考的問題，需寫成:
        this.tempProduct = Object.assign({}, item) // 複製成新的物件
      }
    },

    closeModal () {
      this.isShow = false
      if (!this.isShow) {
        this.showStyle.display = 'none'
        this.showStyle.backgroundColor = ''
      }
    },

    // 新增或修改完，按下確認
    updateProduct () {
      // 在 data 定義一個物件 tempProduct ，包裹產品的內容
      // 因 api 是以物件 { data: tempProduct } 接收資料，傳送時必須是同樣型式
      // 有兩種傳送模式:
      // 1.新增產品 (isNew=true) api / post
      // 2.編輯商品 (isNew=false) api / put
      // 兩者的 api 路徑不一樣

      // 建立會變動的參數 (預設為新增產品的路徑)
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product`
      let httpMethod = 'post'
      const vm = this

      if (!this.isNew) { // 當編輯商品時
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${this.tempProduct.id}`
        httpMethod = 'put'
      }
      // 傳送 api
      vm.$http[httpMethod](api, {data: this.tempProduct}).then(response => {
        console.log(response.data)
        vm.closeModal() // 取消 modal
        vm.getProducts() // 重新讀取 products 內容
      })
    }
  },
  created () {
    // 將 getProducts () 放入，透過 created 傳送 AJAX
    this.getProducts()
  }
}
</script>
