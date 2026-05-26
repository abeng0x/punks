// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {

    uint256 public nextTokenId;

    uint256 public constant MAX_SUPPLY = 100;

    uint256 public constant MINT_PRICE =
        0.001 ether;

    uint256 public constant MAX_PER_WALLET = 3;

    mapping(address => uint256)
        public minted;

    constructor()
        ERC721("E A R N Genesis", "EARN")
        Ownable(msg.sender)
    {}

    function mint(
        string memory uri
    )
        public
        payable
    {
        require(
            nextTokenId < MAX_SUPPLY,
            "Sold out"
        );

        require(
            msg.value >= MINT_PRICE,
            "Not enough ETH"
        );

        require(
            minted[msg.sender]
                < MAX_PER_WALLET,
            "Wallet limit reached"
        );

        uint256 tokenId =
            nextTokenId;

        _safeMint(
            msg.sender,
            tokenId
        );

        _setTokenURI(
            tokenId,
            uri
        );

        minted[msg.sender]++;

        nextTokenId++;
    }

    function withdraw()
        public
        onlyOwner
    {
        payable(owner()).transfer(
            address(this).balance
        );
    }
}