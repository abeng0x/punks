// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Punks is ERC1155, Ownable {

    string public name = "Punks NFT";

    string public symbol = "PUNKS";

    uint256 public constant PRICE = 20 ether;

    uint256 public constant MAX_SUPPLY = 20;

    mapping(uint256 => uint256) public totalMinted;

    mapping(address => mapping(uint256 => bool)) public minted;

    mapping(uint256 => string) private tokenURIs;

    constructor()
        ERC1155("")
        Ownable(msg.sender)
    {

        tokenURIs[1] =
        "https://gateway.pinata.cloud/ipfs/bafybeifrpej2h7gli45tjdoip2mwe4a2obuenesbmyx2psefbfv5ldngxq/1.json";

        tokenURIs[2] =
        "https://gateway.pinata.cloud/ipfs/bafybeifrpej2h7gli45tjdoip2mwe4a2obuenesbmyx2psefbfv5ldngxq/2.json";

        tokenURIs[3] =
        "https://gateway.pinata.cloud/ipfs/bafybeifrpej2h7gli45tjdoip2mwe4a2obuenesbmyx2psefbfv5ldngxq/3.json";

        tokenURIs[4] =
        "https://gateway.pinata.cloud/ipfs/bafybeifrpej2h7gli45tjdoip2mwe4a2obuenesbmyx2psefbfv5ldngxq/4.json";

        tokenURIs[5] =
        "https://gateway.pinata.cloud/ipfs/bafybeifrpej2h7gli45tjdoip2mwe4a2obuenesbmyx2psefbfv5ldngxq/5.json";

        tokenURIs[6] =
        "https://gateway.pinata.cloud/ipfs/bafybeifrpej2h7gli45tjdoip2mwe4a2obuenesbmyx2psefbfv5ldngxq/6.json";
    }

    function uri(uint256 id)
        public
        view
        override
        returns (string memory)
    {
        return tokenURIs[id];
    }

    function mint(uint256 id)
        external
        payable
    {

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
            !minted[msg.sender][id],
            "Already minted"
        );

        minted[msg.sender][id] = true;

        totalMinted[id]++;

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