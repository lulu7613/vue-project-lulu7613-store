<!-- 製作產品列表 -->
<template>
  <div>
    <div class="text-right my-3">
      <!-- 製作 model 效果 -->
      <button class="btn btn-primary" @click="openModal()">建立新的產品</button>
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
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal()">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
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
      // 接收 ajax 的產品內容，提供各元件使用
      products: [],
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
    // 不使用 bootstrap 的 jQuery，自製觸發方式
    openModal () {
      this.isShow = true
      if (this.isShow) {
        this.showStyle.display = 'block'
        this.showStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      }
    },
    closeModal () {
      this.isShow = false
      if (!this.isShow) {
        this.showStyle.display = 'none'
        this.showStyle.backgroundColor = ''
      }
    }
  },
  created () {
    // 將 getProducts () 放入，透過 created 傳送 AJAX
    this.getProducts()
  }
}
</script>
