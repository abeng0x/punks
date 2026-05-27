// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Punks is ERC1155, Ownable {

    uint256 public constant PRICE = 20 ether;

    uint256 public constant MAX_SUPPLY = 20;

    mapping(uint256 => uint256) public totalMinted;

    mapping(address => mapping(uint256 => bool))
        public hasMinted;

    constructor()
        ERC1155(
            "ipfs://bafybeihvb4f2okfjjplabk2d7leuiivjpa7pc4o4y7vqkynnr6c2bif3oq/{id}.json"
        )
        Ownable(msg.sender)
    {}

    function mint(uint256 id) external payable {

        require(
            id >= 1 && id <= 6,
            "Invalid ID"
        );

        require(
            msg.value == PRICE,
            "Wrong price"
        );

        require(
            totalMinted[id] < MAX_SUPPLY,
            "Sold out"
        );

        require(
            !hasMinted[msg.sender][id],
            "Already minted"
        );

        hasMinted[msg.sender][id] = true;

        totalMinted[id]++;

        _mint(
            msg.sender,
            id,
            1,
            ""
        );
    }

    function withdraw() external onlyOwner {

        payable(owner()).transfer(
            address(this).balance
        );
    }
}