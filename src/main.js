import { createApp } from 'vue';
import App from './App.vue';
import { createVuestic } from 'vuestic-ui';
import 'vuestic-ui/css';
import router from './router/index';
import VueSidePanel from 'vue3-side-panel';
import 'vue3-side-panel/dist/vue3-side-panel.css';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import Toaster from "@meforma/vue-toaster";
import VueApexCharts from 'vue3-apexcharts';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import {sessionExpiry} from '@/module/sessionExpired.js';

const app = createApp(App);
app.use(createVuestic());
app.use(router);
app.use(VueCookies);
app.use(VueSidePanel);
app.use(LoadingPlugin);
app.use(VueApexCharts);
app.use(Toaster, { position: "bottom", duration: 4000 });
app.config.globalProperties.axios = axios;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
app.mount('#app');

const disableForwardBackwardNavigation = () => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.forward(1);
    };
};

disableForwardBackwardNavigation();
let isIntercepted = false;
axios.interceptors.request.use(
    request => {
        if (app.$cookies.get('web-x-access-token')) {
            request.headers['x-access-token'] = app.$cookies.get('web-x-access-token');
            sessionExpiry(30);
        };
        return request;
    }
);

axios.interceptors.response.use(
    response=>{
        console.log("res",response)
        return response
    },
    res_err=>{
        if(res_err && res_err.response) {
            if(res_err.response.status==401||res_err.response.status==403){
                if(!isIntercepted){
                    isIntercepted = true;
                    router.push({name:'Logout'});
                    app.$toast.error("Session Got Expired. Kindly Login!");
                };
            }else if(res_err.response.status==404){
                app.$toast.error("No permission to access this page!");
            } else {
                console.log("err................",res_err)
                return Promise.reject(res_err)
            }
        } else {
            console.log("dsasadasffsafsdf",res_err)
            return Promise.reject(res_err)
        }
    }
);