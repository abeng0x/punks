// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Punks is ERC1155, Ownable {

    uint256 public mintPrice = 20 ether;

    mapping(uint256 => string) private tokenURIs;

    constructor() ERC1155("") Ownable(msg.sender) {

        tokenURIs[1] =
        "https://gateway.pinata.cloud/ipfs/bafybeieut6gw5n4f3dcmucith5iol3jsh5gb7edhmftzn6xr7iqogubb4i/1.json";

        tokenURIs[2] =
        "https://gateway.pinata.cloud/ipfs/bafybeieut6gw5n4f3dcmucith5iol3jsh5gb7edhmftzn6xr7iqogubb4i/2.json";

        tokenURIs[3] =
        "https://gateway.pinata.cloud/ipfs/bafybeieut6gw5n4f3dcmucith5iol3jsh5gb7edhmftzn6xr7iqogubb4i/3.json";

        tokenURIs[4] =
        "https://gateway.pinata.cloud/ipfs/bafybeieut6gw5n4f3dcmucith5iol3jsh5gb7edhmftzn6xr7iqogubb4i/4.json";

        tokenURIs[5] =
        "https://gateway.pinata.cloud/ipfs/bafybeieut6gw5n4f3dcmucith5iol3jsh5gb7edhmftzn6xr7iqogubb4i/5.json";

        tokenURIs[6] =
        "https://gateway.pinata.cloud/ipfs/bafybeieut6gw5n4f3dcmucith5iol3jsh5gb7edhmftzn6xr7iqogubb4i/6.json";

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