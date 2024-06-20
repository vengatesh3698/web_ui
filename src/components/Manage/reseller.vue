<template>
  <div class="mt-3">
    <span class="pageHeader">Reseller</span><br>
    <span class="pageDesc">View the reseller users</span><br>
    <div class="container mt-3">
      <div>
        <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Users" />
        <!-- <va-select class="ml-3" v-model="org_filter" text-by="name" clearable clearable-icon="cancel" searchable
          :options="organizationLists" placeholder="Select Organization" /> -->
      </div>
      <div>
        <va-button class="ml-3 createBtn" color="#999999" @click="pageModification('create', null)">
          <i class="fas fa-plus" style=" margin-right:10px;"></i>Add
        </va-button>
        <!-- <va-button class="ml-3 createBtn" color="#0096FC" @click="exportFile()">
          Export CSV
        </va-button> -->
      </div>
    </div>
    <va-data-table class="dataTable mt-4" :items="contentList" :columns="columnList" wrapper-size="380" item-size="46"
      per-page="10" virtual-scroller sticky-header>
      <template #cell(user_status)="{ row }">
        <img v-if="row.rowData.status === true" src="@/assets/status/active.png" height="22" width="80" />
        <img v-else src="@/assets/status/inactive.png" height="22" width="80" />
      </template>
      <template #cell(edit)="{ row }">
        <i class="fa fa-pencil" @click="pageModification('update', row.rowData)" style="cursor: pointer;"></i>
      </template>
      <template #cell(delete)="{ row }">
        <img src="@/assets/delete.png" @click="deleteInitiate(row.rowData)" height="20" class="cursorPointer" />
      </template>
    </va-data-table>
    <va-modal style="color: #ffffff;" v-model="showModal" title="Delete" message='Are you sure to delete?' okText="DELETE" cancelText="Cancel" @ok="deleteZee(deleteData)" blur  />
    <div class="row container mt-3" v-if="totalCount > 10">
      <div class="pageInput">
        <span class="mt-1 pl-2 pr-2">Go to the page</span>
        <input v-model.trim="direct_page" @input="directPage(10, direct_page)" />
      </div>
      <va-pagination 
        class="flex offset-lg8" 
        v-model="page_value" 
        :visible-pages="7" 
        :total="totalCount"
        :direction-links="false" 
        :page-size="10" 
        boundary-numbers 
        color="#888888" 
        size="small"
        @click="getAllUsers(10, page_value, '')" 
      />
    </div>
    <div>
      <VueSidePanel v-model="showForm" width="500px" hide-close-btn :panel-duration="1000" transition-name="slide-right"
        no-close>
        <div class="row">
          <span class="cardTitle">{{ title }}</span>
          <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
        </div>
        <form class="formView">
          <!-- <span class="va-form-label va-form-required-label">Role</span>
          <va-select v-if="isCreate" class="mt-2" searchable v-model="role" text-by="name" clearable clearable-icon="cancel"
            :options="roleLists" placeholder="Select Role" :error="checkRole" /> -->
         <!--  <va-select v-if="isUpdate" searchable class="mt-2" v-model="role" text-by="name" clearable clearable-icon="cancel"
            :options="roleLists" placeholder="Select Role" :error="checkRole" disabled="true" /><br> -->
          
        <!--   <div v-if="role.name == 'OPERATOR' || role == 'OPERATOR'">
            <span class="va-form-label va-form-required-label">Organization</span>
            <va-select v-if="isCreate"  class="mt-2" v-model="org_name" :options="organizationLists" textBy="name"
              placeholder="Select Organization" :error="checkOrg" clearable clearable-icon="cancel" searchable />
            <va-select v-if="isUpdate" class="mt-2" v-model="org_name" :options="organizationLists" textBy="name"
              placeholder="Select Organization" :error="checkOrg" clearable clearable-icon="cancel" searchable
              disabled="true" />
          </div><br> -->
          
          <div class="md6 pr-3">
            <span class="va-form-label va-form-required-label">Role</span><br>
            <va-radio class="mt-3" v-for="option in roleArr" v-model="role" :option="option" />
          </div><br>

          <span class="va-form-label va-form-required-label">User Name</span>
          <va-input class="mt-2" v-model.trim="username" type="text" maxlength="50"
            oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_]*/g,'');" 
            placeholder="Enter User Name" :error="checkUsername" /><br><br>
          <span class="va-form-label va-form-required-label">Mobile Number</span>
          <va-input class="mt-2" v-model.trim="mobile" maxlength="10"
            oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');" placeholder="Enter Mobile Number"
            :error="checkMobile" :error-messages="mobileErrorMessage" /><br><br>
          <span class="va-form-label va-form-required-label">Email</span>
          <va-input class="mt-2" v-model.trim="email" type="text" placeholder="Enter Email" :error="checkEmail"
            :error-messages="emailErrorMessage" oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_@.]*/g, '');"/><br><br>
          <span class="va-form-label va-form-required-label">Password</span>
          <va-input class="mt-2" v-model.trim="password" type="password" pattern="[A-Za-z0-9_@!./#&+-^]{8,}$"
            placeholder="Enter Password" :error="checkPassword" /><br><br>

          <div v-if='role=="RESELLER"'>
            <span class="va-form-label va-form-required-label">Subscriber Limit</span>
            <va-input class="mt-2" v-model.trim="subscriber_limit" maxlength="7"
            oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');" placeholder="Enter Subscriber Limit" :error="checkLimit" :error-messages="limitErrorMessage" /><br><br>
          </div>

          <span class="va-form-label va-form-required-label">Partner Code</span>
          <va-input class="mt-2" v-model.trim="partner_code" maxlength="4"
            oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');" placeholder="Enter Partner Code"
            :error="checkCode" :error-messages="codeErrorMessage" /><br><br>

          <div class="md6 pr-3" v-if='role=="RESELLER"'>
            <span class="va-form-label va-form-required-label">Type</span><br>
            <va-radio class="mt-3" v-for="option in ['Admin Pack', 'Own Pack']" v-model="type" :option="option" />
          </div><br>

          <div v-if='role=="RESELLER" && type=="Admin Pack"'>
            <span class="va-form-label va-form-required-label">Packages</span><br>
            <va-select v-model="reseller_packages" class=" mt-2" text-by="package_name" multiple clearable clearable-icon="cancel" :options="packagelist" searchable placeholder="Select Packages" :error="packagecheck" track-by="package_name" /><br><br>
          </div>

          
            <span class="va-form-label va-form-required-label">Logo</span>
            <va-file-upload v-model="logo" dropzone file-types="image/*" accept="image/*" color="#b4131e" />
            <span class="mt-2 error_msg" v-if="logoError">{{ logoError }}</span>
            <br v-if="logoError">
          <!-- <va-checkbox class="mt-4" v-model="logo_insertion" label="Enable Logo Insertion" color="#000000" /><br> -->
          <va-checkbox class="mt-4" v-model="status" label="Status" color="#000000" />
          <va-button class=" mt-5 form_button" @click="submit(flag)" color="#0096FC">{{ flag }}</va-button>

          
        </form>
      </VueSidePanel>
    </div>
  </div>
</template>
<script>
import config from '@/router/config.json';
import { exportToFile } from '@/module/exportFile';
import {search} from '@/module/Search.js';
export default {
  created() {
    if(this.$cookies.get('role') == 'SUPER_ADMIN'){
      this.roleArr = ['ADMIN','RESELLER'];
      this.role = 'ADMIN';
    }else if(this.$cookies.get('role') == 'ADMIN'){
      this.roleArr = ['RESELLER'];
      this.role = 'RESELLER';
    }

    this.getAllUsers(10, 0, '');
    // this.getRole();
    // this.getAllOrg();
    this.getPackages();
  },
  data() {
    return {
      search_term: '',
      organizationLists: [],
      userLists: [],
      page_value: 1,
      totalCount: '',
      showForm: false,
      showGrid: true,
      isCreate: false,
      isUpdate: false,
      role: '',
      org_name: '',
      username: '',
      logo_insertion: false,
      password: '',
      email: '',
      mobile: '',
      status: true,
      roleLists: [],
      checkUsername: false,
      mobileErrorMessage: '',
      emailErrorMessage: '',
      codeErrorMessage: '',
      checkCode : false,
      checkOrg: false,
      checkEmail: false,
      checkMobile: false,
      checkPassword: false,
      checkLimit: false,
      limitErrorMessage: '',
      checkRole: false,
      user: '',
      subscriber_limit: '',
      flag: '',
      org_filter: '',
      direct_page: '',
      reseller_packages:[],
      packagelist: [],
      packagecheck : false,
      type: 'Admin Pack',
      role:'ADMIN',
      logoError: false,
      logo:[],
      roleArr:[],
      showModal: false,
    }
  },
  computed: {
    columnList() {
      return [
        { key: 'id', label: 's.no' },
        { key: 'username', label: 'User name' },
        { key: 'roles', label: 'Role' },
        { key: 'email' },
        { key: 'mobile' },
        { key: 'user_status', width: 10 },
        { key: 'edit', width: 10 },
        { key: 'delete', width: 10 }
      ]
    },
    contentList() {
      return this.userLists
    }
  },
  watch: {
    org_filter() {
      var org_id = (this.org_filter == '') ? '' : this.org_filter['org_id'];
      this.getAllUsers(10, 0, org_id)
    },
    logo() {
      const selectedFile = this.logo[0];
      if (selectedFile) {
        const fileType = selectedFile.type;
        if (!fileType.startsWith('image/')) {
          this.$toast.error('Invalid file type. Only image files are allowed.');
          this.logo = [];
          // this.imageView = false;
        }
      }
      if (this.logo.length > 1) {
        this.$toast.error('Please select a single image file.');
        this.logo = [];
        // this.imageView = false;
      }
      if (!this.logo.length) {
        // this.imageView = false;
        return this.previewImage = null;
      };
      // this.imageView = true;
      const reader = new FileReader();
      // reader.readAsDataURL(this.logo[0]);
      // reader.onload = evt => {
      //   this.previewImage = evt.target.result;
      // };
    },
    search_term() {
      if (this.search_term == '') {
        this.getAllUsers(10, 0, '');
        this.page_value=1;
      } else {
        var num = 1;
        var payload = {
          'arr': ['username', 'mobile', 'email', 'partner_code'],
          'term': this.search_term,
          'type': 'user'
        }
        search(payload).then(data => {
          this.userLists = data.rows.map(item => {
            item.id = num++
            return item
          })
        });
      }
    }
  },
  methods: {
    directPage(limit, offset) {
      this.direct_page = offset.replace(/\D/g, '');
      if (this.direct_page === '' || this.direct_page === '0' || isNaN(this.direct_page) || parseInt(this.direct_page) < 1) {
        return;
      }
      this.page_value = (parseInt(this.direct_page) * 10) - 9;
      if (this.page_value <= this.totalCount) {
        this.getAllUsers(limit, this.page_value);
      }
    },
    pageModification(type, data) {
      if (type == 'create') {
        this.title = 'Create Reseller';
      } else {
        this.title = 'Update Reseller';
      }
      this.showForm = true;
      if (type == 'update') {
        this.flag = 'Update';
        this.isUpdate = true;
        this.isCreate = false;
        this.user_id = data['user_id'];
        console.log("data",data['roles'])
        this.role = data['roles'];
        // this.org_name = data['org.name'];
        this.reseller_packages = data['reseller_packages'];
        this.email = data['email'];
        this.logo_insertion = data['logo_insertion'];
        this.username = data['username'];
        this.subscriber_limit = data['subscriber_limit'];
        this.partner_code = data['partner_code'];
        this.mobile = data['mobile'];
        this.status = data['status'];
        this.type = data['type'];
      } else {
        this.flag = 'Create';
        this.isUpdate = false;
        this.isCreate = true;
      }
    },
    resetForm() {
      this.type= 'Admin Pack';
      this.showForm = false;
      this.role = '';
      this.email = '';
      this.username = '';
      this.logoError = false
      this.mobile = '';
      this.status = true;
      this.password = '';
      this.checkUsername = false;
      this.checkOrg = false;
      this.checkRole = false;
      this.subscriber_limit = '';
      this.checkMobile = false;
      this.checkPassword = false;
      this.checkEmail = false;
      this.checkLimit = false;
      this.limitErrorMessage = '';
      this.org_filter = '';
      this.getAllUsers(10, 0, '');
      this.page_value = this.page_value ?  this.page_value : 1;
      this.direct_page = 1;
      this.org_name = ''
      this.packagecheck = false
      this.logo_insertion = false
      this.checkCode = false
      this.reseller_packages = []
      this.logo= []
      if(this.$cookies.get('role') == 'SUPER_ADMIN'){
        this.roleArr = ['ADMIN','RESELLER'];
        this.role = 'ADMIN';
      }else if(this.$cookies.get('role') == 'ADMIN'){
        this.roleArr = ['RESELLER'];
        this.role = 'RESELLER';
      }
    },
    getPackages() {
        const loader = this.$loading.show({ width: 40, height: 40 });
        this.axios.get(config.host + 'package').then(response => {
            loader.hide();
            this.packagelist = response.data.map(function (data, num) {
                data.id = num++;
                return data;
            })
        });
    },
    getRole() {
      this.axios.get(config.host + 'role').then(response => {
        this.roleLists = response.data;
      })
    },
    getAllOrg() {
      this.axios.get(config.host + 'org?role=OPERATOR').then(response => {
        this.organizationLists = response.data;
      })
    },
    getAllUsers(limit, offset, org_id) {
      this.axios.get(config.host + 'user/' + limit + '/' + offset).then(response => {
        var num = (offset == 0) ? offset + 1 : offset;
        this.totalCount = response.data.count;
        this.userLists = response.data.rows.map(item => {
          item.id = num++;
          return item;
        });
      });
    },
    exportFile() {
      var rowKeys = {
        "username": "User Name",
        "role.name": "Role Name",
        "org.name": "Organization Name",
        "email": "Email",
        "mobile": "Mobile Number",
        "status": "Status",
      }
      const loader = this.$loading.show({ width: 40, height: 40 });
      this.axios.get(config.host + 'user?getAllData=' + true).then(response => {
        loader.hide();
        exportToFile(response.data, rowKeys, 'Total UserLists', 'CSV')
      }, err => {
        loader.hide();
        this.$toast.error("There was a problem to Export User Lists");
      })
    },
    errorCheck() {
      if (
        !this.checkUsername &&
        !this.checkMobile &&
        !this.checkEmail && 
        !this.checkCode && 
        !this.logoError
      ) { return true } else { return false }
    },
    submit(type) {
      this.checkUsername = (!this.username) ? true : false;
      this.checkMobile = (!this.mobile) ? true : false;
      this.checkEmail = (!this.email) ? true : false;
      this.checkLimit = (!this.subscriber_limit && this.isCreate) ? true : false;
      this.checkCode = (!this.partner_code) ? true : false;
      this.logoError = (!this.logo[0] && this.isCreate) ? 'Upload Logo' : false;
      if(type == 'create'){
        this.checkPassword = (!this.password) ? true : false;
        if(this.checkPassword){
          return
        }
      }
      
      if(this.role=='RESELLER' && this.type == 'Admin Pack'){
        this.packagecheck = (this.reseller_packages.length == 0) ? true:false;
        if(this.packagecheck){
          this.$toast.error("Select atleast one package");
        }
      }

      if (this.mobile && this.mobile.length != 10) {
        this.checkMobile = true;
        this.mobileErrorMessage = 'Mobile should be atleast 10 digits';
      }
      var vm = this;
      if(this.reseller_packages && this.reseller_packages.length > 0){
        var array = this.reseller_packages.map(resp => {
          return { package_name: resp.package_name , package_id : resp.package_id, user_id: vm.user_id};
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.email) {
        this.checkEmail = true;
      } else if (!emailRegex.test(this.email)) {
        this.checkEmail = true;
        this.emailErrorMessage = 'Email should be in the correct format';
      } else {
        this.checkEmail = false;
      }


      if (!this.errorCheck() || this.checkEmail || this.checkMobile) return;
      var payload = new FormData();
      payload.append('roles', this.role)
      payload.append('username', this.username)
      payload.append('mobile', this.mobile)
      payload.append('email', this.email)
      payload.append('subscriber_limit', this.subscriber_limit)
      payload.append('status', this.status)
      payload.append('partner_code', this.partner_code)
      payload.append('type', this.type)
      payload.append('logo_insertion', this.logo_insertion)
      payload.append('reseller_packages', JSON.stringify(array))

      if (this.isCreate || this.isUpdate) {
        payload.append('logo', this.logo[0])
      }
      if(this.password){
        payload.append('password', this.password)
      }
      if (type == 'Create') {
        var requestUrl = this.axios.post(config.host + 'user', payload)
      } else {
        var requestUrl = this.axios.put(config.host + 'user/' + this.user_id, payload)
      };
      const loader = this.$loading.show({ width: 40, height: 40 });
      requestUrl.then(response => {
        loader.hide();
        this.resetForm();
        this.$toast.success(response.data);
      }, err => {
        console.log("err",JSON.stringify(err))
        loader.hide();
        this.showForm = true;
        this.$toast.error(err.response.data);
      });
    },
    deleteInitiate(data) {
      this.showModal = true;
      this.deleteData = data;
    },
    deleteZee(data) {
      const loader = this.$loading.show({ width: 40, height: 40 });
      this.axios.delete(config.host + 'user/' + data.user_id).then(response => {
          loader.hide();
          this.resetForm();
          this.$toast.success(response.data);
      }, err => {
          loader.hide();
          this.$toast.error(err.response.data);
      });
    }
  }
}
</script>