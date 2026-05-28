// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Punks is ERC1155, Ownable {

    uint256 public mintPrice = 20 ether;

    constructor()
        ERC1155(
            "https://gateway.pinata.cloud/ipfs/bafybeieut6gw5n4f3dcmucith5iol3jsh5gb7edhmftzn6xr7iqogubb4i/{id}.json"
        )
        Ownable(msg.sender)
    {}

    function mint(
        uint256 id
    )
        external
        payable
    {

        require(
            id >= 1 && id <= 6,
            "Invalid ID"
        );

        require(
            msg.value >= mintPrice,
            "Not enough payment"
        );

        _mint(
            msg.sender,
            id,
            1,
            ""
        );

    }

    function withdraw()
        external
        onlyOwner
    {
        payable(owner()).transfer(
            address(this).balance
        );
    }

}