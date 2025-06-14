// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract SimpleStaking is ERC721Holder {
    IERC721 public immutable nft;
    mapping(uint256 => address) public staker;

    event Staked(address indexed user, uint256 indexed tokenId);
    event Unstaked(address indexed user, uint256 indexed tokenId);

    constructor(address _nft) {
        nft = IERC721(_nft);
    }

    function stake(uint256 tokenId) external {
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        staker[tokenId] = msg.sender;
        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) external {
        require(staker[tokenId] == msg.sender, "Not staker");
        delete staker[tokenId];
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        emit Unstaked(msg.sender, tokenId);
    }
}
