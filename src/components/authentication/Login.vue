<template>
  <center>
    <div class="login">
      <!-- <img src="@/assets/LoginTransparent.png" height="320" width="550" class="transparentImg" /> -->
      <div class="formView" style="margin-top:-10rem!important;margin-left: 5rem;">
        <p style="font-weight: bold; color: #ffffff;">Login to Proceed!</p><br><br>
        <div>
          <span class="labelTag" style="margin-left: -21.8rem; font-weight: bold; color: #ffffff;">User Name</span><br>
          <va-input class="mt-3" v-model.trim="email" placeholder="Enter User Name" :error="emailCheck" type="text"
            color="#ffffff" />
        </div><br>
        <div class="mt-3">
          <span style="margin-left: -21.8rem; font-weight: bold; color: #ffffff;">Password</span><br>
          <va-input class="mt-3" v-model.trim="password" placeholder="Enter password" :type="showPassword ? 'text' : 'password'"
            :error="passwordCheck" @keydown.enter="submit()">
            <template #appendInner>
              <va-icon :name="showPassword ? 'visibility_off' : 'visibility'" size="small"
                @click="showPassword = !showPassword" />
            </template>
          </va-input>
        </div>
        <va-button class="mt-4 loginButton" preset="secondary" border-color="#494949" color="#ffffff"
          @click.prevent="submit()">
          Login <i class="fa-solid fa-arrow-right ml-2 mt-1"></i>
        </va-button>
        <div v-if="err_flag" class="error_msg">{{ err_msg }}</div>
      </div>
    </div>
  </center>
</template>

<script>
import config from '@/router/config.json';
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      emailCheck: false,
      passwordCheck: false,
      isLoading: false,
      err_flag: false,
      err_msg: '',
    }
  },
  methods: {
    errorCheck() {
      if (
        !this.emailCheck &&
        !this.passwordCheck
      ) { return true } else { return false }
    },
    submit() {
      this.isLoading = true;
      this.emailCheck = (!this.email) ? true : false;
      this.passwordCheck = (!this.password) ? true : false;

      if (!this.errorCheck()) {
        this.isLoading = false;
        return;
      }
      var payload = { 'email': this.email, 'password': this.password };
      var Roles = ['ADMIN','RESELLER','SUPER_ADMIN'];
      this.axios.post(config.host + 'auth/login', payload).then(response => {
        if (response.data.auth && Roles.includes(response.data.user.roles)) {
          document.body.style.background = 'linear-gradient(to bottom, #003163 40%, #cccccc 40%)';
          localStorage.setItem('LoggedUser', true);
          this.$cookies.set('web-x-access-token', response.data.token);
          this.$cookies.set('user_id', response.data.user.user_id);
          this.$cookies.set('username', response.data.user.username);
          this.$cookies.set('role', response.data.user.roles);
          this.$cookies.set('profile', 'image1')
          this.$cookies.set('mobile', response.data.user.mobile);
          this.$cookies.set('org_id', response.data.user.org_id);
          this.$cookies.set('user_type', response.data.user.type);
          this.$cookies.set('org_name', response.data.user.org_name);
          this.$cookies.set('logo_insertion', response.data.user.logo_insertion);
          
          this.$router.push({ name: 'PageLayout' });
        } else{
          this.$toast.error("You don't have access to login")
        }
      }, err => {
        this.err_flag = true;
        this.isLoading = false;
        this.err_msg = err.response.data.msg;
      })
    }
  }
}
</script>

<style>
.transparentImg {
  position: absolute;
  margin: 0 0 0 -12.7rem;
}

.loginButton {
  margin-left: 20.7rem;
  width: 94px;
  border-radius: 9px;
}

.error_msg {
  color: #df1f1f;
  margin-left: -20.1rem;
  font-size: 0.8rem;
}

/*.va-button.loginButton:hover {
  background: #bded5c !important;
}*/

.va-button.loginButton:hover .fa-arrow-right {
  display: block;
}

.login .va-input-wrapper__field {
  --va-input-wrapper-background: #ffffff !important;
  color: #000000 !important;
}

.login .va-input-wrapper__text input,
.va-input-wrapper__text {
  color: black;
}

.fa-arrow-right {
  display: none;
}

.login ::placeholder {
  color: white !important;
  /* Change this to the desired color */
}

.login ::hover {
  color: #000000 !important;
  /* Change this to the desired color */
}

</style>