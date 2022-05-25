const { use, POSClient } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { ethers } = require("hardhat");

const { providers, Wallet } = ethers;
// const { setProofApi } = require("@maticnetwork/maticjs");

const YourContractJson = require("../deployments/goerli/YourContract.json");
const fs = require("fs");

// install ethers plugin
use(Web3ClientPlugin);

// backend for proof api
// setProofApi("https://apis.matic.network/");

const goerliProvider = new providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.EXAMPLE_INFURA_KEY}`
);
const mumbaiProvider = new providers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${process.env.EXAMPLE_INFURA_KEY}`
);

const init = async () => {
  console.log("processing for tx hash: ", process.argv[2]);
  const randomWallet = ethers.Wallet.createRandom();
  const posClient = new POSClient();
  await posClient.init({
    network: "testnet",
    version: "mumbai",
    parent: {
      provider: new Wallet(randomWallet.privateKey, goerliProvider),
      defaultConfig: {
        from: randomWallet.address,
      },
    },
    child: {
      provider: new Wallet(randomWallet.privateKey, mumbaiProvider),
      defaultConfig: {
        from: randomWallet.address,
      },
    },
  });
  const txHash = process.argv[2];
  const intervalHandler = setInterval(async () => {
    try {
      // https://apis.matic.network/api/v1/mumbai/block-included/26456151
      const isCheckPointed = await posClient.isCheckPointed(txHash);
      console.log("isCheckPointed: ", isCheckPointed);
      if (isCheckPointed === true) {
        clearInterval(intervalHandler);
        const sig = ethers.utils.id("MessageSent(bytes)");
        console.log("sig: ", sig);
        try {
          const proof = await posClient.exitUtil.buildPayloadForExit(
            txHash,
            sig,
            false
          );
          console.log("proof: ", proof);

          // send proof to ROOT
          try {
            const mnemonic = () => {
              return fs.readFileSync("../mnemonic.txt").toString().trim();
            };
            const YourContract = new ethers.Contract(
              YourContractJson.address,
              YourContractJson.abi,
              ethers.Wallet.fromMnemonic(mnemonic()).connect(goerliProvider)
            );
            const r1 = await YourContract.receiveMessage(proof);
            console.log(r1);
          } catch (e) {
            console.log("error calling receiveMessage on ChildContract");
          }
        } catch (e) {
          console.log("error building payload: ", e);
        }
      }
    } catch (e) {
      console.log("error while getting checkpoint: ", e);
    }
  }, 5000);
};

init();
