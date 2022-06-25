//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract upgradableNFT is ERC721URIStorage {
    address owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewNFTMinted(address sender, uint256 tokenId, string tokenURI);
    event updateMintedNFT(
        uint256 tokenId,
        string tokenURI,
        string updatedTokenURI
    );

    constructor() ERC721("upgradableNFT", "Level") {
        console.log("This is upgradableNFT smart contract");
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "This function can only be called by owner"
        );
        _;
    }

    function updateTokenURI(uint256 tokenId, string memory updatedTokenURI)
        external
        onlyOwner
    {
        string memory currentTokenURI = tokenURI(tokenId);
        _setTokenURI(tokenId, updatedTokenURI);
        emit updateMintedNFT(tokenId, currentTokenURI, updatedTokenURI);
    }

    function mintTrutsNFT(string memory currentTokenUri) public {
        require(balanceOf(msg.sender) < 1,'Max limit is only one per User'); 
        
        uint256 itemId = _tokenIds.current();
        
        _safeMint(msg.sender, itemId);

        _setTokenURI(itemId, currentTokenUri);

        emit NewNFTMinted(msg.sender, itemId, currentTokenUri);

        _tokenIds.increment();

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            itemId,
            msg.sender
        );
    }

    function burnToken(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }
}
