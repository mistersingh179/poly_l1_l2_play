pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./fx-contracts/tunnel/FxBaseRootTunnel.sol";

contract YourContract is FxBaseRootTunnel {
    constructor(address _checkpointManager, address _fxRoot) FxBaseRootTunnel(_checkpointManager, _fxRoot) { }

    event SetPurpose(address sender, string purpose);

    string public purpose = "Building Unstoppable Apps!!!!!!";

    // public method which also calls POLYGON to send message to CHILD
    function setPurpose(string memory newPurpose) public {
        purpose = newPurpose;
        console.log(msg.sender,"set purpose to",purpose);
        emit SetPurpose(msg.sender, purpose);
        _sendMessageToChild(bytes(newPurpose));
    }

    // to support receiving ETH by default
    receive() external payable {}
    fallback() external payable {}

    // internal method which is called by POLYGON to receive message from CHILD
    function _processMessageFromChild(bytes memory data) internal override {
        setPurpose(string(data));
    }
}
