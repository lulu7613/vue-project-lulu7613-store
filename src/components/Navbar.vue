<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
      <input
        class="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      />
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#" @click="signout()">登出</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

export default {
  methods: {
    signout () {
      const api = `${process.env.API_PATH}/logout`
      this.$http.post(api).then((response) => {
        console.log(response.data)
        this.$router.push('/login') // 登出後轉到 login 元件
      })
    }
  }
}
</script>
