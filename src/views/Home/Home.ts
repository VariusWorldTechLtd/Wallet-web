import QrcodeVue from 'qrcode.vue';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import Vue from 'vue';
import Component from 'vue-class-component';

import loginContract from '../../contracts/Login.json';

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
  private msg: string = 'Welcome to Your Vue.js App';
  private value: string = '';
  private showQr: boolean = false;
  private loading: boolean = false;
  private size: number = 270;
  private mnemonic: string = 'plunge journey march test patch zebra jeans victory any chest remember antique';
  private node: string = 'https://rinkeby.infura.io/dHRT6sR6UQHeGrLuM7JO';
  // private node: string = 'http://voxwallet.vwtbet.com:8545';

  private async mounted() {
    let contractAddressFromLocalStorage = localStorage.getItem('loginContractAddress');
    if (contractAddressFromLocalStorage) {
      this.value = contractAddressFromLocalStorage;
      console.log('found loginContractAddress in local storage', contractAddressFromLocalStorage);
      this.showQr = true;
      return;
    }

    this.loading = true;
    console.log('this.mnemonic', this.mnemonic);
    console.log('this.node', this.node);

    const provider = new HDWalletProvider(this.mnemonic, this.node);
    const web3 = new Web3(provider);

    console.log('web3', web3);

    const accounts = await web3.eth.getAccounts();
    console.log('accounts', accounts[0]);

    const contractABI = new web3.eth.Contract(loginContract.abi);
    let contractAddress: string = '';

    await contractABI
      .deploy({ data: loginContract.bytecode })
      .send({ from: accounts[0], gas: '1000000' }
        , function(error: any, transactionHash: string) {
          console.log('transactionHash:', transactionHash);
        })
      .on('error', function(error: any) {
        console.log('contract deploy error:', error);
      })
      .then(function(newContractInstance: any) {
        console.log('newContractInstance:', newContractInstance.options.address)
        contractAddress = newContractInstance.options.address;
      });

    console.log('contract address', contractAddress);
    this.value = contractAddress;
    localStorage.setItem('loginContractAddress', contractAddress);

    console.log('this.value', this.value);

    this.loading = false;
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
