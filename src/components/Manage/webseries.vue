<template>
    <div class="mt-3">
        <div class="pageHeader">Webseries</div>
        <div class="pageDesc">View the Webseries list</div>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Webseries" />
                <va-button v-if="webSeriesList.length > 0" color="#ffffff" class="ml-3 createBtn" @click.prevent="ottStatus()">{{ott_status}}</va-button>

            </div>
            <div>
                <va-button class="ml-3 createBtn" color="#ffffff" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>
                    Add
                </va-button>
                <!-- <va-button class="ml-3 createBtn" color="#ffffff" @click="importFile()">
                    <i class="fas fa-file-upload" style=" margin-right:10px;"></i>
                    Import
                </va-button> -->
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
        <va-modal class="popup" v-model="showModal" title="Delete Webseries"
            message='Are you sure to delete this Webseries?' okText="DELETE" cancelText="Cancel"
            @ok="deleteEntity(deleteData)" blur />

        <va-modal class="popup" v-model="showImportModal" title="File Upload"  okText="Import" cancelText="Cancel" @ok="createBulkOtt()">
            <!-- <va-button @click="makeImport()">Upload</va-button> -->
            <va-file-upload v-model="importData" dropzone  color="#b4131e" />
            <span class="mt-2 error_msg" v-if="fileError">{{ fileError }}</span>
                <br v-if="fileError">
                <a class="download_script" href="#" style="margin-left: 40px; margin-top: 8px;"  @click="downloadFormat()">Download Format</a>
        </va-modal>
        <!-- <va-modal class="popup" v-model="showSeasonModal" title="Season Details"  okText="Save" cancelText="Cancel" @ok="submitSeason()"> -->
            <va-modal
            class="popup"
              v-model="showSeasonModal"
              size="large"
              noEscDismiss
              noOutsideDismiss
              okText="Save"
              cancelText="Cancel"
              @ok="submitSeason()"
              @cancel="cancel()"
            >
            <!-- <va-button @click="makeImport()">Upload</va-button> -->
            <span style="font-size: 21px;"><b>Season Details</b>
                <!-- <br><span style="font-size: 15px;">Note : Cost Price (Exclusive of GST)</span> -->
              </span>
              <slot style="margin: 50px;">
                <div class="va-table">
                  <table style="width: 100%;" class="va-table-responsive">
                    <thead>
                      <tr>
                        <th class="content-th">Season Name</th>
                        <th class="content-th">Season Number</th>
                        <th class="content-th">Episode Title</th>
                        <th class="content-th">Episode Number</th>
                        <th class="content-th">Image</th>
                        <th class="content-th">Media URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(field,i) in web_episodes" :key="field.id">
                        <td >
                          <va-input
                            placeholder="Season Name"
                            type="text"
                            v-model="field.season_name"
                          />
                        </td>
                        <td >
                          <va-input
                            placeholder="Season Number"
                            type="text"
                            v-model="field.season_number"
                          />
                        </td>
                        <td>
                            <va-input
                                placeholder="Episode Name"
                                type="text"
                                v-model="field.episode_title"
                            />
                        </td>
                        <td>
                          <va-input
                            placeholder="Episode Number"
                            type="text"
                            v-model="field.episode_number"
                          />
                        </td>
                        <td>
                            <va-input
                                placeholder="Image"
                                type="text"
                                v-model="field.image"
                            />
                        </td>
                        <td>
                            <va-input
                                placeholder="Media URL"
                                type="text"
                                v-model="field.media_url"
                            />
                        </td>
                        <td>
                          <va-button
                            v-if="!check_active_web_episodes"
                            class="content_width "
                            flat color="danger"
                            @click.prevent="removeField(i, 'web_episodes')"
                          ><i class="fa fa-remove"></i></va-button>
                        </td>
                        <td>
                          <va-button
                            v-if="web_episodes.length"
                            class="content_width "
                            flat color="primary"
                            @click.prevent="webEpisodes_length++"
                          ><i class="fa fa-plus"></i></va-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </slot>
            
        </va-modal>

        
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getWeb(10, page_value)" />
        </div>
        <VueSidePanel class="sidePanel" v-model="showForm" width="500px" hide-close-btn :panel-duration="700"
            transition-name="slide-right" no-close>
            <div class="row">
                <span class="cardTitle">{{ header }} </span>
                <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
            </div>
            <form class="formView">
                <div class="orgcard">
                    <span class="va-form-label va-form-required-label">Title</span><br>
                    <va-input class="mt-2" v-model.trim="title" placeholder="Enter Title" :error="titleCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br>
                    
                    <span class="va-form-label va-form-required-label">Vertical Image</span><br>
                    <va-input class="mt-2" v-model.trim="vertical_image" placeholder="Enter Vertical Image" :error="verticalCheck"/><br><br>

                    <span class="va-form-label va-form-required-label">Horizontal Image</span><br>
                    <va-input class="mt-2" v-model.trim="horizontal_image" placeholder="Enter Horizontal Image" :error="horizontalCheck" /><br><br>
                    <!-- <span class="va-form-label">LCN</span><br>
                    <va-input class="mt-2" v-model.trim="lcn" placeholder="Enter LCN"
                        :error="lcnCheck" /><br><br> -->
                
                      <span class="va-form-label va-form-required-label">Language</span><br>
                    <va-select v-model="language" class=" mt-2" text-by="name" clearable
                        clearable-icon="cancel" :options="languageCategoryList" searchable placeholder="Select Language"
                        :error="languageCheck" track-by="model" /><br><br>

                    <span class="va-form-label va-form-required-label">Genre</span><br>
                    <va-select v-model="genre" class=" mt-2" text-by="name" clearable clearable-icon="cancel" :options="genreCategoryList" searchable placeholder="Select Genre" :error="genreCheck" track-by="id" /><br><br> 
                    <va-button class="mt-4 " @click="selectSeason()" color="#ffffff">Seasons</va-button>
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
        this.getWeb(10, 0);
        this.getCategory();
    },
    data() {
        return {
            flag: '',
            title: '',
            order: '',
            language:'',
            genre: '',
            web_id: '',
            totalCount: '',
            page_value: 1,
            direct_page: '',
            search_term: '',
            media_url: '',
            horizontal_image: '',
            vertical_image: '',
            lcn: '',
            languageCategoryList:[],
            genreCategoryList:[],
            webSeriesList: [],
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
            horizontalCheck: false,
            verticalCheck: false,
            showSeasonModal: false,
            web_episodes: [{
                season_name: '',
                season_number: '',
                episode_number: '',
                episode_title: '',
                image: '',
                media_url: '',
            }],
            webEpisodes_length: 0,
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
            return this.webSeriesList
        }
    },
    watch: {
        webEpisodes_length () {
            // var arr = []; var final = []
            // this.PreActivationBundleArr = this.pre_activation_backup
            // arr = this.pre_activation.map(function (data) {
            //     if ((data != '') && (data.bundle_name != '') && data.bundle_name.bundle_name && !data.removed_flag) {
            //     return data.bundle_name.bundle_name
            //     };
            // })
            // this.PreActivationBundleArr.map(function (bundle) {
            //     if (arr.indexOf(bundle.bundle_name) == -1) {
            //     final.push(bundle)
            //     };
            // })
            // this.PreActivationBundleArr = final
            this.web_episodes.push({
                season_name: '',
                season_number: '',
                episode_title: '',
                episode_number: '',
                image: '',
                media_url: ''
            })
            // this.checkRemoval()
        },
        search_term() {
            if (this.search_term == '') {
                 this.getWeb(10, 0)
                 this.page_value=1;
            } else {
                var num_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                var char_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['title', 'language', 'genre', 'horizontal_image', 'vertical_image'];
                } else {
                    var array = ['title', 'language', 'genre', 'horizontal_image', 'vertical_image'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'webseries'
                }
                search(payload).then(data => {
                    this.webSeriesList = data.rows.map(item => {
                        item.id = num++
                        return item
                    })
                });
            }
        },
    },
    methods: {
        removeField (index, type) {
            if(this.web_episodes.length > 1) {
                this.web_episodes = this.web_episodes.filter((_field, i) => i != index)
            }
        },
        ottStatus(){
            this.ott_status = (this.ott_status == 'Select All') ? 'Unselect All' : 'Select All';
            this.webSeriesList.map(item => item.select = (item.select) ? false : true);
        },
        submitSeason(){
            var vm = this
            var array = this.web_episodes;
            for (let index = 0; index < array.length; index++) {
                var map = array[index];
                if (map.season_name == '' || map.season_number == '' || map.episode_number == '' || map.episode_title == '' || map.image == '' || map.media_url == '')  {
                    vm.$toast.error("Fill the form correctly");
                    vm.showForm = false
                     vm.showSeasonModal = true
                     break;
                } else {
                    vm.showSeasonModal = false
                    vm.showForm = true
                }
                
            }
            // this.web_episodes.map(function (map) {
            //     if (map.season_name == '' || map.season_number == '' || map.episode_number == '' || map.episode_title == '' || map.image == '' || map.media_url == '')  {
            //         vm.$toast.error("Fill the form correctly");
            //         vm.showForm = false
            //         return vm.showSeasonModal = true
            //     } else {
            //         vm.showSeasonModal = false
            //         vm.showForm = true
            //     }
            // })
        },
        downloadFormat () {
          this.cancelImport()
            var rowKeys = {
                title: 'Webseries Title',
                lcn: 'LCN',
                language: 'Language',
                genre: 'Geners',
                media_url: 'Media URL',
                horizontal_image: 'Horizontal URL',
                vertical_image: 'Vertical URL',
            }
          var ott_list = []
          exportToFile([], rowKeys, 'Webseries', 'CSV')
        },
        cancelImport () {
            this.showImportModal = false
            this.make_import = false
            this.importData = []
        },
        deleteBulk() {
            var array = [];
            this.webSeriesList.map(i=>{ if(i.select) array.push(i.web_id) });
            if(array.length == 0){
                return this.$toast.error("Select atleast one webseries!");
            }
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.post(config.host + 'webseries/deleteBulk',{web_id:array}).then(response=> {
                loader.hide();
                this.getWeb(10, 0)
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
            var requesturl = ref.axios.post(config.host + 'webseries/bulk', payload);
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
                this.getWeb(limit, this.page_value);
            }
        },
        getWeb(limit, offset) {
            this.ott_status = 'Select All'
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'webseries/'+ limit + '/' + offset).then(response => {
                loader.hide();
                this.totalCount = response.data.count
                let num = (offset == 0) ? offset + 1 : offset;
                this.timestamp = new Date().getTime();
                this.webSeriesList = response.data.rows.map(function (data, num) {
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
            if (type == 'create') this.header = 'Create Webseries';
            else this.header = 'Update Webseries';
            this.showForm = true;
            if (type == 'update') {
                if (data.image || data.apk) {
                    this.old_apk = data.apk;
                    this.appimageUrl = data.image;
                    this.old_image = image_Url
                }
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.title = data['title'];
                this.language = data['language'];
                this.genre = data['genre'];
                this.web_id = data['web_id'];
                this.title = data['title'];
                this.horizontal_image = data['horizontal_image'];
                this.vertical_image = data['vertical_image'];
                this.web_episodes = data['web_episodes'];
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
            this.horizontal_image = '';
            this.vertical_image = '';
            this.showForm = false;
            this.titleCheck = false;
            this.imageUrlCheck = false;
            this.languageCheck =false;
            this.showImportModal = false;
            this.genreCheck = false;
            this.mediaUrlCheck = false;
            this.lcnCheck = false;
            this.getWeb(10,0);
            this.getCategory();
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
            this.showSeasonModal = false;
            this.web_episodes = [{
                season_name: '',
                season_number: '',
                episode_number: '',
                episode_title: '',
                image: '',
                media_url: '',
            }]
        },
        errorCheck() {
            if (
                !this.titleCheck &&
                !this.genreCheck &&
                !this.languageCheck &&
                !this.horizontalCheck && 
                !this.verticalCheck 
            ) { return true } else { return false }
        },
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        submit(flag) {

            this.titleCheck = (!this.title) ? true : false;
            this.horizontalCheck = (!this.horizontal_image) ? true : false;
            this.verticalCheck = (!this.vertical_image) ? true : false;
            this.languageCheck = (!this.language) ? true : false;
            this.genreCheck = (!this.genre) ? true : false;
        
        console.log("check",this.errorCheck())
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('title', this.title)
            payload.append('horizontal_image', this.horizontal_image)
            payload.append('vertical_image', this.vertical_image)

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
                var web_id = this.guid();
                var requestUrl = this.axios.post(config.host + 'webseries/', payload);
            } else {
                payload['web_id'] = this.web_id
                web_id = this.web_id;
                var requestUrl = this.axios.put(config.host + 'webseries/' + this.web_id, payload);
            } 
            var checkForm = false
            var vm = this
            this.web_episodes.map(function (map) {
                map.web_id = web_id;
                if (map.season_name == '' || map.season_number == '' || map.episode_number == '' || map.episode_title == '' || map.image == '' || map.media_url == '')  {
                    vm.$toast.error("Please fill atleast one season");
                    vm.showForm = false
                    return vm.showSeasonModal = true
                    
                } else {
                    vm.showSeasonModal = false
                    vm.showForm = true
                    checkForm = true
                }
            })
            
            if(checkForm){
                payload.append('web_episodes', JSON.stringify(this.web_episodes)); 
                payload.append('web_id', web_id); 
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
        },
        deleteInitiate(data) {
            this.showModal = true;
            this.deleteData = data;
        },
        deleteEntity(data) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.delete(config.host + 'webseries/' + data.web_id).then(response => {
                loader.hide();
                this.resetForm();
                this.$toast.success(response.data);
            }, err => {
                loader.hide();
                this.$toast.error(err.response.data);
            });
        },
        selectSeason() {
            this.showForm = false;
            this.showSeasonModal = true;
            
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

.content_width {
  width: 30px;
  height: 30px;
}
</style>>
