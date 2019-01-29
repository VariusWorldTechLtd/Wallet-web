// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3')

module.exports = {
  

  'default e2e tests': browser => {
    let mnemonic = 'plunge journey march test patch zebra jeans victory any chest remember antique';

    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .execute(function() {
        window.localStorage.clear();
        return true;
      })
      .assert.elementPresent('.hello')
      //.assert.containsText('h1', 'Welcome to Your Vue.js + TypeScript App')
      //.assert.elementCount('img', 1)
      .waitForElementVisible('button[name=sync]', 1000)
      .click('button[name=sync]')
      .waitForElementVisible('div[name=qrcode]', 10000)
      .getAttribute('div[name=qrcode]', 'value', function(result) {
        contractAddress = result.value;
        const web3 = new Web3();
        web3.setProvider(new HDWalletProvider(mnemonic, 'https://voxwallet.vwtbet.com:8545'));
        //let accounts = await web3.eth.getAccounts();
        let accounts = web3.eth.getAccounts();
        console.log('account0', accounts[0]);    // undefined because line above needs await
        web3.eth.sendTransaction({
          from: accounts[0],
          to: contractAddress,
          value: '10000000000000'
        });
      })
      .end()
  }
}
