import Vue from 'vue';
import Component from 'vue-class-component';
import router from '@/router';
import VIP from '../../ethereum/VIP';

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

  private firstname: string = '';
  private lastname: string = '';
  private age: string = '';
  private gender: string = '';

  private logout() {
    localStorage.clear();
    router.push('/');
  }

  private async mounted() {
    const vip = new VIP();

    let userDataFromLocal = localStorage.getItem('userData');

    if (userDataFromLocal) {
      this.updateUserDataModel(JSON.parse(userDataFromLocal));
    } else {
      await vip.GetUserData((userData: any) => {
        localStorage.setItem('userData', JSON.stringify(userData));
        this.updateUserDataModel(userData);
      });
    }
  }

  private updateUserDataModel(userData: any) {
    this.firstname = userData.firstname;
    this.lastname = userData.lastname;
    this.age = userData.age;
    this.gender = userData.gender;
  }
};
