<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  <div>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
@import './cssFile/main.scss';

::-webkit-scrollbar {
  width: 0.2em;
}

::-webkit-scrollbar-thumb {
  background: lightgrey;
  border-radius: 1em;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
}
</style>
