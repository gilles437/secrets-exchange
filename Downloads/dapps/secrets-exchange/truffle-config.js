require('babel-register');
require('babel-polyfill');

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
   mainnet: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY, 
        process.env.INFURA_URL
      ),
      network_id: 1,       //mainnet,
       gas: 5000000,           // Gas sent with each transaction (default: ~6700000)
       gasPrice: 25000000000,  // 20 gwei (in wei) (default: 100 gwei)
    },    
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}



