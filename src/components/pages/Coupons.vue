<template>
  <div>
    <loading :active.sync="isLoading" loader="dots"></loading>

  </div>
</template>

<script>
export default {
  data () {
    return {
      isLoading: false
    }
  }
}
</script>
