const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3')
const vssoToken = require('../VssoToken.json');
const vssoTokenAddress = '0x92fCc43e8FEda3CF74BF2A1A70fC456008Bd5b3C';
const hotWalletMnemonic = 'plunge journey march test patch zebra jeans victory any chest remember antique';
const voxnetRpc = 'https://voxwallet.vwtbet.com:8545'

//const https = require('https')
const http = require('http')
const axios = require('axios')

async function getVssoTokenBalance(addressToTopUp) {
    const web3 = new Web3(new HDWalletProvider(hotWalletMnemonic, voxnetRpc));
    let contract = new web3.eth.Contract(vssoToken.abi, vssoTokenAddress);
    return await contract.methods.balanceOf(addressToTopUp)
        .call()
}

describe("VssoFaucet", function() {

  describe("#send1token", function() {
    it("should throw an exception if song is already playing", async function() {
      const addressToTopUp = '0xA99d5e2b4b300657E2Bff6668257CB70a5311356';
      var baseUrl = 'http://localhost:3000';

      let balanceBefore = 0
      let balanceAfter = 0

      balanceBefore = await getVssoTokenBalance(addressToTopUp);
      console.log('balanceBefore', balanceBefore)
      
      let url = baseUrl + '/?address=' + addressToTopUp

      const getData = async url => {
        try {
          const response = await axios.get(url)
          const data = response.data;
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };

      await getData(url);

      balanceAfter = await getVssoTokenBalance(addressToTopUp);
      console.log('balanceAfter', balanceAfter)
      
      expect(balanceAfter - balanceBefore).toEqual(1*1000000000000000000);
    });
  });
});
