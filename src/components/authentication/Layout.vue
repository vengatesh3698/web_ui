<template>
    
  <div class="row auth-layout">
    <div class="col justify--center" >
      <img class="icon" src="@/assets/Group-3.png" />
      <center>
        <Login style="margin: 14rem 0 0 10rem;" />
      </center>
    </div>
  </div>

</template>

<script>
import Login from '@/components/authentication/Login.vue';
import config from '@/router/config.json';

export default{
  created(){
    document.body.style.background= '#003163';
  },
  components:{
    Login,
  }
}
</script>

<style>

.auth-layout {
align-items: center;
height: 100vh;

&__card {
  width: 100%;
  max-width: 600px;
}

&__options {
  @include media-breakpoint-down(xs) {
    flex-direction: column;
  }
}
}

.logo-container {
height: 100%;
align-items: center;
background: #b4131e;
position: relative;

& .icon {
  width: 50%;
  height: 50%;
  position: absolute;
  /*top: 10px;*/
  /*left: 10px;*/
}

& .font-label {
  font-size: 40px;
  color: white;
}
}

.login-container {
height: 100%;
align-items: center;
background: $alpha-color;
}

body {
  /*background-image: url("@/assets/login.png ");*/

}

.View {
  margin: 0rem 0 0 3rem;
}

.welMsg {
  color: grey;
  margin-top: 1rem;
}

.welBrandMsg {
color: #000000;
margin: -1.2rem 0 0 6rem;
font-size: 2.2rem;
font-weight: bold;
}

.col {
flex: 1;
display: flex;
}

.background-image-container {
width: 100%;
height: 100vh; /* Set the height to cover the entire viewport */
background-image: url('@/assets/newbg.jpg'); /* Replace 'path/to/your/image.jpg' with the relative path to your image */
background-size: cover;
background-position: center;
}
</style>