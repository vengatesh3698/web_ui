<template>
  <div class="mt-5" style="height:33rem">
    <div class="container">
      <div>
        <span class="pageHeader">Welcome back, {{ name }}</span><br>
        <span class="pageDesc">Dashboard Overview</span>
      </div>
    
      <div class="container">
        <div class="mt-2">
          <span class="pageDesc mr-4">Available amount</span><br>
          <span class="pageHeader"> ₹ {{ creditAmount }}</span>
        </div>
      </div>
    </div>
    <div class="flex row" style="margin-top:3.9rem">
      <va-card v-for="view in cardViewer" class="cardtitles" style="background-color: #E7E7E7;">
        <br>
        <img :src="require(`@/assets/dashboard/${view.image}`)" class="ml-5 cardImage" height="20" />
        <span class="ml-5 heading">{{ view.name }}</span><br><br>
        <span class="ml-5 count"><b>{{ view.count }}</b></span><br>
       <!--  <va-progress-bar class="ml-5 mt-3 mb-2" size="small" :model-value="value" :color="view.progressBarColor"
          style="width: 200px;" />
        <span class="total-view ml-5" :style="{ color: view.progressBarColor }">{{ view.total }}</span>
        <span class="heading ml-1" style="font-weight:normal;">{{ view.string }}</span> -->
      </va-card>
    </div>
    <div class="row mt-4">
<!--       <div class="flex md6 pr-3">
        <va-card style="height: 100%;border-radius: 1rem;">
          <br />
          <div class="row">
            <span class="ml-3 heading"><b>Most sold Foods of the month</b></span>
            <span class="ml-auto mr-4 heading">No.Qty</span>
          </div>
          <div class="mt-3 ml-3" style="border-bottom: 1.5px dashed #696969;width: 96%!important;"></div>
          <div class="content1">
            <div v-for="list in soldFoodsList" class="containers1 mt-4">
              <div>
                <img :src="(list.image)" alt="no image" class="ml-5" height="39" />
                 
                <va-badge v-if="list.isVegetarian" class="mb-4 ml-3" color="success" dot visible-empty>
                </va-badge>
                <va-badge v-if = "!list.isVegetarian" class="mb-4 ml-3" color="danger" dot visible-empty>
                </va-badge>
              </div>
              <div style="display: flex;width: 80%; justify-content: space-between;">
                <span class="ml-5 mt-3">{{ list.listName }}</span>
                <span class="mr-5 mt-3">{{ list.count }}</span>
              </div>

            </div>
          </div>
        </va-card>
      </div> -->

<!--       <div class="flex md6 pr-3">
        <va-card style="height: 100%;border-radius: 1rem;">
          <br>
          <div class="row">
            <span class="ml-3 heading"><b>Most requested services of the month</b></span>
            <span class="ml-auto mr-4 heading">No.Times</span>
          </div>
          <div class="mt-3 ml-3" style="border-bottom: 1.5px dashed #696969;width: 96%!important;"></div>
          <div class="content">
            <div v-for="demo in serviceLists" class="containers mt-4">
              <div style="width:13%">
                <img :src="(demo.image)" alt="no image" class="ml-5 mt-2" height="25" />
              </div>
              <div style="width:86%; display: flex; justify-content: space-between;">
                <span class="mr-auto ml-5 mt-3">{{ demo.packageName }}</span>
                <span class="mr-5 mt-3">{{ demo.count }}</span>
              </div>
          
          
          </div>
          </div>
        </va-card>
      </div> -->
    </div>
  </div>
</template>

<script>
import config from '@/router/config.json';
export default {
  data() {
    return {
      value: 35,
      name: this.$cookies.get('username'),  
      role: this.$cookies.get('role'),
      cardViewer: [
        {
          name: 'Total Subscriptions',
          count: '0',
          image: 'subscription.jpg',
          progressBarColor: '#F7751A',
          total: '0',
          string: 'Yet to occupy'
        },
        {
          name: 'Total Channels',
          count: '0',
          image: 'tv.png',
          progressBarColor: '#62974C',
          total: '0 Occupied',
          string: 'Today'
        },
        {
          name: 'Total Packages',
          count: '0',
          image: 'bundles.png',
          progressBarColor: '#9E6E37',
          total: '0 Orders',
          string: 'Today'
        },
        {
          name: 'Total Inventory',
          count: '0',
          image: 'stb.png',
          progressBarColor: '#086AD8',
          total: '0 Requests',
          string: 'Today'
        }
      ],

      serviceLists: [],
      soldFoodsList:[],
      dashboardDetails:[],
      creditAmount:''
    };
  },
  created() { 
    this.getDashboardDetails();
    this.getDashboardCost();
  },
  methods: {
  getDashboardDetails(){
    var vm =this
    const loader=this.$loading.show({width:40,height:40});
    this.axios.get(config.host+'dashboard/').then(response=>{
      loader.hide()
      this.dashboardDetails=response.data;
      this.cardViewer.map(list=>{
        if(list.name=='Total Channels'){ 
          list.count=this.dashboardDetails.channel
        }
        if(list.name=='Total Packages'){ 
          list.count=this.dashboardDetails.package
        } if(list.name=='Total Inventory'){ 
          list.count=this.dashboardDetails.inventory
        }
	      if(list.name=='Total Subscriptions'){ 
          list.count=this.dashboardDetails.active_inventory
        }
      })
    })
  },
  getDashboardCost() {
    const loader = this.$loading.show({ width: 40, height: 40 });
    this.axios.get(config.host + 'credit').then(response => {
      console.log(JSON.stringify(response.data))
      if (response.data.msg === "No Transaction found") {
        this.creditAmount = 0;
      } else {
        this.creditAmount = response.data.msg.toFixed(2);
      }
      loader.hide()
    }, err => {
      loader.hide()
      this.creditAmount = 0;
    })
  },
  },
};
</script>

<style>
.cardImage {
  position: absolute;
  right: 1rem;
  width: 2.5rem;
  height: fit-content;
}

.cardtitles {
  height: 7rem;
  width: 7.5rem;
  margin: 0rem 0.5rem 0 0;
  border-radius: 0.5rem;
}

.count {
  font-weight: bolder;
  color: black;
}

.total-view {
  font-size: small;
}

.buttonToggle {
  position: absolute;
  right: 0.7rem;
  top: 0.9rem;
  border-radius: 3px;
  overflow: hidden;
}

.heading {
  font-size: 0.9rem;
  color: black !important;
}

.button {
  font-size: 10px;
  height: 20px;
}

.content {
  font-size: small;
  height: 280px;
}

.content1 {
  font-size: small;
  height: 350px;
  overflow: auto;
}

.containers:nth-child(odd) {
  background-color: #f1f1f1;
  width: 100%;
  height: 40px;
}

.containers:nth-child(even) {
  background-color: ghostwhite;
  width: 100%;
  height: 40px;
}
.containers {
  display: flex !important;
}

.containers1:nth-child(odd) {
  background-color: #f1f1f1;
  opacity: 80%;
  width: 100%;
  height: 40px;
}

.containers1:nth-child(even) {
  background-color: ghostwhite;
  width: 100%;
  height: 42px;
}


.containers1 {
  display: flex !important;
}

.content1::-webkit-scrollbar {
  display: none;
}

.content1 {
  scrollbar-width: none;
}
</style>
