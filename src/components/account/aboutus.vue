<template>
  <div class="mt-3">
    <span class="pageHeader">About Us</span><br>
 
  </div>
</template>

<script>
  import config from '@/router/config.json';
  export default {
    data() {
      return {
        about_company:"",
        object: [
        ],
      }
    },
    created() {
     
    },
  } 
</script>

<style>
  .va-icon material-icons va-button__right-icon {
    padding: 4px;
    height: 32px;
  }
 
  .right {
    display: grid;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    height: 18px;
    margin-left: 6px;
  }
</style>