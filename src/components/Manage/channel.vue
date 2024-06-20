<template>
    <div class="mt-3">
        <div class="pageHeader">Channels</div>
        <div class="pageDesc">View the Channel list</div>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Channels" />
                <va-button v-if="channelList.length > 0" color="#ffffff" class="ml-3 createBtn" @click.prevent="channelStatus()">{{channel_status}}</va-button>

            </div>
            <div>
                <va-button class="ml-3 createBtn" color="#ffffff" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>
                    Add
                </va-button>
                <va-button class="ml-3 createBtn" color="#ffffff" @click="importFile()">
                    <i class="fas fa-file-upload" style=" margin-right:10px;"></i>
                    Import
                </va-button>
                <va-button class="ml-3 createBtn" color="#ffffff" @click="deleteBulk()">
                    <i class="fas fa-file-upload" style=" margin-right:10px;"></i>
                    Delete
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
        <va-modal class="popup" v-model="showModal" title="Delete Channels"
            message='Are you sure to delete this Channel?' okText="DELETE" cancelText="Cancel"
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
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getChannel(10, page_value)" />
        </div> -->
        <VueSidePanel class="sidePanel" v-model="showForm" width="500px" hide-close-btn :panel-duration="700"
            transition-name="slide-right" no-close>
            <div class="row">
                <span class="cardTitle">{{ title }} </span>
                <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
            </div>
            <form class="formView">
                <div class="orgcard">
                    <span class="va-form-label va-form-required-label">Channel Name</span><br>
                    <va-input class="mt-2" v-model.trim="name" placeholder="Enter Channel Name" :error="nameCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br>
                    <span class="va-form-label">LCN</span><br>
                    <va-input class="mt-2" v-model.trim="lcn" placeholder="Enter LCN"
                        :error="lcnCheck" /><br><br>
                
                      <span class="va-form-label va-form-required-label">Language</span><br>
                    <va-select v-model="language" class=" mt-2" text-by="name" clearable
                        clearable-icon="cancel" :options="languageCategoryList" searchable placeholder="Select Language"
                        :error="languageCheck" track-by="model" /><br><br>

                    <span class="va-form-label va-form-required-label">Genres</span><br>
                    <va-select v-model="genres" class=" mt-2" text-by="name" clearable clearable-icon="cancel" :options="genresCategoryList" searchable placeholder="Select Genres" :error="genreCheck" track-by="id" /><br><br> 
                    <!-- <div v-if="isCreate"> -->
                    <span class="va-form-label va-form-required-label">URL</span><br>
                    <va-input class="mt-2" v-model.trim="url" placeholder="Enter URL" :error="urlCheck" oninput="event.target.value = event.target.value;" /><br><br>

                    <span class="va-form-label va-form-required-label">Image URL</span><br>
                    <va-input class="mt-2" v-model.trim="image_url" placeholder="Enter Image URL" :error="imageUrlCheck" oninput="event.target.value = event.target.value;" /><br><br>
                    <!-- </div> -->
            
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
        this.getChannel(10, 0);
        this.getCategory();
    },
    data() {
        return {
            flag: '',
            name: '',
            order: '',
            language:'',
            genres: '',
            channel_id: '',
            totalCount: '',
            page_value: 1,
            direct_page: '',
            search_term: '',
            url: '',
            image_url: '',
            lcn: '',
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
            lcnCheck: false,
            timestamp : new Date().getTime(),
            importData: [],
            fileError: '',
            channel_status: 'Select All',
        }
    },
    computed: {
        columnList() {
            return [
                { key: 'id', label: 'S.No' },
                { key: 'checkbox', label: ' ' },
                { key: 'name', label: 'Channel Name' },
                { key: 'lcn', label: 'LCN' },
                { key: 'language', label: 'Language' },
                { key: 'genres', label: 'Genres' },
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
                 this.getChannel(10, 0)
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
                    'type': 'channel'
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
        channelStatus(){
            this.channel_status = (this.channel_status == 'Select All') ? 'Unselect All' : 'Select All';
            this.channelList.map(item => item.select = (item.select) ? false : true);
        },
        downloadFormat () {
          this.cancelImport()
            var rowKeys = {
                name: 'Channel Name',
                lcn: 'LCN',
                language: 'Language',
                genres: 'Geners',
                url: 'URL',
                image_url: 'Image URL'
            }
          var channel_list = []
          exportToFile([], rowKeys, 'Channel', 'CSV')
        },
        cancelImport () {
            this.showImportModal = false
            this.make_import = false
            this.importData = []
        },
        deleteBulk() {
            var array = [];
            this.channelList.map(i=>{ if(i.select) array.push(i.channel_id) });
            if(array.length == 0){
                return this.$toast.error("Select atleast one channel!");
            }
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.post(config.host + 'channel/deleteBulk',{channel_id:array}).then(response=> {
                loader.hide();
                this.getChannel(10, 0)
                this.$toast.success(response.data);
            },err=>{
                loader.hide();
                this.$toast.error(err.response.data);
            })
        },
        createBulkChannels (){
            var ref = this;
            var payload = new FormData()
            console.log((this.importData[0]))
            payload.append('importData', this.importData[0]);
            const loader = this.$loading.show({ width: 40, height: 40 });
            var requesturl = ref.axios.post(config.host + 'channel/bulk', payload);
              requesturl.then(response => {
                 loader.hide();
                ref.resetForm();
                ref.$toast.success(response.data);
            }, err => {
                 loader.hide();
                 ref.resetForm();
                 ref.$toast.error(err.response.data);
            });

        },
        directPage(limit, offset) {
            this.direct_page = offset.replace(/\D/g, '');
            if (offset == 1 || offset == '') {
                this.page_value = 1;
            } else {
                this.page_value = Math.max((offset * 10) - 9, 1);
            }
            if (this.page_value <= this.totalCount) {
                this.getChannel(limit, this.page_value);
            }
        },
        getChannel(limit, offset) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'channel/').then(response => {
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
            if (type == 'create') this.title = 'Create Channel';
            else this.title = 'Update Channel';
            this.showForm = true;
            if (type == 'update') {
                if (data.image || data.apk) {
                    this.old_apk = data.apk;
                    this.appimageUrl = data.image;
                    var image_Url = data.image.replace(/https:\/\/assets.web.tv\/|\/\?.*/g, '').split('?')[0];
                    this.imageUrl = 'https://assets.web.tv/' + data.apk
                    this.old_image = image_Url
                }
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.name = data['name'];
                this.language = data['language'];
                this.genres = data['genres'];
                this.channel_id = data['channel_id'];
                this.lcn = data['lcn'];
                this.image_url = data['image_url'];
                this.url = data['url'];
            } else {
                this.flag = 'Create';
                this.isCreate = true;
                this.isUpdate = false;
            }
        },
        resetForm() {
            this.fileError = '';
            this.flag = '';
            this.name = '';
            this.lcn = '';
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
            this.lcnCheck = false;
            this.getChannel(10,0);
            this.getCategory();
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
        },
        errorCheck() {
            if (
                !this.nameCheck &&
//                !this.lcnCheck &&
                !this.genreCheck &&
                !this.languageCheck &&
                !this.urlCheck &&
                !this.imageUrlCheck
            ) { return true } else { return false }
        },
        submit(flag) {
            this.nameCheck = (!this.name) ? true : false;
            this.urlCheck = (!this.url) ? true : false;
            this.imageUrlCheck = (!this.image_url) ? true : false;
            this.languageCheck = (!this.language) ? true : false;
            this.genreCheck = (!this.genres) ? true : false;
            this.versionCheck = (!this.version) ? true : false;
//            this.lcnCheck = (!this.lcn) ? true : false;
        
        console.log("check",this.errorCheck(), this.lcn)
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('name', this.name)
            payload.append('lcn', this.lcn)
            payload.append('url', this.url)
            payload.append('image_url', this.image_url)

            if (this.genres && typeof this.genres === 'object') {
                payload.append('genres', this.genres.name);
            } 
            if (this.genres && typeof this.genres === 'string'){
                payload.append('genres', this.genres); 
            }

            if (this.language && typeof this.language === 'object') {
                payload.append('language', this.language.name);
            } 
            if (this.language && typeof this.language === 'string'){
                payload.append('language', this.language); 
            }

            if (flag == 'Create') {
                var requestUrl = this.axios.post(config.host + 'channel/', payload);
            } else {
                payload['channel_id'] = this.channel_id
                var requestUrl = this.axios.put(config.host + 'channel/' + this.channel_id, payload);
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
        deleteInitiate(data) {
            this.showModal = true;
            this.deleteData = data;
        },
        deleteEntity(data) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.delete(config.host + 'channel/' + data.channel_id).then(response => {
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
