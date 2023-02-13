// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error BlockSocial_AlreadyLiked();
error BlockSocial_DidNotEvenLiked();

error BLockSocial_TokenIdNotExist();

contract BlockSocial is ERC721URIStorage {
    uint256 public s_tokenCounter;

    mapping(uint256 => uint256) public s_tokenIdToLikeCount; // dynamic
    mapping(uint256 => mapping(address => bool)) public s_tokenIdToWhoLiked; // dynamic

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

    event Liked(
        address indexed whoDidLike,
        uint256 indexed whichPostLiked,
        uint256 indexed overallLikeCountOfPost
    );

    event UnLiked(
        address indexed whoDidUnLike,
        uint256 indexed whichPostUnLiked,
        uint256 indexed overallLikeCountOfPost
    );

    constructor() ERC721("BlockSocial", "BS") {
        s_tokenCounter = 0;
    }

    function minting(string memory _uri) public {
        emit MintingRequestReceived(msg.sender, s_tokenCounter, address(this));

        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter, _uri);

        emit MintingFinished(msg.sender, s_tokenCounter, address(this));

        s_tokenCounter += 1;
    }

    function like(uint256 _tokenId) public {
        if (_tokenId > s_tokenCounter - 1) {
            revert BLockSocial_TokenIdNotExist();
        }
        if (s_tokenIdToWhoLiked[_tokenId][msg.sender] == true) {
            revert BlockSocial_AlreadyLiked();
        }
        s_tokenIdToWhoLiked[_tokenId][msg.sender] = true;

        uint256 oldLikeCount = s_tokenIdToLikeCount[_tokenId];
        uint256 updatedLikeCount = oldLikeCount + 1;

        s_tokenIdToLikeCount[_tokenId] = updatedLikeCount;

        emit Liked(msg.sender, _tokenId, updatedLikeCount);
    }

    function unLike(uint256 _tokenId) public {
        if (_tokenId > s_tokenCounter - 1) {
            revert BLockSocial_TokenIdNotExist();
        }

        if (s_tokenIdToWhoLiked[_tokenId][msg.sender] == false) {
            revert BlockSocial_DidNotEvenLiked();
        }

        s_tokenIdToWhoLiked[_tokenId][msg.sender] = false;

        uint256 oldLikeCount = s_tokenIdToLikeCount[_tokenId];
        uint256 updatedLikeCount = oldLikeCount - 1;

        s_tokenIdToLikeCount[_tokenId] = updatedLikeCount;

        emit UnLiked(msg.sender, _tokenId, updatedLikeCount);
    }

    function getTokenCount() public view returns (uint256 tokenCount) {
        tokenCount = s_tokenCounter;
    }

    function getLikeCount(
        uint256 _tokenId
    ) public view returns (uint256 likeCount) {
        likeCount = s_tokenIdToLikeCount[_tokenId];
    }
}
