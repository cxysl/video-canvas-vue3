<template>
  <div class="empty">
    <!-- <svg viewBox="0 0 1024 1024">
      <path
        d="M831.7 369.4H193.6L64 602v290.3h897.2V602L831.7 369.4zM626.6 604.6c0 62.9-51 113.9-114 113.9s-114-51-114-113.9H117.5l103.8-198h582.5l103.8 198h-281zM502.2 131h39.1v140.6h-39.1zM236.855 200.802l27.647-27.647 99.419 99.418-27.648 27.648zM667.547 272.637l99.418-99.419 27.648 27.648-99.418 99.418z"
        p-id="5425"
      ></path>
    </svg> -->
    <div class="text"><span>暂无数据</span></div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.empty {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  svg {
    width: 50%;
    height: 50%;
    fill: #999;
  }
  .text {
    font-size: 14px;
    color: #999;
  }
}
</style>
