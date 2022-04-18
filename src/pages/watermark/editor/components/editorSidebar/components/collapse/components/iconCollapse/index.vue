<template>
  <div style="margin-top: 65px">
    <div class="icon-tabs">
      <span
        :class="['tabs-item', { isactive: activeIcon === 'festival' }]"
        @click="changeTab('festival')"
      >
        节日图标
      </span>
      <span
        :class="['tabs-item', { isactive: activeIcon === 'activity' }]"
        @click="changeTab('activity')"
      >
        活动图标
      </span>
    </div>
    <icon-maps :activeIcon="activeIcon"></icon-maps>
    <!-- <iconmaps :activeIcon="'activity'" v-else></iconmaps> -->
  </div>
</template>

<script>
import iconMaps from './components/iconMaps'

export default {
  components: {
    iconMaps
  },
  props: {},
  watch: {
    activeBtn(val) {
      this.isShow = val
    }
  },
  data() {
    return {
      isShow: '',
      activeIcon: 'festival'
    }
  },
  methods: {
    changeTab(val) {
      this.activeIcon = val
    }
  }
}
</script>
