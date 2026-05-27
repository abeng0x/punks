// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyNFT is
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    IERC20 public usdc;

    uint256 public constant MAX_SUPPLY = 100;

    // 1 USDC
    uint256 public constant MINT_PRICE =
        1 * 10**6;

    uint256 public constant MAX_PER_WALLET = 3;

    mapping(address => uint256)
        public minted;

    constructor(
        address usdcAddress
    )
        ERC721(
            "E A R N Genesis",
            "EARN"
        )
        Ownable(msg.sender)
    {
        usdc =
            IERC20(usdcAddress);
    }

    function mint(
        string memory uri
    )
        public
    {
        require(
            totalSupply() < MAX_SUPPLY,
            "Sold out"
        );

        require(
            minted[msg.sender]
                < MAX_PER_WALLET,
            "Wallet limit reached"
        );

        bool success =
            usdc.transferFrom(

                msg.sender,

                owner(),

                MINT_PRICE
            );

        require(
            success,
            "USDC payment failed"
        );

        uint256 tokenId =
            totalSupply();

        _mint(
            msg.sender,
            tokenId
        );

        _setTokenURI(
            tokenId,
            uri
        );

        minted[msg.sender]++;
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(
            ERC721,
            ERC721URIStorage
        )
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721,
            ERC721Enumerable
        )
        returns (bool)
    {
        return
            super.supportsInterface(
                interfaceId
            );
    }
}