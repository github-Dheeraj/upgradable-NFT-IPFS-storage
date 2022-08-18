//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "contracts/nftERC721A/ERC721A.sol";
import "contracts/ReentrancyGuard.sol";

contract upgradableNFT is ERC721A, Ownable, ReentrancyGuard {
    address owner;
    uint256 _tokenIds = _startTokenId();

    bool public publicMintActive = false;
    bool public allowlistMintActive = false;
    bool public burnProfileActive = false;

    event Attest(address indexed to, uint256 _tokenId);
    event Revoke(address indexed to, uint256 _tokenId);
    event NewNFTMinted(address sender, uint256 tokenId, string tokenURI);
    event updateMintedNFT(
        uint256 tokenId,
        string tokenURI,
        string updatedTokenURI
    );

    constructor() ERC721A("upgradableNFT", "Level") {
        console.log("This is upgradableNFT smart contract");
        owner = _msgSenderERC721A();
    }

    modifier onlyOwner() {
        require(
            _msgSenderERC721A() == owner,
            "This function can only be called by owner"
        );
        _;
    }

    //get tokenURI with baseURI and tokenId
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length != 0
                ? string(abi.encodePacked(baseURI, _toString(tokenId)))
                : "";
    }

    //base URI
    function _baseURI() internal view virtual override returns (string memory) {
        return "";
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }

    function mintTrutsNFT() public {
        //uncoment the require later
        //require(balanceOf(_msgSenderERC721A()) < 1, "Max limit is only one per User");
        require(publicMintActive, "Wait for the party to start");
        //require(_msgSenderERC721A() == trustedForwarder)
        uint256 itemId = _nextTokenId();
        uint256 quantity = 1;

        _safeMint(_msgSenderERC721A(), quantity);

        _setTokenURI(itemId, tokenURI(itemId));

        emit NewNFTMinted(_msgSenderERC721A(), itemId, currentTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            itemId,
            _msgSenderERC721A()
        );
    }

    //when user deletes the profile
    function burnToken(uint256 tokenId) external override {
        require(burnProfileActive, "Wait for your profile probation to end");
        require(
            ownerOf(tokenId) == msg.sender,
            "Yoo, you are not the owner of the token."
        );
        _burn(tokenId);
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 tokenId
    ) external override {
        require(
            from == address(0) || to == address(0),
            "You cant transfer this token"
        );
    }

    function _afterTokenTransfers(
        address from,
        address to,
        uint256 tokenId
    ) external override {
        if (from == address(0)) {
            emit Attest(to, tokenId);
        }
        if (to == address(0)) {
            emit Revoke(to, _tokenId);
        }
    }

    //Setting burn profile active, this can be timely done
    function setAllowlistMintActive(bool allowlistMintActive)
        external
        onlyOwner
    {
        allowlistMintActive = allowlistMintActive;
    }

    function setPublicMintActive(bool publicMintActive) external onlyOwner {
        publicMintActive = publicMintActive;
    }
}
