// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Punks is ERC1155, Ownable {

    mapping(uint256 => string) private tokenURIs;

    uint256 public constant KUCI = 1;
    uint256 public constant BERU = 2;
    uint256 public constant ANJI = 3;
    uint256 public constant ORA  = 4;
    uint256 public constant PISA = 5;
    uint256 public constant SING = 6;

    // harga mint 20 USDC native testnet faucet
    uint256 public mintPrice = 20 ether;

    constructor() ERC1155("") Ownable(msg.sender) {

        // update CID ini dengan folder metadata terbaru
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

    function uri(uint256 tokenId) public view override returns (string memory) {
        return tokenURIs[tokenId];
    }

    function mint(uint256 id) external payable {

        require(id >= 1 && id <= 6, "Invalid ID");
        require(msg.value >= mintPrice, "Not enough USDC (native)");

        _mint(msg.sender, id, 1, "");
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

}