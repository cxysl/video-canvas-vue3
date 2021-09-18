<template>
  <div class="home">
    <div class="logo"></div>
    <el-button type="primary">主要按钮</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
.home {
  .logo {
    // background: url('../assets/images/laocheng/dsxs.jpg') no-repeat scroll 0 -20px transparent;margin: 0 auto;
    height: 300px;
    width: 300px;
    margin: 0 auto;
    background-image: url('../../assets/images/laocheng/dsxs.jpg');
    background-position: 56% center;
    background-repeat: no-repeat;
    background-size: 705px 300px;
  }
}
</style>
