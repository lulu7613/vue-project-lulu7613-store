<!--
#dashboard 製作概念:
  sidebar、navbar 是使用元件內包覆元件的方法，而 products 是使用巢狀的方法
  因為 sidebar、navbar 為固定的，而 main 的內容是會切換的，所以才使用巢狀來載入 products 元件，這樣才能切換路由，製作出切換 main 的內容

#sidebar、navbar 內容是固定的，為什麼還要拆開為獨立的元件？
  拆開成獨立的元件可以使彈性增加，假使其他地方需要用到 sidebar、navbar ，也可以直接引入。
  但如果直接再 dashboard.vue 內寫死，sidebar、navbar 的話就沒辦法這麼做了。
-->

<template>
  <div>
    <Navbar/>

    <div class="container-fluid">
      <div class="row">
        <Sidebar/>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default {
  // 載入 navbar 和 sidebar 兩個子元件
  components: {
    Navbar,
    Sidebar
  }
}
</script>
