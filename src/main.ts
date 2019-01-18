import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'

import './assets/sass/paper-dashboard.scss';
import './assets/sass/element_variables.scss';
import './assets/sass/demo.scss';

import sidebarLinks from './sidebarLinks'
Vue.config.productionTip = false;

Vue.use(SideBar, {sidebarLinks: sidebarLinks})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
