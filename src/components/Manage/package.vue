<template>
    <div class="mt-3">
        <div class="pageHeader">Package</div>
        <div class="pageDesc">View the Package list</div>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Package" />
            </div>
            <div>
                <va-button v-if='((user_role=="ADMIN") || (user_role=="SUPER_ADMIN") || (user_role=="RESELLER" && user_type == "Own Pack"))' class="ml-3 createBtn" color="#ffffff" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>Add
                </va-button>
            </div>
        </div>
        <va-data-table class="dataTable mt-4 " :items="contentList" :columns="columnList" wrapper-size="380" item-size="46"
            per-page="10" virtual-scroller sticky-header>
            
            <!-- <div v-if='((user_role=="ADMIN") || (user_role=="RESELLER" && user_type == "Own Pack"))'> -->
                <template #cell(edit)="{ row }">
                    <img src="@/assets/edit.png" @click="pageModification('update', row.rowData)" height="18"
                        class="cursorPointer" />
                </template>
                <template #cell(delete)="{ row }">
                    <img src="@/assets/delete.png" @click="deleteInitiate(row.rowData)" height="18" class="cursorPointer" />
                </template>
            <!-- </div> -->
        </va-data-table>
        <va-modal class="popup" v-model="showModal" title="Delete Package"
            message='Are you sure to delete this Package?' okText="DELETE" cancelText="Cancel"
            @ok="deleteEntity(deleteData)" blur />
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getAllPackage(10, page_value)" />
        </div>
        <VueSidePanel class="sidePanel" v-model="showForm" width="500px" hide-close-btn :panel-duration="700"
            transition-packageName="slide-right" no-close>
            <div class="row">
                <span class="cardTitle">{{ title }}</span>
                    <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
                </div>
            <form class="formView">
                <div class="orgcard">
                    <span class="va-form-label va-form-required-label">Package Name</span><br>
                    <va-input class="mt-2" v-model.trim="package_name" placeholder="Enter App Name" :error="packageNameCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br>

                    <span class="va-form-label va-form-required-label">Package Cost</span><br>
                    <va-input class="mt-2" v-model.trim="package_cost" type="tel" oninput="event.target.value =event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" maxlength="7" placeholder="Enter Cost (₹) /-" :error="packageCostCheck" /><br><br>
<!-- 
                    <va-input class="mt-2" v-model.trim="package_cost" type="tel" placeholder="Enter Package Cost" :error="packageCostCheck" oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br> -->
                    
                    <span class="va-form-label">Catagory</span><br>
                    <va-select v-model="category" class=" mt-2" text-by="name" multiple clearable
                        clearable-icon="cancel" :options="categoryList" searchable placeholder="Select Channels"
                        :error="channelcheck" track-by="name" /><br><br>

                    <span class="va-form-label va-form-required-label">Channels</span><br>
                    <va-select v-model="package_channels" class=" mt-2" text-by="name" multiple clearable
                        clearable-icon="cancel" :options="channellist" searchable placeholder="Select Channels"
                        :error="channelcheck" track-by="name" /><br><br>

                    <span class="va-form-label va-form-required-label">Duration (in months)</span><br>
                    <va-select v-model="duration" class=" mt-2" text-by="duration"  clearable
                        clearable-icon="cancel" :options="durationlist" searchable placeholder="Select Duration"
                        :error="durationCheck" track-by="duration" /><br><br>

                    <va-button class="mt-4 form_button" @click="submit(flag)" color="#ffffff">{{ flag }}</va-button>
                </div>
            </form>
        </VueSidePanel>
    </div>
</template>

<script>
import config from '@/router/config.json';
import { search } from '@/module/Search.js';
export default {
    created() {
        this.getAllPackage(10, 0);
        this.getAllChannel();
        this.getCategory();
    },
    data() {
        return {
            flag: '',
            package_name: '',
            package_channels:[],
            package_id: '',
            totalCount: '',
            page_value: 1,
            direct_page: '',
            category: [],
            search_term: '',
            package_packageName: '',
            channellist:[],
            packageList: [],
            showForm: false,
            isCreate: false,
            isUpdate: false,
            showModal: false,
            packageNameCheck: false,
            packageCostCheck: false,
            channelcheck: false,
            package_cost: 0,
            user_role: this.$cookies.get('role'),
            user_type: this.$cookies.get('user_type'),
            durationCheck: false,
            duration: '',
            durationlist: [{id:1,duration:'1'},{id:2,duration:'3'},{id:3,duration:'6'},{id:4,duration:'9'},{id:5,duration:'12'},{id:6,duration:'Demo'},],
            categoryList: [],
        }
    },
    computed: {
        columnList() {
            if((this.user_role=="ADMIN") || (this.user_role == 'SUPER_ADMIN') || (this.user_role=="RESELLER" && this.user_type == "Own Pack")){
                return [
                    { key: 'id', label: 'S.No' },
                    { key: 'package_name', label: 'Package Name' },
                    { key: 'package_cost', label: 'Package Cost' },
                    { key: 'duration', label: 'Duration' },
                    { key: 'edit', width: 10, label: 'Edit' },
                    { key: 'delete', width: 10, label: 'Delete' }
                ]
            }else{
                return [
                    { key: 'id', label: 'S.No' },
                    { key: 'package_name', label: 'Package Name' },
                    { key: 'package_cost', label: 'Package Cost' },
                    { key: 'duration', label: 'Duration' }
                    // { key: 'edit', width: 10, label: 'Edit' },
                    // { key: 'delete', width: 10, label: 'Delete' }
                ]
            }
        },
        contentList() {
            return this.packageList
        }
    },
    watch: {
        category(){
            var category_val = [];
            var selectedpack = [];
            this.category.map(function (argument) {
                category_val.push(argument.name)
            })
            this.channellist.map(function (args) {
                if((category_val.includes(args.language)) || (category_val.includes(args.genres))){
                    if(!selectedpack.some(function(data){return data.name == args.name})){
                        selectedpack.push(args)
                    }
                }
            })
            console.log("selectedpack",JSON.stringify(selectedpack))
            // var allpack = [...this.package_channels, ...selectedpack]
            var allpack = selectedpack
            console.log("allpack",JSON.stringify(allpack))
            var unique = [...new Set(allpack.map(item => item))]; 
            this.package_channels = unique
            console.log("unique",JSON.stringify(unique))
        },
        package_channels(){
            console.log("package_channels",JSON.stringify(this.package_channels))
        },
        search_term() {
            if (this.search_term == '') {
                 this.getAllPackage(10, 0)
                 this.page_value=1;
            } else {
                var num_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                var char_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['package_name'];
                } else {
                    var array = ['package_name'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'package'
                }
                search(payload).then(data => {
                    this.packageList = data.rows.map(item => {
                        item.id = num++
                        return item
                    })
                });
            }
        },
    },
    methods: {
        getCategory(){
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'category').then(resp => {
                var vm = this
                resp.data.map(function (val, i) {
                    val.id = i+1
                })
                this.categoryList = resp.data
            });
            loader.hide();
          },function(err){
            loader.hide();
            this.$toast.error(err.response.data);
        },
        directPage(limit, offset) {
            this.direct_page = offset.replace(/\D/g, '');
            if (offset == 1 || offset == '') {
                this.page_value = 1;
            } else {
                this.page_value = Math.max((offset * 10) - 9, 1);
            }
            if (this.page_value <= this.totalCount) {
                this.getAllPackage(limit, this.page_value);
            }
        },
        getAllPackage(limit, offset) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'package/' + limit + '/' + offset).then(response => {
                loader.hide();
                this.totalCount = response.data.count
                let num = (offset == 0) ? offset + 1 : offset;
                this.packageList = response.data.rows.map((items, index) => {
                    items.id = num++
                    return items
                });
            },function(err){
                loader.hide();
                this.$toast.error(err.response.data);
            });
        },
        getAllChannel(){
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'channel').then(resp => {
                loader.hide();

                this.channellist = resp.data.map(function (val, index) {
                    val.id = index+1;
                    return val;
                });
            
            },function(err){
                loader.hide();
                this.$toast.error(err.response.data);
            })
        },
        pageModification(type, data) {
            this.search_term = ''
            if (type == 'create') this.title = 'Create Package';
            else this.title = 'Update Package';
            this.showForm = true;
            if (type == 'update') {
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.package_name = data['package_name'];
                this.package_channels = data['package_channels'];
                this.package_id = data['package_id'];
                this.package_cost = data['package_cost'];
                this.duration = data['duration'];
            } else {
                this.flag = 'Create';
                this.isCreate = true;
                this.isUpdate = false;
            }
        },
        resetForm() {
            this.flag = '';
            this.package_name = '';
            this.package_cost = 0;
            this.package_channels = [];
            this.channellist=[];
            this.duration=''
            this.durationCheck = false;
            this.package_id = '';
            this.showForm = false;
            this.packageNameCheck = false;
            this.packageCostCheck = false;
            this.channelcheck = false;
            this.getAllPackage(10,0);
            this.getAllChannel();
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
            this.category = []
        },
        errorCheck() {
            if (
                !this.packageNameCheck && !this.channelcheck && !this.packageCostCheck  && !this.durationCheck
            ) { return true } else { return false }
        },
        submit(flag) {
            this.packageNameCheck = (!this.package_name) ? true : false;
            this.packageCostCheck = (!this.package_cost) ? true : false;
            this.durationCheck = (!this.duration) ? true : false;
            this.channelcheck = (this.package_channels.length == 0) ? true : false;
            if (!this.errorCheck()) return;
            if(flag == 'Create') {
              var array = this.package_channels.map(resp => {
                return { name: resp.name , channel_id : resp.channel_id};
              });
            }
            var vm = this;
            if(flag == 'Update') {
              var array = this.package_channels.map(resp => {
                return { name: resp.name , channel_id : resp.channel_id, package_id:vm.package_id};
              });
            }
          
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('package_name', this.package_name)
            payload.append('package_cost', this.package_cost)
            if (this.duration && typeof this.duration === 'object') {
                payload.append('duration', this.duration.duration);
            } 
            if (this.duration && typeof this.duration === 'string'){
                payload.append('duration', this.duration); 
            }
            payload.append('package_channels',JSON.stringify(array))
        
            if (flag == 'Create') {
                var requestUrl = this.axios.post(config.host + 'package/', payload);
            } else {
                payload['package_id'] = this.package_id
                var requestUrl = this.axios.put(config.host + 'package/' + this.package_id, payload);
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
            this.axios.delete(config.host + 'package/' + data.package_id).then(response => {
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