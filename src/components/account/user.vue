<template>
  <div class="mt-3">
    <span class="pageHeader">All User</span><br>
    <span class="pageDesc">View the users and export if required</span><br>
    <div class="container mt-3">
      <div>
        <va-input class="flex md6" v-model.trim="search_term" type="text" placeholder="Search Users" />
        <va-select class="ml-3" v-model="org_filter" text-by="name" clearable clearable-icon="cancel" searchable
          :options="organizationLists" placeholder="Select Organization" />
      </div>
      <div>
        <va-button class="createBtn" preset="secondary" border-color="#494949" color="#ffffff"
          @click="pageModification('create', null)">
          Create
        </va-button>
        <va-button class="ml-3 createBtn" color="#0096FC" @click="exportFile()">
          Export CSV
        </va-button>
      </div>
    </div>
    <va-data-table class="dataTable mt-4" :items="contentList" :columns="columnList" wrapper-size="380" item-size="46"
      per-page="10" virtual-scroller sticky-header striped>
      <template #cell(user_status)="{ row }">
        <img v-if="row.rowData.status === true" src="@/assets/status/active.png" height="22" width="80" />
        <img v-else src="@/assets/status/inactive.png" height="22" width="80" />
      </template>
      <template #cell(edit)="{ row }">
        <i class="fa fa-pencil" @click="pageModification('update', row.rowData)" style="cursor: pointer;"></i>
      </template>
    </va-data-table>
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
          <span class="va-form-label va-form-required-label">Role</span>
          <va-select v-if="isCreate" class="mt-2" searchable v-model="role" text-by="name" clearable clearable-icon="cancel"
            :options="roleLists" placeholder="Select Role" :error="checkRole" />
          <va-select v-if="isUpdate" searchable class="mt-2" v-model="role" text-by="name" clearable clearable-icon="cancel"
            :options="roleLists" placeholder="Select Role" :error="checkRole" disabled="true" /><br>
          <br v-if="role.name == 'OPERATOR' || role == 'OPERATOR'">
          <div v-if="role.name == 'OPERATOR' || role == 'OPERATOR'">
            <span class="va-form-label va-form-required-label">Organization</span>
            <va-select v-if="isCreate"  class="mt-2" v-model="org_name" :options="organizationLists" textBy="name"
              placeholder="Select Organization" :error="checkOrg" clearable clearable-icon="cancel" searchable />
            <va-select v-if="isUpdate" class="mt-2" v-model="org_name" :options="organizationLists" textBy="name"
              placeholder="Select Organization" :error="checkOrg" clearable clearable-icon="cancel" searchable
              disabled="true" />
          </div><br>
          <span class="va-form-label va-form-required-label">User Name</span>
          <va-input class="mt-2" v-model.trim="user_name" type="text" maxlength="50"
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
            placeholder="Enter Password" :error="checkPassword" /><br>
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
    this.getAllUsers(10, 0, '');
    this.getRole();
    this.getAllOrg();
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
      user_name: '',
      password: '',
      email: '',
      mobile: '',
      status: true,
      roleLists: [],
      checkUsername: false,
      mobileErrorMessage: '',
      emailErrorMessage: '',
      checkOrg: false,
      checkEmail: false,
      checkMobile: false,
      checkPassword: false,
      checkRole: false,
      user: '',
      flag: '',
      org_filter: '',
      direct_page: ''
    }
  },
  computed: {
    columnList() {
      return [
        { key: 'id', label: 's.no' },
        { key: 'user_name', label: 'User name' },
        { key: 'role.name', label: 'Role' },
        { key: 'email' },
        { key: 'mobile' },
        { key: 'user_status', width: 10 },
        { key: 'edit', width: 10 }
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
    search_term() {
      if (this.search_term == '') {
        this.getAllUsers(10, 0, '');
        this.page_value=1;
      } else {
        var num = 1;
        var payload = {
          'arr': ['user_name', 'mobile', 'email'],
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
        this.title = 'Create User';
      } else {
        this.title = 'Update User';
      }
      this.showForm = true;
      if (type == 'update') {
        this.flag = 'Update';
        this.isUpdate = true;
        this.isCreate = false;
        this.user_id = data['user_id'];
        this.role = data['role.name'];
        this.org_name = data['org.name'];
        this.email = data['email'];
        this.user_name = data['user_name'];
        this.mobile = data['mobile'];
        this.status = data['status'];
      } else {
        this.flag = 'Create';
        this.isUpdate = false;
        this.isCreate = true;
      }
    },
    resetForm() {
      this.showForm = false;
      this.role = '';
      this.email = '';
      this.user_name = '';
      this.mobile = '';
      this.status = true;
      this.password = '';
      this.checkUsername = false;
      this.checkOrg = false;
      this.checkRole = false;
      this.checkMobile = false;
      this.checkPassword = false;
      this.checkEmail = false;
      this.org_filter = '';
      this.getAllUsers(10, 0, '');
      this.page_value = 1;
      this.direct_page = 1;
      this.org_name = ''
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
      this.axios.get(config.host + 'user/' + limit + '/' + offset + '?org_id=' + org_id).then(response => {
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
        "user_name": "User Name",
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
        !this.checkRole &&
        !this.checkMobile &&
        !this.checkEmail &&
        !this.checkOrg &&
        !this.checkPassword
      ) { return true } else { return false }
    },
    submit(type) {
      this.checkRole = (!this.role) ? true : false
      if (this.role.name == 'OPERATOR') this.checkOrg = (!this.org_name) ? true : false;
      this.checkUsername = (!this.user_name) ? true : false;
      this.checkMobile = (!this.mobile) ? true : false;
      this.checkEmail = (!this.email) ? true : false;
      this.checkPassword = (!this.password) ? true : false;

      if (this.mobile && this.mobile.length != 10) {
        this.checkMobile = true;
        this.mobileErrorMessage = 'Mobile should be atleast 10 digits';
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
      var payload = {
        user_name: this.user_name,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        status: this.status,
      };
      if (type == 'Create') {
        payload.role_id = this.role.role_id;
        if (this.role.name == 'OPERATOR') payload.org_id = this.org_name['org_id'];
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
        loader.hide();
        this.showForm = true;
        this.$toast.error(err.response.data);
      });
    }
  }
}
</script>