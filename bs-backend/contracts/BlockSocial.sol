// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract BlockSocial is ERC721URIStorage {
    uint256 public s_tokenCounter;

    event MintingFinished(
        address indexed from,
        uint256 indexed tokenId,
        address indexed nftAddress
    );

    event MintingRequestReceived(
        address indexed from,
        uint256 indexed tokenId,
        address indexed nftAddress
    );

    constructor() ERC721("BlockSocial", "BS") {
        s_tokenCounter = 0;
    }

    function minting(string memory _uri) public {
        emit MintingRequestReceived(msg.sender, s_tokenCounter, address(this));

        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter, _uri);
        s_tokenCounter += 1;

        emit MintingFinished(msg.sender, s_tokenCounter, address(this));
    }

    function getTokenCount() public view returns (uint256 tokenCount) {
        tokenCount = s_tokenCounter;
    }
}
