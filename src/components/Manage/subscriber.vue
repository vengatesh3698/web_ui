<template>
    <div class="mt-3">
        <div class="pageHeader">Subscriber</div>
        <div class="pageDesc">View the Subscriber list</div>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Subscriber" />
                <va-select class="ml-6" v-model="filterArr" text-by="option"  searchable :options="filterLists" placeholder="Select Filter"/>
            </div>
            <div>
               <!--  <va-button class="ml-3 createBtn" color="#ffffff" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>
                    Add
                </va-button> -->
                
            </div>
        </div>
        <va-data-table class="dataTable mt-4 " :items="contentList" :columns="columnList" wrapper-size="380" item-size="46"
            per-page="10" virtual-scroller sticky-header>
            <template #cell(edit)="{ row }">
                <img src="@/assets/edit.png" @click="pageModification('update', row.rowData)" height="18"
                    class="cursorPointer" />
            </template>
            <template #cell(swap)="{ row }">
                <img src="@/assets/swap.jpg" v-if="row.rowData.status == 'Active'" @click="swapInitiate(row.rowData)" height="18" class="cursorPointer" />
            </template>
            <template #cell(delete)="{ row }">
                <img src="@/assets/delete.png" @click="deleteInitiate(row.rowData)" height="18" class="cursorPointer" />
            </template>
        </va-data-table>
        <va-modal class="popup" v-model="showModal" title="Choose Inventory"
            message='Select the inventory to swap' okText="Ok" cancelText="Cancel" @ok="swapEntity(deleteData)" blur >
            <va-select class="mt-2" v-model="swap" text-by="serial_no" clearable clearable-icon="cancel" searchable :options="freshLists" placeholder="Select Inventory" :error="checkswap" />
        </va-modal>
        <va-modal class="popup" v-model="showdeleteModal" title="Delete Inventory"
            message='Are you sure to delete ?' okText="Ok" cancelText="Cancel"
            @ok="deleteEntity(dataToDelete)" blur >
        </va-modal>
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getInventory(10, page_value)" />
        </div>
        <VueSidePanel class="sidePanel" v-model="showForm" width="500px" hide-close-btn :panel-duration="700"
            transition-name="slide-right" no-close>
            <div class="row">
                <span class="cardTitle">{{ title }} </span>
                <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
            </div>
            <form class="formView">
                <div class="orgcard">
                    <span class="va-form-label va-form-required-label">Serial Number</span><br>
                    <va-input class="mt-2" v-model.trim="serial_no" disabled=true placeholder="Enter Serial Number" :error="serialnoCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br>

                    <span class="va-form-label va-form-required-label">Mac</span><br>
                    <va-input class="mt-2" v-model.trim="mac" disabled=true placeholder="Enter Mac" :error="macCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" /><br><br>

                    <div v-if="(role=='ADMIN') || (role=='SUPER_ADMIN')">
                        <span class="va-form-label va-form-required-label">Reseller</span><br>
                        <va-select v-model="reseller" class=" mt-2" text-by="username" clearable
                        clearable-icon="cancel" :options="userLists" searchable placeholder="Select Resller"
                        :error="resellercheck" track-by="username" /><br><br>
                    </div>
                    
                    <span class="va-form-label va-form-required-label">Subscriber Name</span><br>
                    <va-input class="mt-2" v-if="role=='RESELLER'" v-model.trim="subscriber_name"  placeholder="Enter Subscriber Name" :error="subscriberNameCheck"
                        oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" />
                    <va-input class="mt-2" v-if="((role=='ADMIN') || (role=='SUPER_ADMIN'))" v-model.trim="subscriber_name"  placeholder="Enter Subscriber Name" :error="subscriberNameCheck" oninput="event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]*/g,'');" :disabled="true" />
                    <br><br>

                    <span class="va-form-label va-form-required-label">Packages</span><br>
                    <va-select v-if="role=='RESELLER'"  v-model="inventory_packages" class=" mt-2" text-by="package_name" clearable clearable-icon="cancel" :options="packagelist" searchable placeholder="Select Packages" :error="packagecheck" track-by="package_name" />
                    <va-select v-if="(role=='ADMIN' || role=='SUPER_ADMIN')" v-model="inventory_packages" class=" mt-2" text-by="package_name" multiple clearable clearable-icon="cancel" :options="packagelist" searchable placeholder="Select Packages" :error="packagecheck" track-by="package_name" :disabled="true" />
                        <br><br>

                    <span class="va-form-label va-form-required-label">Expiry Date</span><br>
                   <!--  <input type="date" class="dateinput mt-1" v-if="role=='RESELLER'" v-model.trim="expiry_date" style="width: 410px; border-radius: 17px;" :style="{ 'border-color': expiryCheck ? 'red' : '' }" :min="getCurrentDate()" :error="expiryCheck">
                    <input type="date" class="dateinput mt-1" v-if="((role=='ADMIN') || (role=='SUPER_ADMIN'))" v-model.trim="expiry_date" style="width: 410px; border-radius: 17px;" :style="{ 'border-color': expiryCheck ? 'red' : '' }" :min="getCurrentDate()" :error="expiryCheck" :disabled="true">
                    <br><br> -->
                    <va-input class="mt-2" v-if="role=='RESELLER'" v-model.trim="expiry_date"  placeholder="Expiry date" :error="expiryCheck" :disabled="true"/>

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
        this.getInventory(10, 0);
        this.getPackages();
        this.getUsers();
    },
    data() {
        return {
            flag: '',
            name: '',
            subscriber_name:'',
            inventory_id: '',
            expiry_date: new Date().toLocaleDateString('en-US'),
	    expiry_date_grid : new Date().toLocaleString(),
            totalCount: '',
            page_value: 1,
            direct_page: '',
            inventory_packages: [],
            search_term: '',
            url: '',
            image_url: '',
            lcn: '',
            reseller: '',
            inventoryList: [],
            packagelist:[],
            showForm: false,
            isCreate: false,
            isUpdate: false,
            showModal: false,
            subscriberNameCheck:false,
            serialnoCheck: false,
            macCheck: false,
            packagecheck: false,
            expiryCheck: false,
            checkswap: false,
            swap: '',
            reseller_name: '',
            reseller_id:'',
            role: this.$cookies.get('role'),
            timestamp : new Date().getTime(),
            userLists: [],
            showdeleteModal: false,
            filterLists: [{id:1,option:'Fresh'},{id:2,option:'Active'},{id:3,option:'Expire'}],
            filterArr: '',
        }
    },
    computed: {
        columnList() {
            if((this.role == 'ADMIN') || (this.role == 'SUPER_ADMIN')){
                return [
                    { key: 'id', label: 'S.No' },
                    { key: 'reseller_name', label: 'Resller Name' },
                    { key: 'subscriber_name', label: 'Subscriber Name' },
                    { key: 'mac', label: 'Mac Address' },
                    { key: 'status', label: 'Status' },
   		    { key: 'expiry_date_grid', label: 'Expiry Date' },
		    { key: 'package_name_grid', label: 'Package Name' },
                    { key: 'edit', width: 10, label: 'Edit' },
                    { key: 'delete', width: 10, label: 'delete' }
                ]
            }else{
                return [
                    { key: 'id', label: 'S.No' },
                    { key: 'reseller_name', label: 'Resller Name' },
                    { key: 'subscriber_name', label: 'Subscriber Name' },
                    { key: 'mac', label: 'Mac Address' },
                    { key: 'status', label: 'Status' },
      		    { key: 'expiry_date_grid', label: 'Expiry Date' },
		    { key: 'package_name_grid', label: 'Package Name' },
                    { key: 'edit', width: 10, label: 'Edit' },
                    { key: 'swap', width: 10, label: 'Swap' },
                    { key: 'delete', width: 10, label: 'delete' }
                ]
            }
        },
        contentList() {
            return this.inventoryList
        }
    },
    watch: {
        inventory_packages() {
	    var vm = this
            var obj = {
                1:29,
                3:90,
                6:180,
                9:270,
                12:365,
                "Demo":1
            }
            if(this.inventory_packages && this.inventory_packages.package_channels){
                var selected = this.packagelist.filter(function(packdata){
                    return (packdata.package_id == vm.inventory_packages.package_id )
                })
                if(selected.length > 0){
                    this.inventory_packages.package_cost = selected[0].package_cost 
                }
                var today = new Date();
                var days = obj[this.inventory_packages.duration]
                if(days){
                    this.date = new Date(today.setDate(today.getDate() + days)).setHours(23, 59, 59, 999);
                    this.expiry_date = new Date(this.date).toLocaleDateString('en-US');
	            this.expiry_date_grid = new Date(this.date).toLocaleString().split(',')[0];
                    console.log(this.expiry_date)
                }
            }else{
                this.expiry_date = new Date(this.expiry_date).toLocaleDateString('en-US')
                this.date = new Date(this.expiry_date).setHours(23, 59, 59, 999);

            }
        },
        search_term() {
            var vm = this;
            this.freshLists = [];
            if (this.search_term == '') {
                 this.getInventory(10, 0)
                 this.page_value=1;
            } else {
                this.axios.get(config.host + 'inventory/').then(responses => {
                    console.log("dhjs",responses.data)
                    responses.data.map(item => {
                        if(item.status == 'Fresh'){
                            vm.freshLists.push(item)
                        }
                    })
                })
                var num_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                var char_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['serial_no', 'mac', 'status', 'subscriber_name', 'reseller_name'];
                } else {
                    var array = ['serial_no', 'mac', 'status', 'subscriber_name', 'reseller_name'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'inventory'
                }
                search(payload).then(data => {
                    this.inventoryList = data.rows.map(item => {
                        item.id = num++
                        if(item.expiry_date){
                           item.expiry_date_grid = new Date(item.expiry_date).toLocaleString().split(',')[0];
                        }
                //      if(item.status == 'Fresh'){
                //          vm.freshLists.push(data)
                //      }
                        if(item.inventory_packages && item.inventory_packages.length > 0 ){
                            item.package_name_grid = item.inventory_packages[0].package_name
                        }
                        return item
                    })
                });
            }
        },
        filterArr(option){
            var selected = option.option;
            var vm = this;
            this.freshLists = [];
            if (selected == '') {
                 this.getInventory(10, 0)
                 this.page_value=1;
            } else {
                var num_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                var char_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (num_array.some(char => selected.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['serial_no', 'mac', 'status', 'subscriber_name', 'reseller_name'];
                } else {
                    var array = ['serial_no', 'mac', 'status', 'subscriber_name', 'reseller_name'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': selected,
                    'type': 'inventory'
                }
                search(payload).then(data => {
                    this.totalCount = data.count
                    this.inventoryList = data.rows.map(item => {
                        item.id = num++
                        if(item.expiry_date){
                           item.expiry_date_grid = new Date(item.expiry_date).toLocaleString().split(',')[0];
                        }
                        if(item.status == 'Fresh'){
                            vm.freshLists.push(data)
                        }
                        if(item.inventory_packages && item.inventory_packages.length > 0 ){
                            item.package_name_grid = item.inventory_packages[0].package_name
                        }
                        return item
                    })
                });
            }
        },
    },
    methods: {
        getUsers(){
            this.axios.get(config.host + 'user').then(response => {
                this.userLists = response.data.map(item => {
                  return item;
                });
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
                this.getInventory(limit, this.page_value);
            }
        },
        getInventory(limit, offset) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            var filter = (this.filterArr != '') ? this.filterArr.option : 'null'
            this.axios.get(config.host + 'inventory/' + limit + '/' + offset + '/' + filter ).then(response => {
                loader.hide();
                this.totalCount = response.data.count
                let num = (offset == 0) ? offset + 1 : offset;
                this.timestamp = new Date().getTime();
                this.inventoryList = [];
                this.freshLists = [];
                var vm = this;
                response.data.rows.map(function (data) {
                    data.id = num++;
	  	    if(data.expiry_date){
		   	 data.expiry_date_grid = new Date(data.expiry_date).toLocaleString().split(',')[0];
		    }
                    if(data.status == 'Fresh'){
                        vm.freshLists.push(data)
                    }
	    	    if(data.inventory_packages && data.inventory_packages.length > 0 ){
                        data.package_name_grid = data.inventory_packages[0].package_name
                    }
                })
                vm.inventoryList = response.data.rows;
            });
        },
        getCurrentDate() {
          const now = new Date();
          // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          // return now.toISOString().slice(0, 16);
          return now;
        },
        getPackages() {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'package').then(response => {
                loader.hide();
                this.packagelist = response.data.map(function (data, num) {
                    data.id = num++;
                    return data;
                })
            },function(err){
            });
        },
        pageModification(type, data) {
            this.search_term = ''
            if (type == 'create') this.title = 'Create Inventory';
            else this.title = 'Update Inventory';
            this.showForm = true;
            if (type == 'update') {
                this.status = data['status'];
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.serial_no = data['serial_no'];
                this.subscriber_name = data['subscriber_name'];
		        if(data.inventory_packages && data.inventory_packages.length > 0){
                    this.inventory_packages = data['inventory_packages'][0];
		        }
                this.mac = data['serial_no'];
                this.inventory_id = data['inventory_id'];
                this.user_id = data['user_id'];
                this.reseller_name = data['reseller_name'];
                this.reseller=data['reseller_name'];
                this.reseller_id = data['reseller_id'];
                this.expiry_date = new Date(data['expiry_date']).toLocaleDateString('en-US');

    //             if(data.expiry_date){
    //              var s = new Date(data.expiry_date).toLocaleString(undefined, { timeZone: 'Asia/Kolkata', hour12: false });
    //     var split = s.split(',')
    //     console.log("split",split)
    //     var in_dateSplit = split[0].split('/');
    //     var in_timeSplit = split[1].split(':');
    //     var in_dateValue = (in_dateSplit[1] < 10) ? 0 + in_dateSplit[1] : in_dateSplit[1];
    //     var in_monthValue = (in_dateSplit[0] < 10) ? 0 + in_dateSplit[0] : in_dateSplit[0];
       

    //     var in_timeValue = (in_timeSplit[0].trim() < 10) ? 0 + in_timeSplit[0].trim() : in_timeSplit[0].trim();
    //     var in_minValue = (in_timeSplit[1].trim() < 10) ? 0 + in_timeSplit[1].trim() : in_timeSplit[1].trim();
    //     var check_in_time_dateJoin = in_dateSplit[2] + '-' + in_monthValue + '-' + in_dateValue + 'T' + in_timeSplit[0].trim() + ':' + in_timeSplit[1].trim();



    //     var check_in_time_dateJoin = in_dateSplit[2] + '-' + in_monthValue + '-' + in_dateValue;
    //     this.expiry_date = check_in_time_dateJoin
    // }

            } else {
                this.flag = 'Create';
                this.isCreate = true;
                this.isUpdate = false;
            }
        },
        resetForm() {
            this.checkswap = false;
            this.swap = '';
            this.flag = '';
            this.serial_no = '';
            this.subscriber_name ='';
            this.mac = '';
            this.inventory_packages = '';
            this.packagecheck = false;
            this.showForm = false;
            this.nameCheck = false;
            this.imagemacCheck = false;
            this.languageCheck =false;
            this.genreCheck = false;
            this.macCheck = false;
            this.subscriberNameCheck = false;
            this.lcnCheck = false;
            this.getInventory(10,0);
            this.expiry_date = new Date().toLocaleDateString('en-US');
	    this.expiry_date_grid = new Date().toLocaleString();
            this.expiryCheck = false;
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
            this.reseller_name = '';
            this.reseller_id = '';
            this.showdeleteModal = false;
        },
        errorCheck() {
            if (
                !this.serialnoCheck &&
                !this.macCheck &&
                !this.subscriberNameCheck && 
                !this.packagecheck && 
                !this.expiryCheck
            ) { return true } else { return false }
        },
        submit(flag) {
            this.macCheck = (!this.mac) ? true : false;
            this.serialnoCheck = (!this.serial_no) ? true : false;
            if((this.role == 'ADMIN') || (this.role == 'SUPER_ADMIN')){
                this.resellercheck = (!this.reseller) ? true : false;
                if(this.resellercheck){
                    return this.$toast.error("Select one reseller");
                }
            }else{
                this.subscriberNameCheck = (!this.subscriber_name) ? true : false;
                this.expiryCheck = (!this.expiry_date) ? true : false;
                this.packagecheck = (!this.inventory_packages) ? true : false;  
                if(this.subscriberNameCheck || this.expiryCheck || this.packagecheck){
                    return this.$toast.error("Please fill the form");    
                }  
                
            }
            
            var array = [];
            // if (!this.errorCheck()) return;
            var payload = new FormData();
            payload.append('mac', this.mac);
            payload.append('serial_no', this.serial_no);
            payload.append('inventory_id', this.inventory_id);
            payload.append('status', this.status);
            
            if((this.role == 'ADMIN') || (this.role == 'SUPER_ADMIN')){
                if (this.reseller && typeof this.reseller === 'object') {
                    payload.append('reseller_id', this.reseller.user_id)
                    payload.append('reseller_name', this.reseller.username)
                } 
                if (this.reseller && typeof this.reseller === 'string'){
                    payload.append('reseller_name', this.reseller)
                }
            }else{
                payload.append('subscriber_name', this.subscriber_name)
                payload.append('expiry_date', this.date)    
                var vm = this
		if(this.inventory_packages && this.inventory_packages.length == undefined) {
                    this.inventory_packages = [this.inventory_packages] 
                }
                this.inventory_packages.map(resp => {
                    vm.packagelist.map(function (argument) {
                        if(resp.package_id == argument.package_id){
                            array.push({ package_name: resp.package_name , duration: resp.duration , package_id : resp.package_id, inventory_id: vm.inventory_id, package_cost: argument.package_cost})
                        }
                    })
                })
                // var array = this.inventory_packages.map(resp => {
                //     console.log("res",resp)
                //     return { package_name: resp.package_name , duration: resp.duration , package_id : resp.package_id, inventory_id: vm.inventory_id, package_cost: resp.package_cost};
                //   });
                payload.append('inventory_packages', JSON.stringify(array))
            }
            
            var requestUrl = this.axios.put(config.host + 'inventory/' + this.inventory_id, payload);
            const loader = this.$loading.show({ width: 40, height: 40 });
            requestUrl.then(response => {
                 loader.hide();
                 console.log("response",JSON.stringify(response))
                this.resetForm();
                this.$toast.success(response.data);
            }, err => {
                console.log("err",JSON.stringify(err))
                 loader.hide();
                this.showForm = true;
                this.$toast.error(err.response.data);
            });
        },
        swapInitiate(data) {
            this.showModal = true;
            this.deleteData = data;
        },
        deleteInitiate(data) {
            this.showdeleteModal = true;
            this.dataToDelete = data;
        },
        swapEntity(data) {
            this.checkswap = (!this.swap) ? true : false;
            if (this.checkswap ){
                return this.$toast.error("Select one Inventory");
            }
            var payload = {
                old_entry : data.inventory_id,
                new_entry : this.swap.inventory_id
            }
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.post(config.host + 'inventory/swap', payload ).then(response => {
                loader.hide();
                this.resetForm();
                this.$toast.success(response.data);
            }, err => {
                loader.hide();
                this.$toast.error(err.response.data);
            });
        },
        deleteEntity(data) {
            var payload = {
                inventory_id : data.inventory_id
            }
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.post(config.host + 'inventory/delete', payload ).then(response => {
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
