pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./fx-contracts/tunnel/FxBaseChildTunnel.sol";

contract YourChildContract is FxBaseChildTunnel {
    constructor(address _fxChild) FxBaseChildTunnel(_fxChild) {}

    // internal method so POLYGON can call us with message from ROOT
    function _processMessageFromRoot(
        uint256 stateId,
        address sender,
        bytes memory data
    ) internal override validateSender(sender) {
        setPurpose(string(data));
    }

    event SetPurpose(address sender, string purpose);

    string public purpose = "Building Unstoppable Apps!!!!!!";

    // calls internal POLYGON method which sends message to ROOT
    function setPurpose(string memory newPurpose) public {
        purpose = newPurpose;
        console.log(msg.sender,"set purpose to",purpose);
        emit SetPurpose(msg.sender, purpose);
        _sendMessageToRoot(bytes(newPurpose));
    }

    // to support receiving ETH by default
    receive() external payable {}
    fallback() external payable {}
}
