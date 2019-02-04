import QrcodeVue from 'qrcode.vue';

import Vue from 'vue';
import Component from 'vue-class-component';
import Router from '../../router';
import ERC20 from '../../ethereum/ERC20';
import VIP from '../../ethereum/VIP';
import Clipboard from 'v-clipboard';
import swal from 'sweetalert2';

import {RPC_ENDPOINT, WS_ENDPOINT, VSSO_TOKEN_ADDRESS} from '../../globalConstants';

Vue.use(Clipboard);

@Component({
  template: './Home',
  components: {
    QrcodeVue
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

export default class HomeComponent extends Vue {
  private loginSessionContractAddress: string = '';
  private showQr: boolean = false;
  private loading: boolean = false;
  private size: number = 270;
  private qrColor: string = 'black';

  private async mounted() {
    console.log('RPC_ENDPOINT', RPC_ENDPOINT);
    console.log('VSSO_TOKEN_ADDRESS', VSSO_TOKEN_ADDRESS);
    let contractAddressFromLocalStorage = localStorage.getItem('loginContractAddress');
    const erc20 = new ERC20();
    const vip = new VIP();

    if (contractAddressFromLocalStorage) {
      this.loginSessionContractAddress = contractAddressFromLocalStorage;
      console.log('LoginSession contract address (from local)', contractAddressFromLocalStorage);
      this.showQr = true;
    }  else {
      this.loading = true;
      const self = this;
      await vip.deployLoginSessionContract(function callback(contractAddress: string) {
        console.log('LoginSession contract address', contractAddress);
        self.loginSessionContractAddress = contractAddress;
        localStorage.setItem('loginContractAddress', contractAddress);
        self.loading = false;
      });
    }
    erc20.watchTokenTransfers(this.loginSessionContractAddress, function callback(success: boolean) {
      if (success) {
        Router.push('dashboard')
      }
    });
  }

  private showSweetAlert(type: string) {
    if (type === 'copied') {
      swal({
        title: 'Contract address copied.',
        // text: 'I will close in 1 second.',
        timer: 700,
        showConfirmButton: false
      })
    }
  }

  private toggleNavbar() {
    document.body.classList.toggle('nav-open');
  }
  private closeMenu() {
    document.body.classList.remove('nav-open');
    document.body.classList.remove('off-canvas-sidebar');
  }
  private syncAccount() {
    this.showQr = true;
  }
  private beforeDestroy() {
    this.closeMenu();
  }
};
