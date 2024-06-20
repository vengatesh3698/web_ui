<template>
    <div class="mt-3">
        <div class="pageHeader">App</div>
        <div class="pageDesc">View the App list</div>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search App" />

            </div>
            <div>
                <va-button class="ml-3 createBtn" color="#ffffff" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>
                    Add
                </va-button>
            </div>
        </div>
        <va-data-table class="dataTable mt-4 " :items="contentList" :columns="columnList" wrapper-size="380" item-size="46"
          virtual-scroller sticky-header>
            <template #cell(checkbox)="{ row }">
                <va-checkbox v-model="row.rowData.select" color="#000000" />                    
            </template>
            <template #cell(edit)="{ row }">
                <img src="@/assets/edit.png" @click="pageModification('update', row.rowData)" height="18"
                    class="cursorPointer" />
            </template>
            <template #cell(delete)="{ row }">
                <img src="@/assets/delete.png" @click="deleteInitiate(row.rowData)" height="18" class="cursorPointer" />
            </template>
        </va-data-table>
        <va-modal class="popup" v-model="showModal" title="Delete App"
            message='Are you sure to delete this App?' okText="DELETE" cancelText="Cancel"
            @ok="deleteEntity(deleteData)" blur />

            <va-modal class="popup" v-model="showImportModal" title="File Upload"  okText="Import" cancelText="Cancel" @ok="createBulkChannels()">
                <!-- <va-button @click="makeImport()">Upload</va-button> -->
                <va-file-upload v-model="importData" dropzone  color="#b4131e" />
                <span class="mt-2 error_msg" v-if="fileError">{{ fileError }}</span>
                    <br v-if="fileError">
                 <a class="download_script" href="#" style="margin-left: 40px; margin-top: 8px;"  @click="downloadFormat()">Download Format</a>
            </va-modal>
        <!-- <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getAppupdate(10, page_value)" />
        </div> -->
        <VueSidePanel class="sidePanel" v-model="showForm" width="500px" hide-close-btn :panel-duration="700"
            transition-name="slide-right" no-close>
            <div class="row">
                <span class="cardTitle">{{ title }} </span>
                <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
            </div>
            <form class="formView">
                <div class="orgcard">
                    <span class="va-form-label va-form-required-label">App Name</span><br>
                    <va-input class="mt-2" v-model.trim="name" placeholder="Enter App Name" :error="nameCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br>
                    <span class="va-form-label">Version</span><br>
                    <va-input class="mt-2" v-model.trim="version" placeholder="Enter Version"
                        :error="versionCheck" /><br><br>

                    <span class="va-form-label va-form-required-label">APK</span>
                    <va-file-upload v-model="apk" dropzone file-types="image/*" accept="image/*" color="#b4131e" />
                    <span class="mt-2 error_msg" v-if="apkError">{{ apkError }}</span>
                    <br v-if="apkError">
                    <va-button class="mt-4 form_button" @click="submit(flag)" color="#ffffff">{{ flag }}</va-button>
                </div>
            </form>
        </VueSidePanel>
    </div>
</template>

<script>
import config from '@/router/config.json';
import { search } from '@/module/Search.js';
import { exportToFile } from '@/module/exportFile.js';

export default {
    created() {
        this.getAppupdate(10, 0);
        this.getCategory();
    },
    data() {
        return {
            flag: '',
            name: '',
            order: '',
            language:'',
            genres: '',
            app_id: '',
            totalCount: '',
            page_value: 1,
            direct_page: '',
            search_term: '',
            url: '',
            image_url: '',
            version: '',
            languageCategoryList:[],
            genresCategoryList:[],
            channelList: [],
            previewImage: null,
            apppreviewImage: null,
            showForm: false,
            isCreate: false,
            isUpdate: false,
            showModal: false,
            showImportModal: false,
            nameCheck: false,
            versionCheck:false,
            imageView: false,
            appimgview: false,
            orderCheck: false,
            select: false,
            languageCheck:false,
            genreCheck: false,
            versionCheck: false,
            timestamp : new Date().getTime(),
            importData: [],
            fileError: '',
            channel_status: 'Select All',
            apkError: false,
            apk: [],
        }
    },
    computed: {
        columnList() {
            return [
                { key: 'name', label: 'App Name' },
                { key: 'version', label: 'Version' },
                { key: 'edit', width: 10, label: 'Edit' },
                { key: 'delete', width: 10, label: 'Delete' }
            ]
        },
        contentList() {
            return this.channelList
        }
    },
    watch: {
        search_term() {
            if (this.search_term == '') {
                 this.getAppupdate(10, 0)
                 this.page_value=1;
            } else {
                var num_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                var char_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['name', 'image_url', 'url'];
                } else {
                    var array = ['name', 'image_url', 'url'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'appupdate'
                }
                search(payload).then(data => {
                    this.channelList = data.rows.map(item => {
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
                this.getAppupdate(limit, this.page_value);
            }
        },
        getAppupdate(limit, offset) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'appupdate/').then(response => {
                loader.hide();
                // this.totalCount = response.data.count
                // let num = (offset == 0) ? offset + 1 : offset;
                this.timestamp = new Date().getTime();
                this.channelList = response.data.map(function (data, num) {
                    data.id = num++;
                    data.select = false;
                    return data;
                })
            });
        },
        getCategory(){
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'category').then(resp => {
                var vm = this
                resp.data.map(function (val, i) {
                    val.id = i+1
                    if(val.type == 'Language'){
                        vm.languageCategoryList.push(val)
                    }else{
                        vm.genresCategoryList.push(val)
                    }
                })
            });
            loader.hide();
          },function(err){
            loader.hide();
            this.$toast.error(err.response.data);
        },
        importFile (){
            this.importData = [];
            this.showImportModal = true;
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
                this.name = data['name'];
                this.apk = []
                this.app_id = data['app_id'];
                this.version = data['version'];
               
            } else {
                this.flag = 'Create';
                this.isCreate = true;
                this.isUpdate = false;
                this.apk = []
            }
        },
        resetForm() {
            this.apkError = false
            this.fileError = '';
            this.flag = '';
            this.name = '';
            this.version = '';
            this.language = '';
            this.genres = '';
            this.url = '';
            this.image_url = '';
            this.showForm = false;
            this.nameCheck = false;
            this.imageUrlCheck = false;
            this.languageCheck =false;
            this.showImportModal = false;
            this.genreCheck = false;
            this.urlCheck = false;
            this.versionCheck = false;
            this.getAppupdate(10,0);
            this.getCategory();
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
        },
        errorCheck() {
            if (
                !this.nameCheck &&
                !this.versionCheck 
            ) { return true } else { return false }
        },
        submit(flag) {
            this.nameCheck = (!this.name) ? true : false;
            this.versionCheck = (!this.version) ? true : false;
            console.log("this.nameCheck",this.nameCheck,"this.versionCheck",this.versionCheck)
            this.apkError = (!this.apk[0] && this.isCreate) ? 'Upload APK' : false;
//            this.versionCheck = (!this.version) ? true : false;
        
        console.log("check",this.errorCheck(), this.version)
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('name', this.name)
            payload.append('version', this.version)
            if (this.isCreate || this.isUpdate) {
                payload.append('apk', this.apk[0])
            }

            if (flag == 'Create') {
                var requestUrl = this.axios.post(config.host + 'appupdate/', payload);
            } else {
                payload['app_id'] = this.app_id
                var requestUrl = this.axios.put(config.host + 'appupdate/' + this.app_id, payload);
            } 
console.log("requestUrl",requestUrl)
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
        deleteInitiate(data) {
            this.showModal = true;
            this.deleteData = data;
        },
        deleteEntity(data) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.delete(config.host + 'appupdate/' + data.app_id).then(response => {
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

</style>>
