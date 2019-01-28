import Web3 from 'web3';
import {RPC_ENDPOINT, WS_ENDPOINT, VSSO_TOKEN_ADDRESS, VSSO_TOKEN_JSON} from '../globalConstants';
// import Rx from 'rxjs';

export default class ERC20 {

  public watchTokenTransfers(contractAddress: string, callback: any) {

    // Instantiate web3 with WebSocketProvider
    const web3 = new Web3(new Web3.providers.WebsocketProvider(WS_ENDPOINT));

    console.log(VSSO_TOKEN_JSON);
    // Instantiate token contract object with JSON ABI and address
    const tokenContract = new web3.eth.Contract(
        VSSO_TOKEN_JSON.abi, VSSO_TOKEN_ADDRESS,
      (error: any, result: any) => { if (error) console.log(error) }
    )

    // Generate filter options
    const options = {
      filter: {
        // _from:  process.env.WALLET_FROM,
        // _to: contractAddress,
        // _value: process.env.AMOUNT
      },
      fromBlock: 'latest'
    }
    // Subscribe to Transfer events matching filter criteria
    tokenContract.events.Transfer(options, async (error: any, event: any) => {
      if (error) {
        console.log(error)
        callback(false);
      }
      const to = event.returnValues.to;
      const from = event.returnValues.from;
      const tokens =  event.returnValues.tokens;

      console.log('Found incoming VoX transaction  of ' + tokens + ' from ', from + ' to ' + to);
      console.log('to       address:' + contractAddress);
      console.log('contract address:' + contractAddress);

      if (to.toLowerCase() === contractAddress.toLowerCase()) {
        // Initiate transaction confirmation
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('myMobileWalletAddress', from.toLowerCase())
        callback(true);
      }
    })
  }
}
