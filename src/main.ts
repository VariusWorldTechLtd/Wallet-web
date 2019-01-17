import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/sass/paper-dashboard.scss';
import './assets/sass/element_variables.scss';
import './assets/sass/demo.scss';

Vue.config.productionTip = false;



new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
