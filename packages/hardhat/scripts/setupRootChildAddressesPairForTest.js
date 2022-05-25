const { ethers } = require("hardhat");
const fs = require("fs");

const YourContractJson = require("../deployments/goerli/YourContract.json");
const YourChildContractJson = require("../deployments/mumbai/YourChildContract.json");

const { providers } = ethers;

const init = async () => {
  const goerliProvider = new providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.EXAMPLE_INFURA_KEY}`
  );
  const mumbaiProvider = new providers.JsonRpcProvider(
    `https://polygon-mumbai.infura.io/v3/${process.env.EXAMPLE_INFURA_KEY}`
  );
  const mnemonic = () => {
    try {
      return fs.readFileSync("../mnemonic.txt").toString().trim();
    } catch (e) {
      console.log("unable to read mnemonic.txt ", e);
    }
    return "";
  };
  const YourContract = new ethers.Contract(
    YourContractJson.address,
    YourContractJson.abi,
    ethers.Wallet.fromMnemonic(mnemonic()).connect(goerliProvider)
  );

  const YourChildContract = new ethers.Contract(
    YourChildContractJson.address,
    YourChildContractJson.abi,
    ethers.Wallet.fromMnemonic(mnemonic()).connect(mumbaiProvider)
  );

  const r1 = await YourContract.setFxChildTunnel(YourChildContract.address);
  console.log(r1);

  const r2 = await YourChildContract.setFxRootTunnel(YourContract.address);
  console.log(r2);
};

init();
