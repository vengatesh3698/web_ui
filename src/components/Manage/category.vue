<template>
    <div class="mt-3">
        <div class="pageHeader">Category</div>
        <div class="pageDesc">List of all Categories</div><br>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Category" />
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
            <template #cell(edit)="{ row }">
                <img src="@/assets/edit.png" @click="pageModification('update', row.rowData)" height="18"
                    class="cursorPointer" />
            </template>
            <template #cell(delete)="{ row }">
                <img src="@/assets/delete.png" @click="deleteInitiate(row.rowData)" height="20"
                    class="cursorPointer" />
                </template>
            </va-data-table>
            <va-modal style="color: #ffffff;" v-model="showModal" title="Delete Category"
                message='Are you sure to delete this Category?' okText="DELETE" cancelText="Cancel"
                @ok="deleteZee(deleteData)" blur  />
        </div>
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getAllCategory(10, page_value)" />
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
                    <va-select class="mt-2" v-model="type" text-by="type" v-if='isCreate' clearable clearable-icon="cancel"
                        searchable :options="typeLists" placeholder="Select Type" :error="checkType" /><br>
                        <va-input class="mt-2" v-model.trim="type" v-if='isUpdate'  type="text" disabled=true
                        /><br>

                    <span class="va-form-label va-form-required-label">Name</span>
                    <va-input class="mt-2" v-model.trim="name" type="text" placeholder="Enter Name"
                        :error="checkName" /><br><br>

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
        this.getAllCategory(10, 0);
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
            category_id: '',
            name: '',
            priority: '',
            showGrid: true,
            isCreate: false,
            showForm: false,
            isUpdate: false,
            showModal: false,
            checkPriority: false,
            checkName: false,
            checkType: false,
            timestamp : new Date().getTime(),
            typeLists:[{id:1, type:'Language'},{id:2, type:'Genres'}],
            categoryList: [],
            contentList : [],
        }
    },
    computed: {
        columnList() {
            return [
                { key: 'id', label: 'S.No' },
                { key: 'name', label: 'Name' },
                { key: 'type', label: 'Type' },
//                { key: 'priority', label: 'Priority' },
                { key: 'edit', width: 10, label: 'Edit' },
                { key: 'delete', width: 10, label: 'Delete' }
            ]
        },
        contentList() {
            return this.categoryList
        }
    },
    watch: {
        search_term() {
            if (this.search_term == '') {
                this.getAllCategory(10, 0)
                this.page_value=1;
            } else {
                var num_array = ['0','1','2','3','4','5','6','7','8','9']
                var char_array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['type', 'name'];
                } else {
                    var array = ['type', 'name'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'category'
                }
                search(payload).then(data => {
                    this.categoryList = data.rows.map(item => {
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
                this.getAllCategory(limit, this.page_value);
            }
        },
        getAllCategory(limit, offset) {
            var num = (offset == 0) ? offset + 1 : offset;
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'category/' + limit + '/' + offset).then(response => {
                loader.hide();
                this.totalCount = response.data.count;
                this.timestamp = new Date().getTime();
                this.categoryList = response.data.rows.map(function (data, index) {
                    data.id = num++;
                    return data;
                })

            });
        },
        pageModification(type, data) {
            this.search_term = ''
            if (type == 'create') this.title = 'Create Category';
            else this.title = 'Update Category';
            this.showForm = true;
             if (type == 'update') {
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.type = data['type'];
                this.category_id = data['category_id']
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
            this.name = '';
            this.type = '';
            this.priority = '',
            this.showForm = false;
            this.checkPriority = false;
            this.checkType = false;
            this.checkName = false;
            this.getAllCategory(10, 0);
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
        },
        errorCheck() {
        if (
            !this.checkName &&
//            !this.checkPriority &&
            !this.checkType
        ) { return true } else { return false }
        },
        submit(flag) {
            this.checkName = (!this.name) ? true : false;
//            this.checkPriority = (!this.priority) ? true : false;
            this.checkType = (!this.type) ? true : false;
        
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('name', this.name)
//            payload.append('priority', this.priority)
            if (this.type && typeof this.type === 'object') {
                payload.append('type', this.type.type);
            } 
         
             if (this.type && typeof this.type === 'string'){
                 payload.append('type', this.type); 
             }
            
            let requestUrl;
            if (flag == 'Update') {
                payload['category_id'] = this.category_id
                requestUrl = this.axios.put(config.host + 'category/' + this.category_id, payload);
            } else if (flag == 'Create') {
                requestUrl = this.axios.post(config.host + 'category/', payload);
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
        deleteZee(data) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.delete(config.host + 'category/' + data.category_id).then(response => {
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
  
