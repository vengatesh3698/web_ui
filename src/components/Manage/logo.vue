<template>
    <div class="mt-3">
        <div class="pageHeader">Logo</div>
        <div class="pageDesc">View the Logo list</div>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Channels" />
                <!-- <va-button v-if="channelList.length > 0" color="#ffffff" class="ml-3 createBtn" @click.prevent="channelStatus()">{{channel_status}}</va-button> -->

            </div>
            <div>
                <va-button  v-if= "allowAdd" class="ml-3 createBtn" color="#ffffff" @click="pageModification('create', null)">
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
        <va-modal class="popup" v-model="showModal" title="Delete Logo"
            message='Are you sure to delete this Logo?' okText="DELETE" cancelText="Cancel"
            @ok="deleteEntity(deleteData)" blur />

        <!-- <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getLogo(10, page_value)" />
        </div> -->
        <VueSidePanel class="sidePanel" v-model="showForm" width="500px" hide-close-btn :panel-duration="700"
            transition-name="slide-right" no-close>
            <div class="row">
                <span class="cardTitle">{{ title }} </span>
                <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
            </div>
            <form class="formView">
                <div class="orgcard">
                    <span class="va-form-label va-form-required-label">X axis</span><br>
                    <va-input class="mt-2" v-model.trim="x_axis" placeholder="Enter X-Axis" :error="xaxisCheck" oninput="event.target.value = event.target.value;" /><br><br>

                    <span class="va-form-label va-form-required-label">Y axis</span><br>
                    <va-input class="mt-2" v-model.trim="y_axis" placeholder="Enter Y-Axis" :error="yaxisCheck" oninput="event.target.value = event.target.value;" /><br><br>

                    <span class="va-form-label va-form-required-label">Logo</span>
                    <va-file-upload v-model="logo" dropzone file-types="image/*" accept="image/*" color="#b4131e" />
                    <span class="mt-2 error_msg" v-if="logoError">{{ logoError }}</span>
                    <br v-if="logoError">

            
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
        this.getLogo(10, 0);
    },
    data() {
        return {
            flag: '',
            logo_id: '',
            totalCount: '',
            page_value: 1,
            direct_page: '',
            search_term: '',
            channelList: [],
            showForm: false,
            isCreate: false,
            isUpdate: false,
            xaxisCheck: false,
            yaxisCheck: false,
            x_axis: '',
            y_axis: '',
            showModal : false,
            logoError: false,
            logo:[],
            fileError: '',
            allowAdd: false,
        }
    },
    computed: {
        columnList() {
            return [
                { key: 'id', label: 'S.No' },
                { key: 'x_axis', label: 'X-Axis' },
                { key: 'y_axis', label: 'Y-Axis' },
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
                 this.getLogo(10, 0)
                 this.page_value=1;
            } else {
                var num_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                var char_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['x_axis', 'y_axis'];
                } else {
                    var array = ['x_axis', 'y_axis'];
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
        directPage(limit, offset) {
            this.direct_page = offset.replace(/\D/g, '');
            if (offset == 1 || offset == '') {
                this.page_value = 1;
            } else {
                this.page_value = Math.max((offset * 10) - 9, 1);
            }
            if (this.page_value <= this.totalCount) {
                this.getLogo(limit, this.page_value);
            }
        },
        getLogo(limit, offset) {
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'logo/').then(response => {
                loader.hide();
                // this.totalCount = response.data.count
                // let num = (offset == 0) ? offset + 1 : offset;
                this.timestamp = new Date().getTime();
                this.channelList = response.data.map(function (data, num) {
                    data.id = num++;
                    data.select = false;
                    return data;
                })
                
                this.allowAdd = (this.channelList.length  == 0) ? true : false
                
            });
        },
        pageModification(type, data) {
            this.search_term = ''
            if (type == 'create') this.title = 'Create Logo';
            else this.title = 'Update Logo';
            this.showForm = true;
            if (type == 'update') {
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.x_axis = data['x_axis'];
                this.y_axis = data['y_axis'];
                this.logo_id = data['logo_id'];
                this.user_id = data['user_id'];
            } else {
                this.flag = 'Create';
                this.isCreate = true;
                this.isUpdate = false;
            }
        },
        resetForm() {
            this.fileError = '';
            this.flag = '';
            this.x_axis = '';
            this.y_axis = '';
            this.showForm = false;
            this.xaxisCheck = false;
            this.yaxisCheck = false;
            this.getLogo(10,0);
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
            this.logoError = false;
            this.showModal = false;
            this.logo = [];
            this.allowAdd = false
        },
        errorCheck() {
            if (
                !this.xaxisCheck &&
                !this.yaxisCheck
            ) { return true } else { return false }
        },
        submit(flag) {
            this.xaxisCheck = (!this.x_axis) ? true : false;
            this.yaxisCheck = (!this.y_axis) ? true : false;
            this.logoError = (!this.logo[0] && this.isCreate ) ? 'Upload Logo' : false;
            if (!this.errorCheck()) return;

            var payload = new FormData()
            payload.append('x_axis', this.x_axis)
            payload.append('y_axis', this.y_axis)

            if (this.isCreate) {                
                payload.append('logo', this.logo[0])
            }
            if (this.isUpdate && this.logo[0] != undefined) {
                payload.append('logo', this.logo[0])
            }

            if (flag == 'Create') {
                var requestUrl = this.axios.post(config.host + 'logo/', payload);
            } else {
                payload['channel_id'] = this.channel_id
                var requestUrl = this.axios.put(config.host + 'logo/' + this.logo_id, payload);
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
            this.axios.delete(config.host + 'logo/' + data.logo_id).then(response => {
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
