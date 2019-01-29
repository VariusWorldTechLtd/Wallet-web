import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';

import {RPC_ENDPOINT, LOGIN_SESSION_CONTRACT} from '../globalConstants';

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
}
