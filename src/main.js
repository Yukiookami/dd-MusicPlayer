import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'
import VueCookies from 'vue-cookies'
import md5 from 'js-md5';

Vue.use(VueCookies)
Vue.use(VueLazyLoad,{
})
Vue.use(iView);

Vue.prototype.$md5 = md5;
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')