import vssoToken from './contracts/truffle/build/contracts/VssoToken.json';
import loginSessionContract from './contracts/truffle/build/contracts/LoginSession.json';

export const VSSO_TOKEN_JSON: any = vssoToken;
export const LOGIN_SESSION_CONTRACT: any = loginSessionContract;

// Rinkeby
// export const RPC_ENDPOINT: string = 'https://rinkeby.infura.io/dHRT6sR6UQHeGrLuM7JO';
// export const WS_ENDPOINT: string = 'wss://rinkeby.infura.io/ws';
// export const VSSO_TOKEN_ADDRESS: string = '0x8fb56ce90b9ae608ed36f5b1f926c0ed46f96344'; // rinkeby

// Voxnet
export const RPC_ENDPOINT: string = 'https://voxwallet2.vwtbet.com:8545';
export const WS_ENDPOINT: string = 'wss://voxwallet2.vwtbet.com:8546';
export const VSSO_TOKEN_ADDRESS: string = '0x92fCc43e8FEda3CF74BF2A1A70fC456008Bd5b3C'; // voxnet  geth
