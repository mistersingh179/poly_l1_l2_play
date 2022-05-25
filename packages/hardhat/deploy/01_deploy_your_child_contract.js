// deploy/01_deploy_your_child_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";
const mumbaiChainId = "80001";
const polygonChainId = "137";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  console.log("chainId: ", chainId);

  // eslint-disable-next-line no-underscore-dangle
  let _fxChild;

  if (chainId === mumbaiChainId) {
    _fxChild = "0xCf73231F28B7331BBe3124B907840A94851f9f11";
  } else if (chainId === polygonChainId) {
    _fxChild = "0x8397259c983751DAf40400790063935a11afa28a";
  }

  if (chainId === mumbaiChainId || chainId === polygonChainId) {
    await deploy("YourChildContract", {
      from: deployer,
      args: [_fxChild],
      log: true,
      waitConfirmations: 5,
    });
    const YourChildContract = await ethers.getContract(
      "YourChildContract",
      deployer
    );
    try {
      await run("verify:verify", {
        address: YourChildContract.address,
        contract: "contracts/YourChildContract.sol:YourChildContract",
        constructorArguments: [_fxChild],
      });
    } catch (error) {
      console.log("failed to verify");
      console.error(error);
      console.dir(error);
    }
  } else if (chainId === localChainId) {
    console.log("deploying on localhost HARDHAT");
    await deploy("YourChildContract", {
      from: deployer,
      args: [ethers.constants.AddressZero],
      log: true,
      waitConfirmations: 5,
    });
  } else {
    console.log("wont deploy Child Contract to this chain: ", chainId);
  }
};
module.exports.tags = ["YourChildContract"];
