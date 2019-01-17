<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <h2>Essential Links</h2> -->
    <ul>
     
      <li><button v-if="!showQr" id="login" @click="generateQrCode">Login</button></li>
    </ul>
      
    <div>
      <qrcode-vue v-if="showQr" id="qr-code" :value="value" :size="size" level="L"></qrcode-vue>
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
      size: 500
    };
  },
  components: {
    QrcodeVue
  },
  methods: {
    generateQrCode: function () {
      console.log('test', this.showQr);
      this.showQr = !this.showQr;
    },
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
