<style>
body {
  background: linear-gradient(to bottom, #003163 0%, #003163  40%);
/*  background: linear-gradient(to bottom, #FFF5B0 40%, #cccccc 40%);*/

  background-repeat: repeat-x !important;
  background-size: 100% 40%;
}
</style>

<script>
import Navigator from '@/router/NavigationBar.vue';
export default {
  created() {
    if (window.location.pathname == '/admin') this.$router.push({ name: 'Dashboard' });
  },
  components: {
    Navigator
  }
}
</script>

<template>
  <div style="padding: 0 7rem 0 7rem;">
    <Navigator style="padding-left: 0;" />
    <router-view />
  </div>
</template>
