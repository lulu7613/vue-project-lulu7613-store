    <!-- 製作產品列表分頁
      API 已做好分頁的邏輯 (預設一頁 10 筆資料)，放在 response.data.pagination
      1. total_pages / 總頁數
      2. current_page / 當前頁數
      3. has_next / 有無下一頁
      4. has_pre / 有無上一頁
      5. API 已做好分頁切換 /api/:api_path/admin/products?page=:page
      6. 透過 :page 切換頁面
    -->

<template>
  <div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <!-- 上一頁 -->
        <li
          class="page-item"
          :class="{'disabled': !pages.has_pre}"
          @click="getPage(pages.current_page-1)"
        >
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <!-- 總頁數 item in 10 的概念 -->
        <li
          class="page-item"
          v-for="page in pages.total_pages"
          :key="page"
          :class="{'active': pages.current_page === page}"
          @click="getPage(page)"
        >
          <a class="page-link" href="#">{{ page }}</a>
        </li>
        <!-- 下一頁 -->
        <li
          class="page-item"
          :class="{'disabled': !pages.has_next}"
          @click="getPage(pages.current_page+1)"
        >
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Page',
  props: ['pages'], // 接收父層傳來的資料

  methods: {
    // es6 參數預設值: page = 1，當沒有寫入參數時，預設為 1
    getPage (page = 1) {
      if (page === 0 || page > this.pages.total_pages) { return } // 避免跑出 loading 特效
      this.$emit('postPage', page) // 將 page 傳給 父層
      console.log('子元件', page)
    }
  }

}
</script>
