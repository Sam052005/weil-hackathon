import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    weilchain_testnet: {
        url: "https://testnet.rpc.weil.org",
        chainId: 210, // Assuming a mock chainId for Weilchain
        accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
