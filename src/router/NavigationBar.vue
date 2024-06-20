<template>

  <va-navbar  style="display:flex; align-items: left; background: linear-gradient(to right, #003163 0%, #003163 100%);">
  <!--   <va-navbar-item class="pl-1 pr-1 navigation">
      <img src="@/assets/Fastplaylogo.png" height="150" style="margin-top: -55px; margin-left: -50px;">
    </va-navbar-item> -->
    <va-navbar-item class="pl-1 pr-1 navigation"
      :class="{ active: activePage === '/dashboard' || activePage === '/admin' }"
      @click.prevent="redirect('Dashboard', '/dashboard')">
      <!-- <img class="nav-img" src="@/assets/dashboard.png" height="15" /> -->
      <span class="ml-3 nav_item" style="color: white;">Dashboard</span>
    </va-navbar-item>

  <div v-for="manage in filteredManages">
    <va-navbar-item class="pl-3 pr-2 navigation"
      :class="{ active: isManage === true || activePage === '/manage' }" @click.prevent="redirect(manage.redirect, '/manage')" v-if="role != 'OPERATOR'">
      
      <!-- <img src="@/assets/location.png" style="color: #ffffff;"   height="15" /> -->
      <span class="ml-3 nav_item" style="color: white;">{{manage.name}}</span>
    
    </va-navbar-item>
  </div>

  <!--   <va-navbar-item class="pl-3 pr-3 navigation account_menu"
      :class="{ active: isManage === true || activePage === '/manage' }" v-if="role != 'OPERATOR'"> -->

        <!-- <div v-for="manage in filteredManages">
              <span>
                  <img src="@/assets/arrow.png" class="mt-1" height="13" />
                  <a class="report-link"  @click.prevent="redirect(manage.redirect, '/manage')" style="color: #000000;"> 
                    <p>{{ manage.name }}</p>
                  </a>  
              </span><br><br>
            </div> -->



 <!--      <img class="nav-img active" src="@/assets/package.png" height="15" @click.stop="showHide('manage')" />
      <span id="account_menu" class="ml-3 nav_item" @click.prevent="showHide('manage')">
        Collections<i :class="iconManage" style="margin-top: 4px;" @click.stop="showHide('manage')"></i>
      </span>
      <va-card class="sub_account_menu" v-if="isManage"
        style="margin: 2.5rem 0px 0px -2rem; width: 12rem;">
        <span>
          <div class="list_view" style="margin: 20px 0 0 30px;">
            <div v-for="manage in filteredManages">
              <span>
                  <img src="@/assets/arrow.png" class="mt-1" height="13" />
                  <a class="report-link"  @click.prevent="redirect(manage.redirect, '/manage')" style="color: #000000;"> 
                    <p>{{ manage.name }}</p>
                  </a>  
              </span><br><br>
            </div>
          </div>
        </span>
      </va-card> -->
    <!-- </va-navbar-item> -->

<!--     <va-navbar-item class="pl-3 pr-3 navigation account_menu"
      :class="{ active: isCustomise === true || activePage === '/customize' }" v-if="role != 'FINANCE'">
      <img class="nav-img active" src="@/assets/user_pencil.png" height="15" @click.stop="showHide('customize')" />
      <span id="account_menu" class="ml-3 nav_item" @click.prevent="showHide('customize')">
        Customize<i :class="iconCust" style="margin-top: 4px;" @click.stop="showHide('customize')"></i>
      </span>
      <va-card class="sub_account_menu" v-if="isCustomise"
        style="margin: 2.5rem 0px 0px -1.5rem; width: 12rem;">
        <span>
          <div class="list_view" style="margin: 20px 0 0 30px;">
            <div v-for="customize in filteredCustomizes">
              <span>
                <img src="@/assets/list.png" class="mt-1" height="13" />
                <a class="report-link" @click.prevent="redirect(customize.redirect, '/customize')">
                  {{ customize.name }}
                </a>
              </span><br><br>
            </div>
          </div>
        </span>
      </va-card>
    </va-navbar-item> -->

<!--     <va-navbar-item class="pl-3 pr-3 navigation account_menu"
      :class="{ active: isIntegation === true || activePage === '/integration' }" v-if="((role === 'ADMIN') || (role === 'web_OPERATOR'))">
      <img class="nav-img active" src="@/assets/user_system-integration.png" height="15" @click.stop="showHide('integration')" />
      <span id="account_menu" class="ml-3 nav_item" @click.prevent="showHide('integration')">
        Integration<i :class="iconIntegration" style="margin-top: 4px;" @click.stop="showHide('integration')"></i>
      </span>
      <va-card class="sub_account_menu" v-if="isIntegation"
        style="margin: 2.5rem 0px 0px -2.5rem; width: 13.5rem;">
        <span>
          <div class="list_view" style="margin: 20px 0 0 30px;">
            <div v-for="integration in filteredIntegrations">
              <span>
                <img src="@/assets/list.png" class="mt-1" height="13" />
                <a class="report-link" @click.prevent="redirect(integration.redirect, '/integration')">
                  {{ integration.name }}
                </a>
              </span><br><br>
            </div>
          </div>
        </span>
      </va-card>
    </va-navbar-item>
 -->
  <va-navbar-item class="pl-2 pr-2 navigation"
      :class="{ active: activePage === '/account' || activePage === '/account' }"
      @click.prevent="redirect('Profile', '/account/profile')">
      <!-- <img class="nav-img" src="@/assets/user_account.png" height="15" /> -->
      <span class="ml-3 nav_item" style="color: white;">Account</span>
    </va-navbar-item>

     <va-navbar-item class="pl-2 pr-2 navigation"
      :class="{ active: activePage === '/account' || activePage === '/account' }"
      @click.prevent="redirect('Logout', null)">
      <!-- <i class="fa fa-sign-out" aria-hidden="true"></i> -->
      <span class="ml-3 nav_item" style="color: white;">Logout</span>
      <!-- <img class="nav-img" src="@/assets/user_account.png" height="15" /> -->
    </va-navbar-item>


<!--     <va-navbar-item class="pl-3 pr-3 navigation account_menu"
      :class="{ active: isAccount === true || activePage === '/account' }" >
      <img class="nav-img" src="@/assets/user_account.png" height="15" @click.stop="showHide('account')" />
      <span id="account_menu" class="ml-3 nav_item" @click.prevent="showHide('account')">
        Account<i :class="iconaccount" style="margin-top: 4px;" @click.stop="showHide('account')"></i>
      </span>
      <va-card class="sub_account_menu" v-if="isAccount">
        <span>
          <img class="mt-3 ml-3" height="50" :src="require(`@/assets/profile/${url}`)" />
          <span class="userName">{{ user_name }}</span>
          <va-button style="position: absolute; right: 16px; top: 16px;"
            @click.prevent="redirect('Logout', null)">Logout</va-button>
          <hr class="mt-2">
          <div class="list_view" style="margin: 8px 0 0 30px;">
            <div v-for="account in filteredAccounts">
              <span>
                <a class="report-link" @click.prevent="redirect(account.redirect, '/account')">
                  {{ account.name }}
                </a>
              </span><br><br>
            </div>
          </div>
        </span>
      </va-card>
    </va-navbar-item> -->

  </va-navbar>
</template>

<script>
export default {
  props: ['set'],
  mounted() {
    document.addEventListener('click', this.hidePopup)
  },
  created() {
    // if(this.role == 'web_OPERATOR'){
    //   let modifiedRole = role.replace(/_/g, ' ');
    //   this.role = modifiedRole
    // }
    this.role = this.$cookies.get('role')
    this.activePage = window.location.pathname;
    var splitUrl = this.activePage.split("/");
    this.activePage = '/' + splitUrl[1];
  },
  computed: {
    filteredAccounts() {
      return this.accounts.filter(account => {
        return Array.isArray(account.role)
          ? account.role.includes(this.role)
          : account.role === this.role;
      });
    },
    filteredManages() {
      var arr = [];
      var vm = this;
      this.manages.map(function (argument) {
        if((vm.user_role == 'ADMIN') || (vm.user_role == ('SUPER_ADMIN'))){
          if(argument.name != 'Logo'){
            arr.push(argument)  
          }
          
        }
        if((vm.user_role == 'RESELLER') && (vm.user_type == "Admin Pack") && argument.role_flag.includes('Admin Pack') ){
          if((argument.name == 'Logo' )&& (vm.logo_insertion == 'true')){
            arr.push(argument) 
          }else if(argument.name != 'Logo'){
            arr.push(argument) 
          }
        }
        if((vm.user_role == 'RESELLER') && (vm.user_type == "Own Pack") && argument.role_flag.includes('Own Pack') ){
          if((argument.name == 'Logo' )&& (vm.logo_insertion == 'true')){
            arr.push(argument) 
          }else if(argument.name != 'Logo'){
            arr.push(argument) 
          }
        }
      })
      return arr

      // return this.manages.filter(manage => {
      //   return Array.isArray(manage.role)
      //     ? manage.role.includes(this.role)
      //     : manage.role === this.role;
      // });
    },
    // filteredCustomizes() {
    //   return this.customizes.filter(customize => {
    //     return Array.isArray(customize.role)
    //       ? customize.role.includes(this.role)
    //       : customize.role === this.role;
    //   });
    // },
    // filteredIntegrations() {
    //   return this.integrations.filter(integration => {
    //     return Array.isArray(integration.role)
    //       ? integration.role.includes(this.role)
    //       : integration.role === this.role;
    //   });
    // }
  },
  data() {
    return {
      modeFlag: false,
      activePage: '',
      user_name: this.$cookies.get('username'),
      user_role: this.$cookies.get('role'),
      user_type: this.$cookies.get('user_type'),
      logo_insertion: this.$cookies.get('logo_insertion'),
      isAccount: false,
      isCustomise: false,
      isIntegation: false,
      isManage: false,
      url: '',
      role: '',
      iconaccount: 'fa fa-angle-down iconSet nav-item',
      iconCust: 'fa fa-angle-down iconSet nav-item',
      iconIntegration: 'fa fa-angle-down iconSet nav-item',
      iconManage: 'fa fa-angle-down iconSet nav-item',
      accounts: [
        {
          name: 'Update Profile',
          redirect: 'Profile',
          role: ['ADMIN','RESELLER','SUPER_ADMIN'],
          role_flag : []
        }
      ],
      manages: [
        {
          name: 'Category',
          redirect: 'Category',
          role: ['ADMIN','RESELLER','SUPER_ADMIN'],
          role_flag: ['Own Pack']
        },
        {
          name: 'Channel',
          redirect: 'Channel',
          role: ['ADMIN','RESELLER','SUPER_ADMIN'],
          role_flag: ['Own Pack']
        },
        {
          name: 'Subscriber',
          redirect: 'Subscriber',
          role: ['ADMIN','RESELLER','SUPER_ADMIN'],
          role_flag: ['Own Pack', 'Admin Pack']
        },
        {
          name: 'Package',
          redirect: 'Package',
          role: ['ADMIN','RESELLER','SUPER_ADMIN'],
          role_flag: ['Own Pack', 'Admin Pack']
        },
        {
          name: 'Reseller',
          redirect: 'Reseller',
          role: ['ADMIN','SUPER_ADMIN'],
          role_flag : []
        },
        {
          name: 'Credit',
          redirect: 'Credit',
          role: ['ADMIN','SUPER_ADMIN', 'RESELLER'],
          role_flag: ['Own Pack', 'Admin Pack']
        },
        {
          name: 'Movies',
          redirect: 'Ott',
          role: ['ADMIN','SUPER_ADMIN'],
          role_flag: []
        },
        {
          name: 'WebSeries',
          redirect: 'webseries',
          role: ['ADMIN','SUPER_ADMIN'],
          role_flag: []
        },
        {
          name: 'Appupdate',
          redirect: 'Appupdate',
          role: ['ADMIN','SUPER_ADMIN'],
          role_flag : []
        },
        {
          name: 'Logo',
          redirect: 'Logo',
          role: ['RESELLER'],
          role_flag : ['Own Pack', 'Admin Pack']
        },
        {
          name: 'Advertisement',
          redirect: 'Advertisement',
          role: ['ADMIN','SUPER_ADMIN'],
          role_flag : ['Own Pack', 'Admin Pack']
        },
        // {
        //   name: 'App',
        //   redirect: 'App',
        //   role: ['ADMIN','SUPER_ADMIN'],
        //   role_flag : []
        // },
        // {
        //   name: 'Logo',
        //   redirect: 'Logo',
        //   role: ['RESELLER'],
        //   role_flag : ['Own Pack', 'Admin Pack']
        // },
      ]
    };
  },
  methods: {
    hidePopup(event) {
      if (event.target.id === 'account_menu') return;
      this.isAccount = false;
      this.isCustomise = false;
      this.isIntegation = false;
      this.isReport = false;
      this.isManage = false;
      this.iconaccount = 'fa fa-angle-down iconSet nav-item';
      this.iconCust = 'fa fa-angle-down iconSet nav-item';
      this.iconIntegration = 'fa fa-angle-down iconSet nav-item';
      this.iconManage = 'fa fa-angle-down iconSet nav-item';
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
      console.log("type",type)
      this.$router.push({ name: type });
      this.activePage = url;
    },
    showHide(type) {
      this.activePage = '';
      // this.accounts.onclick = true;
      this.url = 'image1' + '.png';
      if (type == 'account') {
        this.isCustomise = false;
        this.isIntegation = false;
        this.isManage = false;
        this.isAccount = (this.isAccount) ? false : true;
        this.iconManage = (this.isManage) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
        this.iconCust = (this.isCustomise) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
        this.iconaccount = (this.isAccount) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
        this.iconIntegration = (this.isIntegation) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      }
      if (type == 'manage') {
        this.isCustomise = false;
        this.isIntegation = false;
        this.isAccount = false;
        this.isManage = (this.isManage) ? false : true;
        this.iconManage = (this.isManage) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
        this.iconCust = (this.isCustomise) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
        this.iconaccount = (this.isAccount) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
        this.iconIntegration = (this.isIntegation) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      }
      // if (type == 'customize') {
      //   this.isAccount = false;
      //   this.isManage = false;
      //   this.isIntegation = false;
      //   this.isCustomise = (this.isCustomise) ? false : true;
      //   this.iconCust = (this.isCustomise) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      //   this.iconaccount = (this.isAccount) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      //   this.iconManage = (this.isManage) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      //   this.iconIntegration = (this.isIntegation) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      // }
      // if (type == 'integration') {
      //   this.isAccount = false;
      //   this.isCustomise = false;
      //   this.isManage = false;
      //   this.isIntegation = (this.isIntegation) ? false : true;
      //   this.iconCust = (this.isCustomise) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      //   this.iconaccount = (this.isAccount) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      //   this.iconManage = (this.isManage) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      //   this.iconIntegration = (this.isIntegation) ? 'fa fa-angle-up iconSet nav-item' : 'fa fa-angle-down iconSet nav-item';
      // }
    }
  },
};
</script>

<style>
.top {
  white-space: nowrap;
  color: red;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navigation{
  font-weight: bold;
}

.top:hover {
  background-color: #0096FC;
  color: black;
  font-weight: 800;
  border-radius: 10px;
}

.top:hover .fa-arrow-right {
  display: inline;
}

.fa-arrow-right {
  display: none;
}

.active .nav-img {
  filter: brightness(100%);
}

.active .nav_item {
  color: white;
}


.nav_item:hover {
  color: white;
  font-weight: bold;
}


.nav_item {
  color: #ffffff;
  cursor: pointer;
}

.nav-img {
  filter: brightness(100%);
  cursor: pointer;
}


.sub_report_menu {
  margin: 40px 0px 0px -651px;
  height: auto;
  width: 912px;
  position: absolute !important;
  top: 2rem;
  z-index: 2;
}

.sub_account_menu {
  margin: 40px 0px 0px -161px;
  width: 278px;
  position: absolute !important;
  top: 2.5rem;
  z-index: 2;
  height: auto !important;
}

.va-navbar__left {
  align-items: inherit;
}


.header {
  position: absolute;
  margin: 17px 0px 0 30px;
  font-size: 14px;
  font-weight: bold;
  color: black;
}

.list_view {
  color: #5C5C5C;
  margin: 0.5rem 0 0 2rem;
}

.report-link {
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  width: 300px;
  margin: 0.6rem;
  font-weight: 900;
  position: absolute;
  margin-top: 3px;
}

.report-link:hover {
  font-weight: bold !important;
  font-size: 13px;
  color: #ffffff;
}

.userName {
  position: absolute;
  top: 24px;
  left: 4rem;
  font-weight: bold;
  white-space: initial;
  overflow-wrap: break-word;
  overflow: hidden;
  max-width: 8em;
  line-height: 1.2em;
}

.customise {
  display: flex;
  width: 60px;
  justify-content: space-between;
}

.iconSet {
  font-size: 15px;
  margin: 2px 0 0 4px;
  position: absolute;
}
</style>