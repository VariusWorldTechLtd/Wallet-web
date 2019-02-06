import Web3 from 'web3';
import {RPC_ENDPOINT, WS_ENDPOINT, VSSO_TOKEN_ADDRESS, VSSO_TOKEN_JSON} from '../globalConstants';

export default class ERC20 {

  public watchTokenTransfers(contractAddress: string, successCallback: any) {
    console.log('Watching token transfers to: ' + contractAddress);
    const web3 = new Web3(new Web3.providers.WebsocketProvider(WS_ENDPOINT));
    const tokenContract = new web3.eth.Contract(VSSO_TOKEN_JSON.abi, VSSO_TOKEN_ADDRESS,
      (error: any, result: any) => { if (error) console.log(error) }
    )

    const options = {
      filter: {
        // _from:  process.env.WALLET_FROM,
        // _to: contractAddress,
        // _value: process.env.AMOUNT
      },
      fromBlock: 'latest'
    };

    tokenContract.events.Transfer(options, async (error: any, event: any) => {
      if (error) {
        console.log(error);
        successCallback(false);
      }
      const to = event.returnValues.to;
      const from = event.returnValues.from;
      const tokens =  event.returnValues.tokens;

      console.log('Found incoming VSSO token transaction  of ' + tokens + ' from ', from + ' to ' + to);
      console.log('to       address:' + contractAddress);
      console.log('contract address:' + contractAddress);

      if (to.toLowerCase() === contractAddress.toLowerCase()) {
        const mobileWalletAddress = from.toLowerCase();
        console.log('Token sent to this contract by: ' + mobileWalletAddress + '. User authenticated.');
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('myMobileWalletAddress', mobileWalletAddress)
        successCallback(true, mobileWalletAddress);
      }
    })
  }
}
