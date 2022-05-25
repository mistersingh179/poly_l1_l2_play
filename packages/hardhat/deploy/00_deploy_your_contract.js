// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";
const goerliChainId = "5";
const mainnetChainId = "1";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  console.log("chainId: ", chainId);

  // eslint-disable-next-line no-underscore-dangle
  let _checkpointManager;
  // eslint-disable-next-line no-underscore-dangle
  let _fxRoot;

  if (chainId === goerliChainId) {
    _checkpointManager = "0x2890bA17EfE978480615e330ecB65333b880928e";
    _fxRoot = "0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA";
  } else if (chainId === mainnetChainId) {
    _checkpointManager = "0x86e4dc95c7fbdbf52e33d563bbdb00823894c287";
    _fxRoot = "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2";
  }

  if (chainId === goerliChainId || chainId === mainnetChainId) {
    await deploy("YourContract", {
      from: deployer,
      args: [_checkpointManager, _fxRoot],
      log: true,
      waitConfirmations: 5,
    });
    const YourContract = await ethers.getContract("YourContract", deployer);
    try {
      await run("verify:verify", {
        address: YourContract.address,
        contract: "contracts/YourContract.sol:YourContract",
        constructorArguments: [_checkpointManager, _fxRoot],
      });
    } catch (error) {
      console.error(error);
    }
  } else if (chainId === localChainId) {
    console.log("deploying on localhost HARDHAT");
    await deploy("YourContract", {
      from: deployer,
      args: [ethers.constants.AddressZero, ethers.constants.AddressZero],
      log: true,
      waitConfirmations: 5,
    });
  } else {
    console.log("skipping to deploy ROOT contract to chainId: ", chainId);
  }
};
module.exports.tags = ["YourContract"];
