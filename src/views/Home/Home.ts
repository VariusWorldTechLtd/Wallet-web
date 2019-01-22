import QrcodeVue from 'qrcode.vue';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import Vue from 'vue';
import Component from 'vue-class-component';
import Decimal from 'decimal.js';

import Router from '../../router';

import loginContract from '../../contracts/Login.json';

const WEI = 1000000000000000000

const ethToWei = (amount: number) => new Decimal(amount).times(WEI)

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
  private nodeWs: string = 'wss://rinkeby.infura.io/ws';

  private async mounted() {
    let contractAddressFromLocalStorage = localStorage.getItem('loginContractAddress');
    if (contractAddressFromLocalStorage) {
      this.value = contractAddressFromLocalStorage;
      console.log('found loginContractAddress in local storage', contractAddressFromLocalStorage);
      this.showQr = true;
      this.watchEtherTransfers(this.value)
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
        , function (error: any, transactionHash: string) {
          console.log('transactionHash:', transactionHash);
        })
      .on('error', function (error: any) {
        console.log('contract deploy error:', error);
      })
      .then(function (newContractInstance: any) {
        console.log('newContractInstance:', newContractInstance.options.address)
        contractAddress = newContractInstance.options.address;
      });

    console.log('contract address', contractAddress);
    this.value = contractAddress;
    localStorage.setItem('loginContractAddress', contractAddress);

    console.log('this.value', this.value);

    this.loading = false;
    this.watchEtherTransfers(this.value);
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

  private watchEtherTransfers(contractAddress: string) {
    // Instantiate web3 with WebSocket provider
    const provider = new HDWalletProvider(this.mnemonic, this.node);

    const web3 = new Web3(provider);
    const web3ws = new Web3(this.nodeWs);
    
    // Instantiate subscription object
    const subscription = web3ws.eth.subscribe('pendingTransactions')

    // Subscribe to pending transactions
    subscription.subscribe((error: any, result: any) => {
      if (error) console.log(error)
    })
      .on('data', async (txHash: string) => {
        try {
          //console.log('pending: ' + txHash);
          // Get transaction details
          const trx = await web3.eth.getTransaction(txHash)

          if (!trx || !trx.to)
            return;
          // matches deployed login contract
          const valid =  trx.to.toLowerCase() === contractAddress.toLowerCase()
          // If transaction is not valid, simply return
          if (!valid) return

          console.log('Found incoming Ether transaction to ' + contractAddress);

          console.log('Transaction', + trx)
          console.log('Transaction hash is: ' + txHash + '\n')
          
          // Initiate transaction confirmation
          //this.confirmEtherTransaction(txHash)

          // Unsubscribe from pending transactions.
          subscription.unsubscribe()
          Router.push('/dashboard');
        } catch (error) {
          console.log(error)
        }
      });

  }

  private async getConfirmations(txHash: string) {
    try {
      // Instantiate web3 with HttpProvider
      const provider = new HDWalletProvider(this.mnemonic, this.node);
      const web3 = new Web3(provider);
      // Get transaction details
      const trx = await web3.eth.getTransaction(txHash)
      // Get current block number
      const currentBlock = await web3.eth.getBlockNumber()
      // When transaction is unconfirmed, its block number is null.
      // In this case we return 0 as number of confirmations
      return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
    } catch (error) {
      console.log(error)
      return 0;
    }
  };

  private confirmEtherTransaction(txHash: string, confirmations = 1) {
    setTimeout(async () => {
      // Get current number of confirmations and compare it with sought-for value
      const trxConfirmations = await this.getConfirmations(txHash)
      console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)')

      if (trxConfirmations >= confirmations) {
        // Handle confirmation event according to your business logic

        console.log('Transaction with hash ' + txHash + ' has been successfully confirmed')

        return
      }
      // Recursive call
      return this.confirmEtherTransaction(txHash, confirmations)
    }, 30 * 1000)
  }
};
