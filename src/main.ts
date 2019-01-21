import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueNotify from 'vue-notifyjs'
import VeeValidate from 'vee-validate'
import locale from 'element-ui/lib/locale'
import store from './store';

import GlobalComponents from './globalComponents';
import GlobalDirectives from './globalDirectives';
import SideBar from './components/UIComponents/SidebarPlugin';

import './assets/sass/paper-dashboard.scss';
import './assets/sass/element_variables.scss';
import './assets/sass/demo.scss';

import sidebarLinks from './sidebarLinks';
Vue.config.productionTip = false;

Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(VeeValidate)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
