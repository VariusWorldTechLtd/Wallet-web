import QrcodeVue from 'qrcode.vue';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import Vue from 'vue';
import Component from 'vue-class-component';
import Router from '../../router';
import ERC20 from '../../ethereum/ERC20';
import Clipboard from 'v-clipboard';
import swal from 'sweetalert2';

import loginSessionContract from '../../contracts/truffle/build/contracts/LoginSession.json';

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

    if (contractAddressFromLocalStorage) {
      this.loginSessionContractAddress = contractAddressFromLocalStorage;
      console.log('LoginSession contract address (from local)', contractAddressFromLocalStorage);
      this.showQr = true;
    }  else {
      this.loading = true;

      const web3 = new Web3();
      const account = web3.eth.accounts.create();
      web3.setProvider(new HDWalletProvider(account.privateKey, RPC_ENDPOINT));
      localStorage.setItem('accountPrivateKey', account.privateKey);

      let accounts = await web3.eth.getAccounts();
      console.log('account0', accounts[0]);

      const contract = new web3.eth.Contract(loginSessionContract.abi);
      let contractAddress: string = '';

      await contract
        .deploy({ data: loginSessionContract.bytecode })
        .send({ from: accounts[0], gas: '1000000', gasPrice: '0' }
          , function(error: any, transactionHash: string) {
            if (error) console.log(error);
          })
        .on('error', function(error: any) {
          console.log('contract deploy error:', error);
        })
        .on('receipt', (receipt: any) => {
          // console.log('receipt', receipt);
        })
        .then(function(newContractInstance: any) {
          contractAddress = newContractInstance.options.address;
        });

      console.log('LoginSession contract address', contractAddress);
      this.loginSessionContractAddress = contractAddress;
      localStorage.setItem('loginContractAddress', contractAddress);

      this.loading = false;
    }
    erc20.watchTokenTransfers(this.loginSessionContractAddress, function callback(success: boolean) {
      if (success) {
        Router.push('Dashboard')
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
