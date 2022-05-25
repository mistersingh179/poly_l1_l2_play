const { use, POSClient } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { ethers } = require("hardhat");

const { providers, Wallet } = ethers;

use(Web3ClientPlugin);

const parentProvider = new providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.EXAMPLE_INFURA_KEY}`
);
const childProvider = new providers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${process.env.EXAMPLE_INFURA_KEY}`
);

const init = async () => {
  console.log("checking for Tx Hash: ", process.argv[2]);
  const randomWallet = ethers.Wallet.createRandom();
  const posClient = new POSClient();
  await posClient.init({
    network: "testnet",
    version: "mumbai",
    parent: {
      provider: new Wallet(randomWallet.privateKey, parentProvider),
      defaultConfig: {
        from: randomWallet.address,
      },
    },
    child: {
      provider: new Wallet(randomWallet.privateKey, childProvider),
      defaultConfig: {
        from: randomWallet.address,
      },
    },
  });
  const intervalHandler = setInterval(async () => {
    try {
      const status = await posClient.isDeposited(process.argv[2]);
      console.log("status: ", status);
      if (status === true) {
        clearInterval(intervalHandler);
      }
    } catch (e) {
      console.log(e);
    }
  }, 1000);
};

init();
