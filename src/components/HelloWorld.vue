<template>
  <div class="container mt-3">
    <button type="button" class="btn btn-primary" @click="logout">登出</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    logout () {
      const vm = this
      const api = `${process.env.API_PATH}/logout`
      this.$http.post(api).then((response) => { // 登出只需要 post api
        console.log('logout', response.data)

        // 如果登出成功，轉跳至登入頁，path: '/login'
        if (response.data.success) {
          vm.$router.push('/login')
        }
      })
    }
  }
}
</script>
