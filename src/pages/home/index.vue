<template>
  <div class="home">
    <div class="logo"></div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  height: 100%;
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
