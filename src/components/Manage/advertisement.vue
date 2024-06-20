<template>
    <div class="mt-3">
        <div class="pageHeader">Advertisement</div>
        <div class="pageDesc">List of all Advertisement</div><br>
        <div class="headerContainer">
            <div>
                <va-input class="flex md12 pr-3" v-model.trim="search_term" type="text" placeholder="Search Advertisement" />
            </div>
            <div v-if="adList.length == 0">
                <va-button class="ml-3 createBtn" color="#999999" @click="pageModification('create', null)">
                    <i class="fas fa-plus" style=" margin-right:10px;"></i>
                    Add
                </va-button>
            </div>
        </div>
        <div>
            <va-data-table class="dataTable mt-4" :items="adList" :columns="columnList" wrapper-size="1000"
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
            <va-modal style="color: #ffffff;" v-model="showModal" title="Delete Advertisement"
                message='Are you sure to delete this Advertisement?' okText="DELETE" cancelText="Cancel"
                @ok="deleteZee(deleteData)" blur  />
        </div>
        <div class="row container mt-3 mb-2">
            <div class="pageInput">
                <span class="mt-1 pl-2 pr-2">Go to the page</span>
                <input ref="directPageInput" v-model.trim="direct_page" @input="directPage(10, direct_page)" />
            </div>
            <va-pagination class="" v-model="page_value" :visible-pages="7" :total="totalCount" :direction-links="false"
                :page-size="10" boundary-numbers color="#888888" size="small" @click="getAllAdvertisement(10, page_value)" />
        </div>
        <div>
            <VueSidePanel v-model="showForm" width="500px" hide-close-btn :panel-duration="1000"
                transition-name="slide-right" no-close>
                <div class="row">
                    <span class="cardTitle">{{ titles }}</span>
                    <va-icon name="close" class="closeBar" size="small" @click="resetForm()"></va-icon>
                </div>
                <form class="formView">
                    <span class="va-form-label va-form-required-label">Title</span>
                    <va-input class="mt-2" v-model.trim="title" type="text" placeholder="Enter Title" :error="checkTitle" /><br><br>

                 <!--    <span class="va-form-label va-form-required-label">Slot</span>
                    <va-select class="mt-2" v-model="slot" text-by="slot" v-if='isCreate' clearable clearable-icon="cancel" searchable :options="slotList" placeholder="Select Slot" :error="checkSlot" /><br> -->
                    
                    <span class="va-form-label va-form-required-label">Frequency</span>
                    <va-input class="mt-2" v-model.trim="frequency" type="number" placeholder="Eg: 0 to 30"
                        :error="checkFrequency" /><br><br>


                    <span class="va-form-label va-form-required-label">Left Image (720px X 2160px)</span>
                    <va-file-upload v-model="left_image" dropzone file-types="image/*" accept="image/*" color="#b4131e" />
                    <span class="mt-2 error_msg" v-if="leftImageError">{{ leftImageError }}</span>
                    <br v-if="leftImageError">

                    <span class="va-form-label va-form-required-label">Bottom Image (3840px X 768px)</span>
                    <va-file-upload v-model="bottom_image" dropzone file-types="image/*" accept="image/*" color="#b4131e" />
                    <span class="mt-2 error_msg" v-if="bottomImageError">{{ bottomImageError }}</span>
                    <br v-if="bottomImageError">

                    <span class="va-form-label va-form-required-label">Slot</span>
                    <va-input class="mt-2" v-model.trim="slot" type="text" placeholder="Eg: 11.00 to 11.30"
                        :error="checkSlot" /><br><br>
                    <!-- <slot style="margin: 100px;">
                        <span class="va-form-label va-form-required-label">Slots</span>
                        <div class="va-table">
                          <table style="width: 100%;" class="va-table-responsive">
                            <tbody>
                              <tr v-for="(field,i) in slots" :key="field.id">
                                <td >
                                  <va-input
                                    placeholder="eg: 11.00 to 11.30"
                                    type="text"
                                    v-model="field.slot"
                                    style="width: 85%"

                                  />
                                </td>
                                <td>
                                  <va-button
                                    v-if="!active_ad"
                                    class="content_width "
                                    flat color="danger"
                                    @click.prevent="removeField(i, 'slot')"
                                  ><i class="fa fa-remove"></i></va-button>
                                </td>
                                <td>
                                  <va-button
                                    v-if="slots.length"
                                    class="content_width "
                                    flat color="primary"
                                    @click.prevent="slots_length++"
                                  ><i class="fa fa-plus"></i></va-button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </slot> -->
                   
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
        this.getAllAdvertisement(10, 0);
    },
    data() {
        return {
            slot: '',
            flag: '',
            page_value: 1,
            genres_id: '',
            media_url: '',
            totalCount: '',
            deleteData: '',
            search_term: '',
            direct_page: '',
            adv_id: '',
            title: '',
            frequency: '',
            showGrid: true,
            isCreate: false,
            showForm: false,
            isUpdate: false,
            showModal: false,
            checkFrequency: false,
            checkTitle: false,
            checkSlot: false,
            timestamp : new Date().getTime(),
            advertisementList: [],
            adList : [],
            leftImageError: false,
            bottomImageError: false,
            left_image: [],
            bottom_image: [],
            slots: [{
                slot: '',
            }],
            slots_length: 0,
            checkSlot: false,
            slot:''
        }
    },
    computed: {
        columnList() {
            return [
                { key: 'id', label: 'S.No' },
                { key: 'title', label: 'Title' },
                { key: 'frequency', label: 'Frequency' },
                { key: 'edit', width: 10, label: 'Edit' },
                { key: 'delete', width: 10, label: 'Delete' }
            ]
        },
        adList() {
            return this.advertisementList
        }
    },
    watch: {
        slots_length () {
            if(this.slots.length == 5 ){
                return this.$toast.error('Only 5 slots are allowed.');
            }else{
                this.slots.push({
                    slot: '',
                })
            }
        },
        left_image() {
          const selectedFile = this.left_image[0];
          if (selectedFile) {
            const fileType = selectedFile.type;
            if (!fileType.startsWith('image/')) {
              this.$toast.error('Invalid file type. Only image files are allowed.');
              this.left_image = [];
            }
          }
          if (this.left_image.length > 1) {
            this.$toast.error('Please select a single image file.');
            this.left_image = [];
          }
        },
        bottom_image() {
          const selectedFile = this.bottom_image[0];
          if (selectedFile) {
            console.log("selectedFile",selectedFile)
            const fileType = selectedFile.type;
            if (!fileType.startsWith('image/')) {
              this.$toast.error('Invalid file type. Only image files are allowed.');
              this.bottom_image = [];
            }
          }
          if (this.bottom_image.length > 1) {
            this.$toast.error('Please select a single image file.');
            this.bottom_image = [];
          }
        },
        search_term() {
            if (this.search_term == '') {
                this.getAllAdvertisement(10, 0)
                this.page_value=1;
            } else {
                var num_array = ['0','1','2','3','4','5','6','7','8','9']
                var char_array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                if (num_array.some(char => this.search_term.includes(char)) && !char_array.some(char => this.search_term.includes(char))) {
                    var array = ['title', 'name'];
                } else {
                    var array = ['title', 'name'];
                }
                var num = 1;
                var payload = {
                    'arr': array,
                    'term': this.search_term,
                    'type': 'advertisement'
                }
                search(payload).then(data => {
                    this.advertisementList = data.rows.map(item => {
                        item.id = num++
                        return item
                    })
                });
            }
        },
    },
    methods: {
        removeField (index, type) {
            if(this.slots.length > 1) {
                this.slots = this.slots.filter((_field, i)  => i != index)
            }
        },
        directPage(limit, offset) {
            this.direct_page = offset.replace(/\D/g, '');
            if (offset == 1 || offset == '') {
                this.page_value = 1;
            } else {
                this.page_value = Math.max((offset * 10) - 9, 1);
            }
            if (this.page_value <= this.totalCount) {
                this.getAllAdvertisement(limit, this.page_value);
            }
        },
        getAllAdvertisement(limit, offset) {
            var num = (offset == 0) ? offset + 1 : offset;
            const loader = this.$loading.show({ width: 40, height: 40 });
            this.axios.get(config.host + 'advertisement/' + limit + '/' + offset).then(response => {
                loader.hide();
                this.totalCount = response.data.count;
                this.timestamp = new Date().getTime();
                this.advertisementList = response.data.rows.map(function (data, index) {
                    data.id = num++;
                    return data;
                })

            });
        },
        pageModification(type, data) {
            this.search_term = ''
            if (type == 'create') this.titles = 'Create Advertisement';
            else this.titles = 'Update Advertisement';
            this.showForm = true;
             if (type == 'update') {
                this.flag = 'Update';
                this.isUpdate = true;
                this.isCreate = false;
                this.frequency = data['frequency'];
                this.adv_id = data['adv_id']
                this.title = data['title'];
                this.slot = data['slot'];
            } else {
                this.flag = 'Create';
                this.isUpdate = false;
                this.isCreate = true;
            }
        },
        resetForm() {
            this.flag = '';
            this.title = '';
            this.slot = '';
            this.frequency = '',
            this.showForm = false;
            this.checkFrequency = false;
            this.checkSlot = false;
            this.checkTitle = false;
            this.getAllAdvertisement(10, 0);
            this.totalCount = '';
            this.page_value = this.page_value ?  this.page_value : 1;
            this.leftImageError = false
            this.bottomImageError = false
            this.left_image = []
            this.bottom_image = []
            this.slots = [{
                slot: '',
            }]
            this.slots_length = 0
            this.checkSlot = false
            this.slot = ''
        },
        errorCheck() {
        if (
            !this.checkTitle &&
           !this.checkFrequency && 
           !this.checkSlot
        ) { return true } else { return false }
        },
        submit(flag) {
            this.checkTitle = (!this.title) ? true : false;
            this.checkFrequency = (!this.frequency) ? true : false;
            this.checkSlot = (!this.slot) ? true : false;
            this.leftImageError = (!this.left_image[0] && this.isCreate) ? 'Upload Logo' : false;
            this.bottomImageError= (!this.bottom_image[0] && this.isCreate) ? 'Upload Logo' : false;
        
            if (!this.errorCheck()) return;

            // var vm = this;
            // var array = this.slots;
            // console.log(this.slots)

            // for (let index = 0; index < array.length; index++) {
            //     var map = array[index];
            //     if (map.slot == '')  {
            //         return vm.$toast.error("Fill the form correctly");
            //         return vm.showForm = true
            //         break;
            //     } 
            // }

            var payload = new FormData()
            payload.append('title', this.title)
            if(this.bottom_image && this.bottom_image[0]){
                payload.append('bottom_image', this.bottom_image[0])
            }
            if(this.left_image && this.left_image[0]){
                payload.append('left_image', this.left_image[0])
            }
            payload.append('frequency', this.frequency)
            payload.append('slot', (this.slot)); 
            
            let requestUrl;
            if (flag == 'Update') {
                payload['adv_id'] = this.adv_id
                requestUrl = this.axios.put(config.host + 'advertisement/' + this.adv_id, payload);
            } else if (flag == 'Create') {
                requestUrl = this.axios.post(config.host + 'advertisement/', payload);
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
            this.axios.delete(config.host + 'advertisement/' + data.adv_id).then(response => {
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
  
