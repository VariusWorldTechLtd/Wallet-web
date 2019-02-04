// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3')
const vssoToken = require('../../../src/contracts/truffle/build/contracts/VssoToken.json');
const vssoTokenAddress = '0x92fCc43e8FEda3CF74BF2A1A70fC456008Bd5b3C';

module.exports = {
  
  'default e2e tests': browser => {
    let mnemonic = 'plunge journey march test patch zebra jeans victory any chest remember antique';
    let loginSessionContractAddress = '';

    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .execute(function() {
        window.localStorage.clear();
        return true;
      })
      .assert.elementPresent('.hello')
      .waitForElementVisible('button[name=sync]', 1000)
      .click('button[name=sync]')
      .waitForElementVisible('div[name=qrcode]', 10000)
      .getAttribute('div[name=qrcode]', 'value', async function(result) {
        loginSessionContractAddress = result.value;
        const web3 = new Web3();
        web3.setProvider(new HDWalletProvider(mnemonic, 'https://voxwallet2.vwtbet.com:8545'));
        let accounts = await web3.eth.getAccounts();
        console.log('account0', accounts[0]); 

        let contract = new web3.eth.Contract(vssoToken.abi, vssoTokenAddress);
        let transferResult = await contract.methods.transfer(loginSessionContractAddress, web3.utils.toWei('0.00001'))
          .send({from: accounts[0], gasPrice:0, gas: 1000000,}).then(console.log).catch(console.error);
      })
      .waitForElementVisible('span[name=walletAddress]', 10000)
      .assert.containsText('span[name=walletAddress]', loginSessionContractAddress)
      //.click('button[name=logout]')
      .end()
  }
}
