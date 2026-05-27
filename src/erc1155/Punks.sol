// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Punks is ERC1155, Ownable {

    uint256 public constant PRICE =
        20 ether;

    uint256 public constant MAX_SUPPLY =
        20;

    mapping(uint256 => uint256)
        public totalMinted;

    mapping(uint256 => string)
        private tokenURIs;

    mapping(address => mapping(uint256 => bool))
        public minted;

    constructor()
        ERC1155("")
        Ownable(msg.sender)
    {

        tokenURIs[1] =
            "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/kuci.json";

        tokenURIs[2] =
            "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/beru.json";

        tokenURIs[3] =
            "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/ora.json";

        tokenURIs[4] =
            "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/sing.json";

        tokenURIs[5] =
            "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/pisa.json";

        tokenURIs[6] =
            "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/anji.json";
    }

    function uri(
        uint256 id
    )
        public
        view
        override
        returns (string memory)
    {
        return tokenURIs[id];
    }

    function mint(
        uint256 id
    ) external payable {

        require(
            id >= 1 && id <= 6,
            "Invalid ID"
        );

        require(
            msg.value >= PRICE,
            "Need 20 ARC"
        );

        require(
            !minted[msg.sender][id],
            "Already minted"
        );

        require(
            totalMinted[id] < MAX_SUPPLY,
            "Sold out"
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