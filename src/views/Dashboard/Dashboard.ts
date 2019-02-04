import Vue from 'vue';
import Component from 'vue-class-component';
import router from '@/router';

@Component({
  template: './Dashboard',
  components: {
  },
  props: {
    title: {
      type: String,
      default: 'VoX Merchant Wallet'
    },
    logo: {
      type: String,
      default: 'static/img/voxwallet-logo.png'
    },
    logoV: {
      type: String,
      default: 'static/img/V.png'
    }
  },
})

export default class DashboardComponent extends Vue {
  private myWalletAddress: string|null = localStorage.getItem('myMobileWalletAddress');

  private logout() {
    localStorage.clear();
    router.push('/');
  }
};
