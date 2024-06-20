<template>
    <div class="mt-3">
        <div class="pageHeader">Credit</div>
        <div class="pageDesc">List of all Credits</div><br>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Credit" />
            </div>
            <div>
                <va-button class="ml-3 createBtn" color="#999999" v-if="role != 'RESELLER'" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>
                    Add
                </va-button>
            </div>
        </div>
        <div>
            <va-data-table class="dataTable mt-4" :items="contentList" :columns="columnList" wrapper-size="1000"
            item-size="46" virtual-scroller>
            <template  #cell(userspopup)="{ row }">
                <div v-if="row.rowData.is_subscribed">
                    <img src="@/assets/user.png" @click="userspopup(row.rowData)" style="width: 15px; height: 15px; margin-top: 2px; cursor: pointer;" />
                </div>
              
            </template>
            </va-data-table>
              <va-modal
                v-model="isUsershow"
                size="large"
                noEscDismiss
                noOutsideDismiss
                cancelText=""
                class="mr-4 my-1"
              >
                <template #header><h2>User Details</h2></template><br>
                <div class="ml-3 mr-3">
                  <!-- <div class="mt-2 row"> -->
                    <span class="flex xs5"><b>Name</b></span>
                    <span align=right>: {{userData.subscriber_name}}</span> <br>
                  <!-- </div> -->
                 
                  <!-- <div class="mt-2 row" > -->
                    <span class="flex xs5"><b>Mac</b></span>
                    <span align=right>: {{userData.mac}}</span><br>
                  <!-- </div> -->
                  <!-- <div class="mt-2 row"> -->
                    <span class="flex xs5"><b>Expiry</b></span>
                    <span align=right>: {{(new Date(userData.expiry_date).toLocaleString()).split(',')[0]}}</span>
                  <!-- </div> -->
                </div>
              </va-modal>
            <va-modal style="color: #ffffff;" v-model="showModal" title="Delete Credit"
                message='Are you sure to delete this Credit?' okText="DELETE" cancelText="Cancel"
                @ok="deleteZee(deleteData)" blur  />
        </div>
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getAllCredit(10, page_value)" />
        </div>
        <div>
            <VueSidePanel v-model="showForm" width="500px" hide-close-btn :panel-duration="1000"
                transition-name="slide-right" no-close>
                <div class="row">
                    <span class="cardTitle">{{ title }}</span>
                    <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
                </div>
                <form class="formView">

                    <span class="va-form-label va-form-required-label">Type</span>
                    <div class="md6 pr-3">
                        <va-radio class="mt-3" v-for="option in typeArr" v-model="type" :option="option" />
                    </div><br>


                    <span class="va-form-label va-form-required-label">Amount</span>
                    <va-input class="mt-2" v-model.trim="amount" maxlength="10" oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');"  type="text" placeholder="Enter Amount" :error="checkAmount" /><br><br>

                    <div v-if='type!="Credit"'>
                        <span class="va-form-label va-form-required-label">User</span><br>
                        <va-select v-model="to_user" class=" mt-2" text-by="username" clearable clearable-icon="cancel" :options="userlist" searchable placeholder="Select User" :error="usercheck" track-by="username" /><br><br>
                    </div>

                     <!--   <span class="va-form-label va-form-required-label">Priority</span>
                    <va-input class="mt-2" v-model.trim="priority" type="text" placeholder="Enter Priority"
                        :error="checkPriority" /><br><br> -->
                   
                    <va-button class="mt-5 form_button" @click="submit(flag)" color="#ffffff">{{ flag }}</va-button>
                </form>
            </VueSidePanel>
        </div>
    </div>
</template>
  
<script>
import config from '@/router/config.json';
import { search } from '@/module/Search.js';

export default {
    created() {
        if(this.$cookies.get('role') == 'SUPER_ADMIN'){
          this.typeArr = ['Credit','Debit', 'Reverse Credit'];
          this.type = 'Credit';
        }else if(this.$cookies.get('role') == 'ADMIN'){
          this.typeArr = ['Debit', 'Reverse Credit']
          this.type = 'Debit';
        }
        this.getAllCredit(10, 0);
        this.getAllUser();
    },
    data() {
        return {
            type: '',
            flag: '',
            page_value: 1,
            genres_id: '',
            totalCount: '',
            deleteData: '',
            search_term: '',
            direct_page: '',
            credit_id: '',
            showGrid: true,
            isCreate: false,
            showForm: false,
            isUpdate: false,
            showModal: false,
            usercheck: false,
            checkAmount: false,
            checkType: false,
            timestamp : new Date().getTime(),
            role : this.$cookies.get('role'),
            userlist : [],
            typeArr: [],
            to_user: '',
            amount: '',
            creditList: [],
            isUsershow: false,
        }
    },
    computed: {
        columnList() {
            return [
                { key: 'id', label: 'S.No' },
                { key: 'username', label: 'username' },
                { key: 'amount', label: 'amount' },
                { key: 'balance', label: 'balance' },
                { key: 'type', label: 'Type' },
                { key: 'to_user_name', label: 'Debited From/To' },
                { key: 'createdAt', label: 'TimeStamp' },
                { key: 'userspopup', label: 'User', width: 10 }
            ]
        },
        contentList() {
            return this.creditList
        }
    },
    watch: {
        search_term() {
            if (this.search_term == '') {
                this.getAllCredit(10, 0)
                this.page_value=1;
            } else {
                var num_array = ['0','1','2','3','4','5','6','7','8','9']
                var char_array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['lcn'];
                } else {
                    var array = ['username','type', 'amount', 'to_user_name'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'credit'
                }
                search(payload).then(data => {
                    this.creditList = data.rows.map(item => {
                        item.id = num++
                        return item
                    })
                });
            }
        },
    },
    methods: {
        directPage(limit, offset) {
            this.direct_page = offset.replace(/\D/g, '');
            if (offset == 1 || offset == '') {
                this.page_value = 1;
            } else {
                this.page_value = Math.max((offset * 10) - 9, 1);
            }
            if (this.page_value <= this.totalCount) {
                this.getAllCredit(limit, this.page_value);
            }
        },
        getAllCredit(limit, offset) {
            var num = (offset == 0) ? offset + 1 : offset;
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'credit/' + limit + '/' + offset).then(response => {
                loader.hide();
                this.totalCount = response.data.count;
                this.timestamp = new Date().getTime();
                this.creditList = response.data.rows.map(function (data, index) {
                    data.id = num++;
                    data.createdAt = new Date(data.createdAt).toLocaleString();
                    return data;
                })

            });
        },
        getAllUser() {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'user').then(response => {
                loader.hide();
                this.userlist = response.data.map(function (data, num) {
                    data.id = num++;
                    return data;
                })
            });
        },
        pageModification(type, data) {
            this.search_term = ''
            if (type == 'create') this.title = 'Create Credit';
            else this.title = 'Update Credit';
            this.showForm = true;
             if (type == 'update') {
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.type = data['type'];
                this.credit_id = data['credit_id']
                this.name = data['name'];
//                this.priority = data['priority'];
            } else {
                this.flag = 'Create';
                this.isUpdate = false;
                this.isCreate = true;
            }
        },
        resetForm() {
            this.flag = '';
            this.amount = '';
            this.priority = '',
            this.showForm = false;
            this.checkType = false;
            this.usercheck = false;
            this.checkAmount = false;
            this.getAllCredit(10, 0);
            this.to_user = '';
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
            if(this.$cookies.get('role') == 'SUPER_ADMIN'){
              this.typeArr = ['Credit','Debit', 'Reverse Credit'];
              this.type = 'Credit';
            }else if(this.$cookies.get('role') == 'ADMIN'){
              this.typeArr = ['Debit', 'Reverse Credit'];
              this.type = 'Debit';
            }
        },
        errorCheck() {
        if (
            !this.checkAmount
        ) { return true } else { return false }
        },
        submit(flag) {
            this.checkAmount = (!this.amount) ? true : false;
            this.usercheck = (!this.to_user && (this.type != 'Credit')) ? true : false;        
            if (!this.errorCheck()) return;
            if(this.usercheck){
                return
            }

            var payload = new FormData()
            payload.append('amount', this.amount)
            payload.append('type', this.type)
            payload.append('user_id', this.$cookies.get('user_id'))
            payload.append('username', this.$cookies.get('username'))
            payload.append('from_user_id', this.$cookies.get('user_id'));
            payload.append('from_user_name', this.$cookies.get('username'));

            if (this.type != 'Credit' && this.to_user && typeof this.to_user === 'object') {
                payload.append('to_user_id', this.to_user.user_id);
                payload.append('to_user_name', this.to_user.username);
            } 
         
             // if (this.type && typeof this.type === 'string'){
             //     payload.append('type', this.type); 
             //     payload.append('type', this.type); 
             // }
            
            let requestUrl;
            if (flag == 'Update') {
                payload['credit_id'] = this.credit_id
                requestUrl = this.axios.put(config.host + 'credit/' + this.credit_id, payload);
            } else if (flag == 'Create') {
                requestUrl = this.axios.post(config.host + 'credit/', payload);
            }
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
        },
        userspopup (data) {
            this.isUsershow = true
            this.userData=data
        },
    }
}
</script>
<style>
.error_msg {
    color: #df1f1f;
    margin-left: 0.6rem;
    font-size: 0.8rem;
}

.imagePreviewWrapper {
    width: 200px;
    height: 200px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: cover;
    background-position: center;
}

.cursorPointer {
  cursor: pointer;
}

va-modal {
    color: #ffffff;
}
</style>
  
