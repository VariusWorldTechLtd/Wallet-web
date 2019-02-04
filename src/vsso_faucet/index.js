const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3')
const vssoToken = require('./VssoToken.json');
const vssoTokenAddress = '0x92fCc43e8FEda3CF74BF2A1A70fC456008Bd5b3C';
const hotWalletMnemonic = 'plunge journey march test patch zebra jeans victory any chest remember antique';
const voxnetRpc = 'https://voxwallet2.vwtbet.com:8545'

const numberOfTokensToIssue = '1';
const express = require('express')
var cors = require('cors')

const app = express()
app.use(cors())
const port = 3000
app.options('*', cors())

app.get('/', async (req, res) => {
  try {
    let transactionHash = '';

    const address = req.query.address;

    if (!address) {
        res.send('Usage: GET to https://' + req.headers.host + '?address=ethereum_address_here')
        return
    }

    const web3 = new Web3(new HDWalletProvider(hotWalletMnemonic, voxnetRpc));

    let accounts = await web3.eth.getAccounts();
    console.log('hotwalletAddress', accounts[0])
    let contract = new web3.eth.Contract(vssoToken.abi, vssoTokenAddress);

    await contract.methods.transfer(address, web3.utils.toWei(numberOfTokensToIssue))
        .send({from: accounts[0], gasPrice:0, gas: 100000,})
        .on('receipt', receipt => {
            transactionHash = receipt.transactionHash;
        })
        .on('error', error => {
            res.send(error)
        })
        //.then(console.log)
        .catch(console.error);

    res.send('Successfully sent ' + numberOfTokensToIssue + ' VSSO token to ' + address + 'in transactionHash: ' + transactionHash);
  } catch (error) {
      res.send(error);
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
