<template>
    <div class="mt-3">
        <div class="pageHeader">Movies</div>
        <div class="pageDesc">View the Movie list</div>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Ott" />
                <va-button v-if="ottList.length > 0" color="#ffffff" class="ml-3 createBtn" @click.prevent="ottStatus()">{{ott_status}}</va-button>

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
        <va-modal class="popup" v-model="showModal" title="Delete Ott"
            message='Are you sure to delete this Ott?' okText="DELETE" cancelText="Cancel"
            @ok="deleteEntity(deleteData)" blur />

            <va-modal class="popup" v-model="showImportModal" title="File Upload"  okText="Import" cancelText="Cancel" @ok="createBulkOtt()">
                <!-- <va-button @click="makeImport()">Upload</va-button> -->
                <va-file-upload v-model="importData" dropzone  color="#b4131e" />
                <span class="mt-2 error_msg" v-if="fileError">{{ fileError }}</span>
                    <br v-if="fileError">
                 <a class="download_script" href="#" style="margin-left: 40px; margin-top: 8px;"  @click="downloadFormat()">Download Format</a>
            </va-modal>
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getOtt(10, page_value)" />
        </div>
        <VueSidePanel class="sidePanel" v-model="showForm" width="500px" hide-close-btn :panel-duration="700"
            transition-name="slide-right" no-close>
            <div class="row">
                <span class="cardTitle">{{ header }} </span>
                <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
            </div>
            <form class="formView">
                <div class="orgcard">
                    <span class="va-form-label va-form-required-label">Ott Title</span><br>
                    <va-input class="mt-2" v-model.trim="title" placeholder="Enter Ott Title" :error="titleCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br>
                    <!-- <span class="va-form-label">LCN</span><br>
                    <va-input class="mt-2" v-model.trim="lcn" placeholder="Enter LCN"
                        :error="lcnCheck" /><br><br> -->
                
                      <span class="va-form-label va-form-required-label">Language</span><br>
                    <va-select v-model="language" class=" mt-2" text-by="name" clearable
                        clearable-icon="cancel" :options="languageCategoryList" searchable placeholder="Select Language"
                        :error="languageCheck" track-by="model" /><br><br>

                    <span class="va-form-label va-form-required-label">Genre</span><br>
                    <va-select v-model="genre" class=" mt-2" text-by="name" clearable clearable-icon="cancel" :options="genreCategoryList" searchable placeholder="Select Genre" :error="genreCheck" track-by="id" /><br><br> 
                    <div v-if="isCreate">
                    <span class="va-form-label va-form-required-label">Media URL</span><br>
                    <va-input class="mt-2" v-model.trim="media_url" placeholder="Enter URL" :error="mediaUrlCheck" oninput="event.target.value = event.target.value;" /><br><br>

                    <span class="va-form-label va-form-required-label">Horizontal URL</span><br>
                    <va-input class="mt-2" v-model.trim="horizontal_url" placeholder="Enter Horizontal URL" :error="horizontalUrlCheck" oninput="event.target.value = event.target.value;" /><br><br>
                    
                    <span class="va-form-label va-form-required-label">Vertical URL</span><br>
                    <va-input class="mt-2" v-model.trim="vertical_url" placeholder="Enter Vertical URL" :error="verticalUrlCheck" oninput="event.target.value = event.target.value;" /><br><br>
                    
                    </div>
            
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
        this.getOtt(10, 0);
        this.getCategory();
    },
    data() {
        return {
            flag: '',
            title: '',
            order: '',
            language:'',
            genre: '',
            ott_id: '',
            totalCount: '',
            page_value: 1,
            direct_page: '',
            search_term: '',
            media_url: '',
            horizontal_url: '',
            vertical_url: '',
            lcn: '',
            languageCategoryList:[],
            genreCategoryList:[],
            ottList: [],
            previewImage: null,
            apppreviewImage: null,
            showForm: false,
            isCreate: false,
            isUpdate: false,
            showModal: false,
            showImportModal: false,
            titleCheck: false,
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
            ott_status: 'Select All',
            header: '',
            horizontalUrlCheck: false,
            verticalUrlCheck: false,
        }
    },
    computed: {
        columnList() {
            return [
                // { key: 'id', label: 'S.No' },
                { key: 'checkbox', label: ' ' },
                { key: 'title', label: 'Title' },
                { key: 'language', label: 'Language' },
                { key: 'genre', label: 'Genre' },
                { key: 'edit', width: 10, label: 'Edit' },
                { key: 'delete', width: 10, label: 'Delete' }
            ]
        },
        contentList() {
            return this.ottList
        }
    },
    watch: {

        search_term() {
            if (this.search_term == '') {
                 this.getOtt(10, 0)
                 this.page_value=1;
            } else {
                var num_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                var char_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['title', 'language', 'genre', 'horizontal_url', 'vertical_url', 'media_url'];
                } else {
                    var array = ['title', 'language', 'genre', 'horizontal_url', 'vertical_url', 'media_url'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'ott'
                }
                search(payload).then(data => {
                    this.ottList = data.rows.map(item => {
                        item.id = num++
                        return item
                    })
                });
            }
        },
    },
    methods: {
        ottStatus(){
            this.ott_status = (this.ott_status == 'Select All') ? 'Unselect All' : 'Select All';
            this.ottList.map(item => item.select = (item.select) ? false : true);
        },
        downloadFormat () {
          this.cancelImport()
            var rowKeys = {
                title: 'title',
                language: 'language',
                genre: 'genre',
                media_url: 'media_url',
                horizontal_url : 'horizontal_url',
                vertical_url: 'vertical_url',
            }
          var ott_list = []
          exportToFile([], rowKeys, 'Ott', 'CSV')
        },
        cancelImport () {
            this.showImportModal = false
            this.make_import = false
            this.importData = []
        },
        deleteBulk() {
            var array = [];
            this.ottList.map(i=>{ if(i.select) array.push(i.ott_id) });
            if(array.length == 0){
                return this.$toast.error("Select atleast one ott!");
            }
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.post(config.host + 'ott/deleteBulk',{ott_id:array}).then(response=> {
                loader.hide();
                this.getOtt(10, 0)
                this.$toast.success(response.data);
            },err=>{
                loader.hide();
                this.$toast.error(err.response.data);
            })
        },
        createBulkOtt (){
            var ref = this;
            var payload = new FormData()
            console.log((this.importData[0]))
            payload.append('importData', this.importData[0]);
            const loader = this.$loading.show({ width: 40, height: 40 });
            var requesturl = ref.axios.post(config.host + 'ott/bulk', payload);
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
            this.ott_status = 'Select All'
            this.direct_page = offset.replace(/\D/g, '');
            if (offset == 1 || offset == '') {
                this.page_value = 1;
            } else {
                this.page_value = Math.max((offset * 10) - 9, 1);
            }
            if (this.page_value <= this.totalCount) {
                this.getOtt(limit, this.page_value);
            }
        },
        getOtt(limit, offset) {
            this.ott_status = 'Select All'
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'ott/'+ limit + '/' + offset).then(response => {
                loader.hide();
                this.totalCount = response.data.count
                let num = (offset == 0) ? offset + 1 : offset;
                this.timestamp = new Date().getTime();
                this.ottList = response.data.rows.map(function (data, num) {
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
                    console.log("al.type",val.type)
                    val.id = i+1
                    if(val.type == 'Language'){
                        vm.languageCategoryList.push(val)
                    }else{
                        vm.genreCategoryList.push(val)
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
            if (type == 'create') this.header = 'Create Ott';
            else this.header = 'Update Ott';
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
                this.title = data['title'];
                this.language = data['language'];
                this.genre = data['genre'];
                this.ott_id = data['ott_id'];
                this.lcn = data['lcn'];
                this.horizontal_url = data['horizontal_url'];
                this.vertical_url = data['vertical_url'];
                this.media_url = data['media_url'];
            } else {
                this.flag = 'Create';
                this.isCreate = true;
                this.isUpdate = false;
            }
        },
        resetForm() {
            this.fileError = '';
            this.flag = '';
            this.title = '';
            this.lcn = '';
            this.language = '';
            this.genre = '';
            this.media_url = '';
            this.horizontal_url = '';
            this.vertical_url = '';
            this.showForm = false;
            this.titleCheck = false;
            this.imageUrlCheck = false;
            this.languageCheck =false;
            this.showImportModal = false;
            this.genreCheck = false;
            this.mediaUrlCheck = false;
            this.lcnCheck = false;
            this.getOtt(10,0);
            this.getCategory();
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
        },
        errorCheck() {
            if (
                !this.titleCheck &&
                !this.genreCheck &&
                !this.languageCheck &&
                !this.mediaUrlCheck &&
                !this.imageUrlCheck
            ) { return true } else { return false }
        },
        submit(flag) {
            this.titleCheck = (!this.title) ? true : false;
            this.mediaUrlCheck = (!this.media_url) ? true : false;
            this.horizontalUrlCheck = (!this.horizontal_url) ? true : false;
            this.verticalUrlCheck = (!this.vertical_url) ? true : false;
            this.languageCheck = (!this.language) ? true : false;
            this.genreCheck = (!this.genre) ? true : false;
            this.versionCheck = (!this.version) ? true : false;
//            this.lcnCheck = (!this.lcn) ? true : false;
        
        console.log("check",this.errorCheck(), this.lcn)
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('title', this.title)
            payload.append('media_url', this.media_url)
            payload.append('horizontal_url', this.horizontal_url)
            payload.append('vertical_url', this.vertical_url)

            if (this.genre && typeof this.genre === 'object') {
                payload.append('genre', this.genre.name);
            } 
            if (this.genre && typeof this.genre === 'string'){
                payload.append('genre', this.genre); 
            }

            if (this.language && typeof this.language === 'object') {
                payload.append('language', this.language.name);
            } 
            if (this.language && typeof this.language === 'string'){
                payload.append('language', this.language); 
            }

            if (flag == 'Create') {
                var requestUrl = this.axios.post(config.host + 'ott/', payload);
            } else {
                payload['ott_id'] = this.ott_id
                var requestUrl = this.axios.put(config.host + 'ott/' + this.ott_id, payload);
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
            this.axios.delete(config.host + 'ott/' + data.ott_id).then(response => {
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
