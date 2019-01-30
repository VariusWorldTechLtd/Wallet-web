const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3')
const vssoToken = require('../contracts/truffle/build/contracts/VssoToken.json');
const vssoTokenAddress = '0x92fCc43e8FEda3CF74BF2A1A70fC456008Bd5b3C';
const hotWalletMnemonic = 'plunge journey march test patch zebra jeans victory any chest remember antique';
const voxnetRpc = 'https://voxwallet.vwtbet.com:8545'

const numberOfTokensToIssue = '1';
const express = require('express')
const app = express()
const port = 3000


app.get('/', async (req, res) => {
    let transactionHash = '';

    const address = req.query.address;

    if (!address) res.send('Usage: GET to ' + req.headers.host + '?address=ethereum_address_here')
    const web3 = new Web3(new HDWalletProvider(hotWalletMnemonic, voxnetRpc ));
    let accounts = await web3.eth.getAccounts();

    let contract = new web3.eth.Contract(vssoToken.abi, vssoTokenAddress);
    let transferResult = await contract.methods.transfer(address, web3.utils.toWei(numberOfTokensToIssue))
        .send({from: accounts[0], gasPrice:0, gas: 1000000,})
        .on('receipt', receipt => {
            transactionHash = receipt.transactionHash;
        })
        //.then(console.log)
        .catch(console.error);

    res.send('Successfully sent ' + numberOfTokensToIssue + ' VSSO token to ' + address + 'in transactionHash: ' + transactionHash);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))