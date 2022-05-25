# Local Setup
- add mnemonic & .env to packages/hardhat
- add .env to packages/react-app

# deployment

- `yarn deploy --network goerli`
- repeat deployment after sometime to get verification
- `yarn deploy --network mumbai`

# setup
- after deploying contracts we need to tell them about each other
- `node setupRootChildAddressesPairForTest.js`

# send message from child to root
- change purpose on child chain
- get tx hash
- run `node generateExitProofForMessageToRootChain.js` & wait approx 10 mins on mumbai & 30 mins on polygon
- feed proof to `receiveMessage` on goerli
- confirm that purpose on root is same as purpose on child

# send message from root to child
- change purpose on child
- wait ~15 mins while optionally running `node checkOnMessageToChildChain.js`
- confimr that purose on child is same as purpose on root
- 