// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

const voxnetRpcUrl = 'https://voxwallet2.vwtbet.com:8545';
const voxnetWs = 'wss://voxwallet2.vwtbet.com:8546';

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3')
const vssoToken = require('../../../src/contracts/truffle/build/contracts/VssoToken.json');
const loginSession = require('../../../src/contracts/truffle/build/contracts/LoginSession.json');
const vssoTokenAddress = '0x92fCc43e8FEda3CF74BF2A1A70fC456008Bd5b3C';

const syncAccountsButton = 'button[name=sync]';
const qrCodeButton = 'div[name=qrcode]';
const walletAddressDiv = 'div[class=wallet-address]';

const firstnameSpan = 'span[id=firstname]';
const lastnameSpan = 'span[id=lastname]';
const ageSpan = 'span[id=age]';
const genderSpan = 'span[id=gender]';

const logoutButton = 'button[name=logout]';

let loginSessionContractAddress = '';

let browser;

module.exports = {
  '\n\
   In order to view account on web \n\
   As a Consumer \n\
   I want to login via QR code like whatsapp web'
  : theBrowser => {
    browser = theBrowser

      GIVEN_I_have_a_clean_profile();
      and_I_have_requested_a_login_QR();
      WHEN_I_login_by_sending_VSSO_tokens_to_the_qr_address_and_data('firstname', 'lastname', 44, 'gender'); // simulating mobile action
      THEN_I_am_logged_in_to_dashboard();
      and_my_details_are_present('firstname', 'lastname', 44, 'gender');
      and_I_can_logout();
      
    browser.end();
  }
}

function GIVEN_I_have_a_clean_profile() {
  browser
    .url(process.env.VUE_DEV_SERVER_URL)
    .waitForElementVisible('#app', 5000)
    .execute(clearLocalStorage());
}

function and_I_have_requested_a_login_QR() {
  browser
    .assert.elementPresent('.hello')
    .waitForElementVisible(syncAccountsButton, 1000)
    .click(syncAccountsButton)
    .waitForElementVisible(qrCodeButton, 10000);
}

function WHEN_I_login_by_sending_VSSO_tokens_to_the_qr_address_and_data(firstname, lastname, age, gender) {
  browser
    .getAttribute(qrCodeButton, 'value', async function (result) {
      loginSessionContractAddress = result.value;
      let mnemonic = 'plunge journey march test patch zebra jeans victory any chest remember antique';
      const web3 = new Web3();
      web3.setProvider(new HDWalletProvider(mnemonic, voxnetRpcUrl));

      await sendTokensTo(loginSessionContractAddress, web3);
      await saveUserData(web3, firstname, lastname, age, gender);
    });
  return loginSessionContractAddress;
}

function THEN_I_am_logged_in_to_dashboard() {
  browser
    .waitForElementVisible(walletAddressDiv, 10000)
    .assert.containsText(walletAddressDiv, loginSessionContractAddress);
}

function and_my_details_are_present(firstname, lastname, age, gender) {
  browser
    .waitForElementVisible(firstnameSpan, 20000)
    .assert.containsText(firstnameSpan, firstname)
    .assert.containsText(lastnameSpan, lastname)
    .assert.containsText(ageSpan, age)
    .assert.containsText(genderSpan, gender);
}

function and_I_can_logout() {
  browser
    .click(logoutButton)
    .waitForElementVisible('.hello', 5000);
}

async function sendTokensTo(toAddress, web3) {
  let accounts = await web3.eth.getAccounts();
  console.log('sending from account0', accounts[0], 'to', toAddress);
  let contract = new web3.eth.Contract(vssoToken.abi, vssoTokenAddress);
  await contract.methods.transfer(toAddress, web3.utils.toWei('0.00001'))
    .send({ from: accounts[0], gasPrice: 0, gas: 1000000, }).then().catch(console.error);
}

function clearLocalStorage() {
  return function () {
    window.localStorage.clear();
    return true;
  };
}

async function onSaveSessionEvent(action) {
  const web3ws = new Web3(new Web3.providers.WebsocketProvider(voxnetWs));
  let loginSessionContractWs = new web3ws.eth.Contract(loginSession.abi, loginSessionContractAddress);
    
  const options = {
    filter: {
      // _from:  process.env.WALLET_FROM,
      // _to: contractAddress,
      // _value: process.env.AMOUNT
    },
    fromBlock: 'latest'
  };
  loginSessionContractWs.once('SaveSessionEvent', options, async (error, event) => {
    if (error) {
      console.log(error);
      successCallback(false);
    }
    await action();
  });
}

async function saveUserData(web3, firstname, lastname, age, gender) {
  let accounts = await web3.eth.getAccounts();

  let loginSessionContract = new web3.eth.Contract(loginSession.abi, loginSessionContractAddress);

  await loginSessionContract.methods.SaveData(firstname, lastname, age.toString(), gender)
    .send({ from: accounts[0], gasPrice: 0, gas: 990000 })
    // .on('receipt', receipt => {
    //   transactionHash = receipt.transactionHash;
    // })
    .on('error', error => {
      console.log('error', error);
    })
    .then(console.log('sent user data to: ' + loginSessionContractAddress))
    .catch(console.error);
}