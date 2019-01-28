import QrcodeVue from 'qrcode.vue';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import Vue from 'vue';
import Component from 'vue-class-component';
import Router from '../../router';
import ERC20 from '../../ethereum/ERC20';

import loginContract from '../../contracts/truffle/build/contracts/LoginSession.json';

import {RPC_ENDPOINT, WS_ENDPOINT} from '../../globalConstants';

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
  private qrColor: string = 'black';

  private mnemonic: string = 'plunge journey march test patch zebra jeans victory any chest remember antique';

  private async mounted() {
    let contractAddressFromLocalStorage = localStorage.getItem('loginContractAddress');
    const erc20 = new ERC20();

    if (contractAddressFromLocalStorage) {
      this.value = contractAddressFromLocalStorage;
      console.log('found loginContractAddress in local storage', contractAddressFromLocalStorage);
      this.showQr = true;

      erc20.watchTokenTransfers(contractAddressFromLocalStorage, function callback(success: boolean) {
        if (success) {
          Router.push('Dashboard')
        }
      });

      return;
    }

    this.loading = true;

    console.log('rpcEndpoint', RPC_ENDPOINT);

    const web3 = new Web3();
    const account = web3.eth.accounts.create();
    console.log('account', account);

    localStorage.setItem('account', account.privateKey);

    web3.setProvider(new HDWalletProvider(this.mnemonic, RPC_ENDPOINT));

    const accounts = await web3.eth.getAccounts();
    console.log('account0',accounts[0]);

    const contract = new web3.eth.Contract(loginContract.abi);
    let contractAddress: string = '';

    await contract
      .deploy({ data: loginContract.bytecode })
      .send({ from: accounts[0], gas: '1000000'}//, gasPrice: '0' }
        , function(error: any, transactionHash: string) {
          if (error) console.log(error);
          // else console.log('transactionHash', transactionHash);
        })
      .on('error', function(error: any) {
        console.log('contract deploy error:', error);
      })
      .on('receipt', (receipt: any) => {
        // receipt example
        console.log(receipt);
      })
      .then(function(newContractInstance: any) {
        console.log("asdfasdf")
        contractAddress = newContractInstance.options.address;
      });

    console.log('contract address', contractAddress);
    this.value = contractAddress;
    localStorage.setItem('loginContractAddress', contractAddress);

    console.log('this.value', this.value);

    this.loading = false;

    erc20.watchTokenTransfers(contractAddress, function callback(success: boolean) {
      if (success) {
        Router.push('Dashboard')
      }
    });
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
