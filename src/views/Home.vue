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
      <div class="full-page login-page" data-color=""
           data-image="static/img/background/background-2.jpg">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                
                  <div class="card" data-background="color" data-color="blue">
                    <div class="card-header">
                      <h3 class="card-title">Login</h3>
                    </div>
                    <div class="card-content">
                        <div class="hello">
    
                        <!-- <h2>Essential Links</h2> -->
                        <ul>
                          <li><button class="btn btn-wd" v-if="!showQr" id="login" @click="generateQrCode">Login</button></li>
                        </ul>
                          
                        <div>
                          <qrcode-vue v-if="showQr" id="qr-code" :value="value" :size="size" level="L"></qrcode-vue>
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
        <router-link to="/register" tag="li">
          <a>Register</a>
        </router-link>
        <router-link to="/admin/overview" tag="li">
          <a>Dashboard</a>
        </router-link>
      </ul>
    </div>
  </div>
</template>




<script>
import QrcodeVue from 'qrcode.vue';

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      value: '0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d',
      showQr: false,
      size: 270
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
  },
  components: {
    QrcodeVue
  },
  methods: {
      toggleNavbar () {
        document.body.classList.toggle('nav-open')
      },
      closeMenu () {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      },
      generateQrCode: function () {
      console.log('test', this.showQr);
      this.showQr = !this.showQr;
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
