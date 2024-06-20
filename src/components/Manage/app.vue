<template>
    <div class="mt-3">
        <div class="pageHeader">Apps</div>
        <div class="pageDesc">List of all Apps</div><br>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search App" />
            </div>
            <div>
                <va-button class="ml-3 createBtn" color="#999999" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>
                    Add
                </va-button>
            </div>
        </div>
        <div>
            <va-data-table class="dataTable mt-4" :items="contentList" :columns="columnList" wrapper-size="1000"
            item-size="46" virtual-scroller>
            
            <template #cell(status)="{ row }">
                <i class="fa fa-check-circle cursorPointer" style="color: green;" v-if="row.rowData.status== 'Finished'" @click="download('app',row.rowData)" height="20"  ></i>
                <i class="fa fa-spinner fa-spin cursorPointer" style="color: blue;" v-if="row.rowData.status== 'Pending'" @click="download('app',row.rowData)" height="20"  ></i>
                <i class="fa fa-times cursorPointer" style="color: red;" v-if="row.rowData.status== 'Errored'" @click="download('app',row.rowData)" height="20"  ></i>
            </template>

            <template #cell(app_download)="{ row }">
                <img src="@/assets/down.png" v-if="row.rowData.status!= 'Pending'" @click="download('app',row.rowData)" height="20"
                    class="cursorPointer" />
            </template>


            <template #cell(edit)="{ row }">
                <img src="@/assets/edit.png" v-if="row.rowData.status!= 'Pending'" @click="pageModification('update', row.rowData)" height="18" class="cursorPointer" />                
            </template>
            <template #cell(delete)="{ row }">
                <img src="@/assets/delete.png" v-if="row.rowData.status!= 'Pending'"  @click="deleteInitiate(row.rowData)" height="20"
                    class="cursorPointer" />
                </template>
            </va-data-table>
            <va-modal style="color: #ffffff;" v-model="showModal" title="Delete App"
                message='Are you sure to delete this App?' okText="DELETE" cancelText="Cancel"
                @ok="deleteZee(deleteData)" blur  />
        </div>
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getAllApp(10, page_value)" />
        </div>
        <div>
            <VueSidePanel v-model="showForm" width="500px" hide-close-btn :panel-duration="1000"
                transition-name="slide-right" no-close>
                <div class="row">
                    <span class="cardTitle">{{ title }}</span>
                    <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
                </div>
                <form class="formView">

                    <span class="va-form-label va-form-required-label">App Name</span>
                    <va-input class="mt-2" v-model.trim="name" type="text" placeholder="Enter App Name"
                        :error="checkName" :disabled="isUpdate" /><br><br>

                    <!-- <span class="va-form-label va-form-required-label">Reseller</span><br>
                    <va-select v-model="reseller" class=" mt-2" text-by="username" clearable clearable-icon="cancel" :options="userlist" searchable placeholder="Select Reseller" :error="resellercheck" track-by="username" :disabled="isUpdate" /><br><br>
 -->
                    <span class="va-form-label va-form-required-label">Authentication URL</span>
                    <va-input class="mt-2" v-model.trim="authentication_url" type="text" placeholder="Enter Authentication URL" :error="checkAuthURL" /><br><br>
                    
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
        this.getAllApp(10, 0);
        // this.getReseller();
    },
    data() {
        return {
            type: '',
            flag: '',
            page_value: 1,
            genres_id: '',
            media_url: '',
            totalCount: '',
            deleteData: '',
            search_term: '',
            direct_page: '',
            app_id: '',
            name: '',
            priority: '',
            showGrid: true,
            isCreate: false,
            showForm: false,
            isUpdate: false,
            showModal: false,
            checkPriority: false,
            checkName: false,
            checkServerIP: false,
            checkType: false,
            timestamp : new Date().getTime(),
            typeLists:[{id:1, type:'Language'},{id:2, type:'Genres'}],
            appList: [],
            contentList : [],
            bannerImageError: false,
            banner_image:[],
            banner_video: [],
            server_ip: '',
            mobile_number: '',
            checkMobileNumber: false,
            bannerVideoError: false,
            appTypeArr: ['Mobile', 'Tv'],
            app_type: 'Mobile',
            reseller: '',
            userlist: [],
            checkAuthURL : false,
            authentication_url: '',
        }
    },
    computed: {
        columnList() {
            return [
                { key: 'id', label: 'S.No' },
                { key: 'name', label: 'App Name' },
                // { key: 'reseller_name', label: 'Reseller Name' },
                // { key: 'app_type', label: 'App Type' },
                // { key: 'status', width: 10, label: 'Status' },
                // { key: 'app_download', width: 10, label: 'App' },
                { key: 'edit', width: 10, label: 'Edit' },
                { key: 'delete', width: 10, label: 'Delete' }
            ]
        },
        contentList() {
            return this.appList
        }
    },
    watch: {
        search_term() {
            if (this.search_term == '') {
                this.getAllApp(10, 0)
                this.page_value=1;
            } else {
                var num_array = ['0','1','2','3','4','5','6','7','8','9']
                var char_array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['lcn'];
                } else {
                    var array = ['channel_name','language', 'genres', 'media_url', 'name'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'app'
                }
                search(payload).then(data => {
                    this.appList = data.rows.map(item => {
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
                this.getAllApp(limit, this.page_value);
            }
        },
        getAllApp(limit, offset) {
            var num = (offset == 0) ? offset + 1 : offset;
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'apps/' + limit + '/' + offset).then(response => {
                loader.hide();
                this.totalCount = response.data.count;
                this.timestamp = new Date().getTime();
                this.appList = response.data.rows.map(function (data, index) {
                    data.id = num++;
                    return data;
                })

            });
        },
        getPendingApp() {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'apps/').then(response => {
                loader.hide();
                this.pendingAppList = response.data
                if(this.pendingAppList.length > 0){
                    return true 
                }else {
                    return false
                }
            });
        },
        download (type, data){
            if(data.status == 'Pending'){
                this.$toast.error("App is in Pending state, unable to download");
            }else{
                const anchor = document.createElement('a')
                anchor.href = data.apk_url
                anchor.target = '_self'
                anchor.click()
                URL.revokeObjectURL(data)
            }
        },
        pageModification(type, data) {
            this.search_term = ''
            if (type == 'create') this.title = 'Create App';
            else this.title = 'Update App';
            this.showForm = true;
             if (type == 'update') {
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.authentication_url = data['authentication_url'];
                this.reseller = data['reseller_name'];
                this.app_id = data['app_id']
                this.name = data['name'];
            } else {
                this.flag = 'Create';
                this.isUpdate = false;
                this.isCreate = true;
            }
        },
        resetForm() {
            this.flag = '';
            this.name = '';
            this.type = '';
            this.priority = '',
            this.showForm = false;
            this.checkPriority = false;
            this.checkType = false;
            this.checkName = false;
            this.getAllApp(10, 0);
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
            this.bannerImageError = false;
            this.banner_image = [];
            this.banner_video = [];
            this.checkAuthURL = false;
            this.authentication_url = '';
            this.mobile_number = '';
            this.checkMobileNumber = false;
            this.bannerVideoError = false;
            this.appTypeArr = ['Mobile', 'Tv'];
            this.app_type = 'Mobile';
            this.reseller = '';
            this.userlist = '';
        },
        errorCheck() {
        if (
            !this.checkName &&
            !this.checkAuthURL 
        ) { return true } else { return false }
        },
        submit(flag) {
            // if(this.getPendingApp()) return this.$toast.error('Other App is in Pending state, pls try after sometime');
            this.checkName = (!this.name) ? true : false;
            this.checkAuthURL = (!this.authentication_url) ? true : false;
        
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('name', this.name)
            payload.append('authentication_url', this.authentication_url)
            
            let requestUrl;
            if (flag == 'Update') {
                payload['app_id'] = this.app_id
                requestUrl = this.axios.put(config.host + 'apps/' + this.app_id, payload);
            } else if (flag == 'Create') {
                requestUrl = this.axios.post(config.host + 'apps/', payload);
            }
            console.log("payload",JSON.stringify(payload))
            const loader = this.$loading.show({ width: 40, height: 40 });
            requestUrl.then(response => {
                console.log(response)
                loader.hide();
                this.resetForm();
                this.$toast.success(response.data);
            }, err => {
                console.log(err)
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
            this.axios.delete(config.host + 'apps/' + data.app_id).then(response => {
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
  
