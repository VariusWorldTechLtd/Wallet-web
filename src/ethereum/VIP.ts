import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import EthereumJsUtil from 'ethereumjs-util';
import {RPC_ENDPOINT, WS_ENDPOINT, LOGIN_SESSION_CONTRACT} from '../globalConstants';

export default class VIP {

  public async deployLoginSessionContract(successCallback: any) {
    const web3 = new Web3();
    const account = web3.eth.accounts.create();

    web3.setProvider(new HDWalletProvider(account.privateKey, RPC_ENDPOINT));
    localStorage.setItem('accountPrivateKey', account.privateKey);

    let accounts = await web3.eth.getAccounts();
    console.log('account0', accounts[0]);

    const contract = new web3.eth.Contract(LOGIN_SESSION_CONTRACT.abi);

    await contract
        .deploy({ data: LOGIN_SESSION_CONTRACT.bytecode })
        .send({ from: accounts[0], gas: '1000000', gasPrice: '0' }
            , function(error: any, transactionHash: string) {
            if (error) console.log(error);
            })
        .on('error', function(error: any) {
            console.log('contract deploy error:', error);
        })
        .on('receipt', (receipt: any) => {
            // console.log('receipt', receipt);
        })
        .then(function(newContractInstance: any) {
            console.log(newContractInstance);
            let contractAddress = '';
            contractAddress = newContractInstance.options.address;
            console.log('sadfsdfsdfsd', contractAddress);
            successCallback(String(newContractInstance.options.address));
        });
  }

  public async saveWebSession(mobileWalletAddress: string, successCallback: any) {
    let loginSessionContractAddress = localStorage.getItem('loginContractAddress');

    let privateKey = localStorage.getItem('accountPrivateKey');
    if (privateKey == null)
        privateKey = '';

    const web3 = new Web3(new HDWalletProvider(privateKey, RPC_ENDPOINT));

    let accounts = await web3.eth.getAccounts();
    console.log('account0', accounts[0]);

    const contract = new web3.eth.Contract(LOGIN_SESSION_CONTRACT.abi, loginSessionContractAddress);
    let transactionHash = '';

    //const webSessionPubkey = EthereumJsUtil.privateToPublic(Buffer.from(privateKey.substring(2), 'hex'))
    //    .toString('hex');

    //console.log('webSessionPubkey', webSessionPubkey);

    await contract.methods.saveSession('webSessionPubkey', mobileWalletAddress)
        .send({from: accounts[0], gasPrice: 0, gas: 1000000, })
        .on('receipt', (receipt: any) => {
            transactionHash = receipt.transactionHash;
        })
        .on('error', (error: any) => {
            console.log('error', error)
        })
        .then(function() {
            console.log('session saved to:' + loginSessionContractAddress);
            successCallback();
        })
        .catch(console.error);
  }

  public async GetUserData(successCallback: any) {
    let loginSessionContractAddress = localStorage.getItem('loginContractAddress');

    let privateKey = localStorage.getItem('accountPrivateKey');
    if (privateKey == null)
        privateKey = '';

    const web3ws = new Web3(new Web3.providers.WebsocketProvider(WS_ENDPOINT));
    const loginSessionContractWs = new web3ws.eth.Contract(LOGIN_SESSION_CONTRACT.abi, loginSessionContractAddress);

    const options = {
        filter: {
          // _from:  process.env.WALLET_FROM,
          // _to: contractAddress,
          // _value: process.env.AMOUNT
        },
        fromBlock: 'latest'
      };

    loginSessionContractWs.once('SaveDataEvent', options, async (error: any, event: any) => {
        console.log('Save Data Event happened.');
        const web3 = new Web3(new HDWalletProvider(privateKey, RPC_ENDPOINT));

        let accounts = await web3.eth.getAccounts();
        console.log('account0', accounts[0]);

        console.log('loginSEssion', LOGIN_SESSION_CONTRACT.abi, loginSessionContractAddress)
        const contract = new web3.eth.Contract(LOGIN_SESSION_CONTRACT.abi, loginSessionContractAddress);
        let transactionHash = '';

        let userDetails = await contract.methods.GetData()
            .call({from: accounts[0]})

        console.log(userDetails)
        const {_firstname, _lastname, _age, _gender} = userDetails;
        successCallback({firstname:_firstname, lastname:_lastname, gender:_gender, age:_age});
    });
  }
}