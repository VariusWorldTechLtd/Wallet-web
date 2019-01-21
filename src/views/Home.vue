<template>
  <div>
    <nav class="navbar navbar-transparent navbar-absolute">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle"
                  data-toggle="collapse"
                  data-target="#navigation-example-2"
                  @click="toggleNavbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <div class="logo">
            <router-link to="/" tag="div" class="simple-text logo-mini">
                <div class="logo-img">
                    <a>
                      <img :src="logo" alt="" style="width:300px">
                    </a>
                </div>
            </router-link>
          </div>
          
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right">
            <router-link to="/" tag="li">
              <a>Home</a>
            </router-link>
            <router-link to="/about" tag="li">
              <a>About</a>
            </router-link>
          </ul>
        </div>
      </div>
    </nav>

    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page" data-color="azure"
           data-image="static/img/background/background-2.jpg" >
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-8 col-sm-12 col-md-offset-2">
                
                  <div class="card" data-background="color" data-color="blue">
                    <div class="card-header">
                      <h3 class="card-title"></h3>
                    </div>
                    <div class="card-content">
                      <div class="row">
                        <div class="col-md-6 col-sm-6 text-left">
                          <ol> 
                            <li><h5>1. Download VoX Wallet on your phone.</h5></li>
                            <li><h5>2. Press login within the app.</h5></li>
                            <li><h5>3. Point camera at the QR code displayed here.</h5></li>
                            <li><h5>4. Your account will automatically load.</h5></li>
                          </ol>
                        </div>
                        <div class="col-md-6 col-sm-6">
                          <div class="hello">
                            <div v-if="!showQr">
                              <button class="btn btn-primary" @click="syncAccount">Sync desktop wallet</button>
                            </div>
                            <div v-if="loading && showQr">
                              <p>Loading your QR code</p>
                            </div>
                            
                            <div v-if="showQr && !loading">
                              <img :src="logoV" alt="v" style="width:50px; position: absolute; transform: translate(-20px, 110px);" >
                              <qrcode-vue id="qr-code" :value="value" :size="size" level="L"></qrcode-vue>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-footer text-center">
                    </div>
                  </div>
            
              </div>
            </div>
          </div>
        </div>

        <footer class="footer footer-transparent">
          <div class="container">
            <div class="copyright">
              &copy; Coded with
              <i class="fa fa-heart heart"></i> by
              <a href="https://variusworldtech.com" target="_blank">Varius World Tech</a>.
            </div>
          </div>
        </footer>
        <div class="full-page-background" style="background-image: url(static/img/background/background-5.png) "></div>
      </div>
    </div>
    <div class="collapse navbar-collapse off-canvas-sidebar">
      <ul class="nav nav-mobile-menu">
        <router-link to="/" tag="li">
          <a>Home</a>
        </router-link>
        <br/>
        <router-link to="/about" tag="li">
          <a>About</a>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';

import loginContract from '../contracts/Login.json';

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      value: '',
      showQr: false,
      loading: false,
      size: 270,
      mnemonic: 'plunge journey march test patch zebra jeans victory any chest remember antique',
      // node: 'https://rinkeby.infura.io/dHRT6sR6UQHeGrLuM7JO'
      node: 'http://voxwallet.vwtbet.com:8545'
    };
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
  components: {
    QrcodeVue
  },
  mounted: async function () {

      let contractAddressFromLocalStorage = localStorage.getItem("loginContractAddress");
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

      let contractAddress;

      await contractABI
      .deploy({ data: loginContract.bytecode })
      .send({ from: accounts[0], gas: '1000000' }
      , function(error, transactionHash) { 
          console.log('transactionHash:', transactionHash);
        })
      .on('error', function(error){ 
        console.log('contract deploy error:', error);
      })
      .then(function(newContractInstance){
        console.log('newContractInstance:', newContractInstance.options.address) // instance with the new contract address
        contractAddress = newContractInstance.options.address;
      });

      console.log("contract address", contractAddress);
      this.value = contractAddress;
      localStorage.setItem("loginContractAddress", contractAddress);
      console.log("AFTER local storage loginContractAddress:", localStorage.getItem("loginContractAddress"));

      console.log("this.value", this.value);

      this.loading = false;
      //this.showQr = !this.showQr;

  },
  methods: {
    toggleNavbar () {
      document.body.classList.toggle('nav-open')
    },
    closeMenu () {
      document.body.classList.remove('nav-open')
      document.body.classList.remove('off-canvas-sidebar')
    },
    syncAccount () {
      this.showQr = true;
    },
    beforeDestroy () {
      this.closeMenu()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
