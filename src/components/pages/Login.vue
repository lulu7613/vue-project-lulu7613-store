<template>
  <div>
    <Alert />
    <form class="form-signin" @submit.prevent="login">
      <img class="mb-4" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt width="72" height="72" />
      <h1 class="h3 mb-3 font-weight-normal">登入帳號</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required
        autofocus
        v-model="user.username"
      />
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required
        v-model="user.password"
      />
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
    </form>
  </div>
</template>

<script>
import Alert from '../AlertMessage' // 引入錯誤訊息回饋的元件

export default {
  components: {
    Alert
  },
  name: 'Login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      failLogin: '輸入的帳號或密碼不對'
    }
  },
  methods: {
    login () {
      const vm = this
      const api = `${process.env.API_PATH}/admin/signin`
      this.$http.post(api, vm.user).then((response) => { // 登入 post 需加上 user 做比對
        console.log('login', response.data)

        // 如果登入成功，轉跳至主頁，path: '/'
        if (response.data.success) {
          vm.$router.push('/admin/products') // 從 HelloWorld 轉到 products
        } else {
          this.$bus.$emit('messsage:push', this.failLogin, 'danger')
        }
      })
    }
  },

  created () {
    const api = `${process.env.API_PATH}/api/user/check`
    this.$http.post(api).then((response) => {
      if (response.data.success) {
        this.$router.push('/admin/products') // 登入狀態跳轉到 products
      } else {
        this.$bus.$emit('messsage:push', '已登出帳號，請重新登入', 'danger') // 登出狀態訊息
      }
    })
  }
}
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
