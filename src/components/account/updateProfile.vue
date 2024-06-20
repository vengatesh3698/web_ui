<template>
  <div class="mt-3">
    <br>
    <div class="pageHeader mb-3">Profile</div>
    <div class="container">
      <div class="pageDesc" style="font-size: 18px;">Let's change the profile</div>
      

       <!-- <va-button color="#999999" type="submit" hide-icon @click.prevent="redirect('Logout', null)">
        Logout
      </va-button> -->
    </div>
    <div class="mt-5">
      <va-card class="cardView">
         <div class="flex md6 pa-5 mt-5">
          <center>
            <!-- <img src="@/assets/avatar7.png" height="330" alt="image" /> -->
             <img :src=image_url height="330" width="330"  alt="image" />
          </center>
        </div>
        <div class="mt-4 flex md6">
         <!--  <va-card class="roleCard" color="#000000">
            <div class="roleView">
              <span><b>Role</b></span><br>
              <span>{{ role }}</span>
            </div>
          </va-card> -->
          <form class="form pa-4">
            <span class="va-form-label va-form-required-label">Username</span><br>
                <va-input v-model.trim="username"
                  oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9_- ]/g, '')" maxlength="50"
                  :error="checkUsername" placeholder="Enter Username" disabled /><br><br>

                <span class="va-form-label va-form-required-label">Mobile</span><br>
                <va-input v-model.trim="mobile" maxlength="10" placeholder="Enter Mobile"
                  oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');" :error="checkMobile"
                  :error-messages="mobileErrorMessage"/><br><br>
                    
           <!--  <div class="row">
              <div class="flex md6 pr-3">
                
              </div>
              <div class="flex md6">
                
              </div>
            </div><br> -->
            <span class="va-form-label va-form-required-label">Email</span><br>
            <va-input v-model.trim="email" :error="checkEmail" :error-messages="emailErrorMessage"
              oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_@.]*/g, '');" disabled /><br><br>
            <span class="va-form-label">Password</span><br>
            <va-input v-model.trim="password" placeholder="Enter password" :type="showPassword ? 'text' : 'password'"
              :error="checkPassword">
              <template #appendInner>
                <va-icon :name="showPassword ? 'visibility_off' : 'visibility'" size="small"
                  @click="showPassword = !showPassword" />
              </template>
            </va-input><br><br>

            <va-button color="#999999" type="submit" hide-icon @click.prevent="submit()">
              Update Profile
            </va-button>
           <!--  <span class="va-form-label">Select your Profile</span><br>
            <div class="mt-3">
              <img v-for="(image, index) in images" :key="index" :src="require(`@/assets/profile/${image}`)"
                :alt="'Profile Image ' + (index + 1)"
                :class="{ 'profile-image': true, 'select': selectedImageIndex === index }" @click="selectImage(index)" />
            </div> -->
          </form>
        </div>
       
      </va-card>
    </div>
  </div>
</template>

<script>
import config from '@/router/config.json';
export default {
  created() {
    var image = this.$cookies.get('profile') + '.png';
    this.selectedImageIndex = this.images.indexOf(image);
    this.image_url = 'http://157.119.200.65/logo/'+this.$cookies.get('user_id')+'.png';
    this.getUser();
  },
  data() {
    return {
      role: this.$cookies.get('role'),
      username: this.$cookies.get('username'),
      mobile: this.$cookies.get('mobile'),
      password:'',
      email: this.$cookies.get('username')+'@email.com',
      mobileError: false,
      mobileErrorMessage: '',
      checkUsername: false,
      checkEmail: false,
      checkMobile: false,
      checkPassword: false,
      showPassword: false,
      image_value: '@/assets/avatar7.png',
      images: [
        'image1.png',
        'image2.png',
        'image3.png',
        'image4.png',
        'image5.png',
        'image6.png',
      ],
      selectedImageIndex: null,
    }
  },
  methods: {
    selectImage(index) {
      this.selectedImageIndex = index;
    },
    errorCheck() {
      if (
        !this.checkUsername &&
        !this.checkMobile &&
        !this.checkPassword &&
        !this.mobileError
      ) { return true } else { return false }
    },
    submit() {
      this.checkUsername = (!this.username) ? true : false;
      this.checkMobile = (!this.mobile) ? true : false;
       // this.checkPassword = (!this.password) ? true : false;

      if (this.mobile && this.mobile.length != 10) {
        this.checkMobile = true;
        this.mobileErrorMessage = 'Mobile should be atleast 10 digits';
      }
      if (!this.errorCheck() || this.checkMobile || this.checkEmail) {
        return;
      }
      var payload = {
        username: this.username,
        phone_number: this.mobile,
        profile: this.selectedImageIndex !== null ? this.images[this.selectedImageIndex].slice(0, -4) : null,
      };
      if (this.password){
        payload['password'] = this.password
      }
      const loader = this.$loading.show({ width: 40, height: 40 });
      this.axios.put(config.host + 'user/' + this.$cookies.get('user_id'), payload).then(response => {
        console.log("response",response)
        loader.hide();
        this.getUser();
        this.password='';
        this.$toast.success(response.data);
      }, err => {
        loader.hide();
        this.$toast.error(response.data);
      })
    },
    getUser() {
      const loader = this.$loading.show({ width: 40, height: 40 });
      this.axios.get(config.host + 'user/' + this.$cookies.get('user_id')).then(response => {
        console.log("response.data-----------",response.data)
        loader.hide();
        this.$cookies.set('profile', 'image1');
        this.$cookies.set('username', response.data.username);
        this.$cookies.set('phone_number', response.data.phone_number);
        this.$cookies.set('email',response.data.email)
      })
    },
    redirect(type, url) {
      this.isAccount = false;
      this.isCustomise = false;
      this.isIntegation = false;
      this.isReport = false;
      this.isManage = false;
      this.iconaccount = 'fa fa-angle-down iconSet';
      this.iconCust = 'fa fa-angle-down iconSet';
      this.iconIntegration = 'fa fa-angle-down iconSet';
      this.iconManage = 'fa fa-angle-down iconSet';
      this.$router.push({ name: type });
      this.activePage = url;
    },
  }
}
</script>

<style>
.roleCard {
  width: 11rem;
  height: 3rem;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
}

.roleView {
  margin: 0.5rem 0 0 1.8rem;
  position: absolute;
  font-size: 0.9rem;
}

.profile-image {
  height: 50px;
  width: 50px;
  margin-left: 20px;
  border-radius: 50%;
  cursor: pointer;
}

.select {
  border: 3px solid blue;
}

.form .va-input {
  width: 100%;
}
</style>