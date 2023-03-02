// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error BlockSocial_AlreadyLiked();
error BlockSocial_DidNotEvenLiked();

error BLockSocial_TokenIdNotExist();

contract BlockSocial is ERC721URIStorage {
    uint256 public s_tokenCounter;

    uint256 public s_postCounter;

    mapping(uint256 => uint256) public s_tokenIdToLikeCount; // dynamic
    mapping(uint256 => mapping(address => bool)) public s_tokenIdToWhoLiked; // dynamic

    event PostMinted(
        address indexed from,
        uint256 indexed tokenId,
        uint256 indexed postNumber
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

    event CommentMinted(
        uint256 indexed commentToTokenId,
        address indexed from,
        uint256 indexed commentTokenId
    );

    constructor() ERC721("BlockSocial", "BS") {
        s_tokenCounter = 0;
        s_postCounter = 0;
    }

    function mintingPost(string memory _uri) public {
        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter, _uri);

        emit PostMinted(msg.sender, s_tokenCounter, s_postCounter);

        s_tokenCounter += 1;
        s_postCounter += 1;
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

    function mintComment(uint256 _tokenIdToComment, string memory _uri) public {
        if (_tokenIdToComment > s_tokenCounter - 1) {
            revert BLockSocial_TokenIdNotExist();
        }
        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter, _uri);
        emit CommentMinted(_tokenIdToComment, msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
    }

    function getTokenCount() public view returns (uint256 tokenCount) {
        tokenCount = s_tokenCounter;
    }

    function getLikeCount(
        uint256 _tokenId
    ) public view returns (uint256 likeCount) {
        likeCount = s_tokenIdToLikeCount[_tokenId];
    }

    function getIsThisPersonLikedThisPost(
        uint256 _tokenId,
        address _personAddress
    ) public view returns (bool) {
        if (_tokenId > s_tokenCounter - 1) {
            revert BLockSocial_TokenIdNotExist();
        }
        return s_tokenIdToWhoLiked[_tokenId][_personAddress];
    }

    function getPostCount() public view returns (uint256 postCount) {
        postCount = s_postCounter;
    }
}
