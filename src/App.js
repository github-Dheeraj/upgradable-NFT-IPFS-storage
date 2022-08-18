import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import upgradableNFT from './utils/upgradableNFT.json';
import storeImageFiles from './ipfsModule/storeImageIpfs.js';
import { storeImageJsonFiles } from './ipfsModule/createImageJson.js'
import { getLinks } from './ipfsModule/retrieveFiles.js'
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
const CONTRACT_ADDRESS = '0x8Cc7f6e4A02292dA0d1503069BC1528218cd9A08';

const imgUrl = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'

const imgUrl2 = 'https://www.rd.com/wp-content/uploads/2018/02/30_Adorable-Puppy-Pictures-that-Will-Make-You-Melt_124167640_YamabikaY.jpg?fit=700,467';

//let contractAbi= '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"tokenURI","type":"string"}],"name":"NewNFTMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"tokenURI","type":"string"},{"indexed":false,"internalType":"string","name":"updatedTokenURI","type":"string"}],"name":"updateMintedNFT","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burnToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"currentTokenUri","type":"string"}],"name":"mintTrutsNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"updatedTokenURI","type":"string"}],"name":"updateTokenURI","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
let contract, tokenIdnft;

if (!window.Buffer) {
  window.Buffer = Buffer;
}
function App() {

  const [selectedAddress, setSelectedAddress] = useState('')
  const [nftTx, setNftTx] = useState(null)

  const [nftLoading, setNftLoading] = useState(null)
  const [ currentAccount, setCurrentAccount ] = useState('');

  var IpfsImageObj = {
		description: 'This is description for image json to create QR NFT',
		imgSrcUrl: '',
		imgIpfsUrl: '',
		imgName: 'profileQR'
  }
  
  const getIpfsImageJsonFile = async (imgUrl) =>{
    	IpfsImageObj.imgSrcUrl = imgUrl;
		let imageCID;
		console.log(IpfsImageObj);
		
		imageCID = await storeImageFiles(IpfsImageObj);
		
		if(imageCID !== ''){
			console.log('Image CID is ', imageCID);
			IpfsImageObj.imgIpfsUrl = await getLinks(imageCID);
			//profileDict.imageIpfsSrc = IpfsImageObj.imgIpfsUrl;
		}
		const imageJsonCID = await storeImageJsonFiles(IpfsImageObj);
		let linkImageMeta = await getLinks(imageJsonCID);
    console.log('this is image json CID path',linkImageMeta)
    return linkImageMeta;
  }

  const upgradeNFT = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
       console.log('calling for upgrde')
          const tx = await contract.updateTokenURI(tokenIdnft,await getIpfsImageJsonFile(imgUrl2))
          await tx.wait()
        
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log('Error minting character', error)
    }
  }

  const mintNFT = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				contract = new ethers.Contract(
					CONTRACT_ADDRESS,
					upgradableNFT.abi,
					signer
        );
         let linkImageMeta = await getIpfsImageJsonFile(imgUrl);
				console.log('linkMeta', linkImageMeta);
            
        console.log('Going to pop window for gas fee');
				let deployedtxn = await contract.mintTrutsNFT(linkImageMeta);
				console.log(deployedtxn);
				let approveTx = await contract.approve('0x2435441f61EA909c82E3A0300486a8bE268534E4',0);

				console.log('Minning the NFT..');
				await deployedtxn.wait();

				console.log(
					`Mined, see transaction: https://mumbai.polygonscan.com/tx/${
						deployedtxn.hash
					}`
				)

			
			} else {
				console.log('Ethereum object does not exist..');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const setupEventListner = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					upgradableNFT.abi,
					signer
				);

				connectedContract.on('NewNFTMinted', (from, tokenId, tokenURI) => {
          tokenIdnft = tokenId;
					console.log(from, tokenId.toNumber(), tokenURI);
					alert(`Hey there! We've minted your NFT and sent it to your wallet.
It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
				});

//         connectedContract.on('updateMintedNFT', (from, tokenId) => {
// 					console.log(from, tokenId.toNumber());
// 					alert(`Hey there! We've minted your NFT and sent it to your wallet.
// It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
// 				});
				console.log('Setup event listener!');
			} else {
				console.log('Ethereum object does not exist..');
			}
		} catch (error) {
			console.log(error);
		}
	};
	const checkConnectedWallet = async () => {
		const { ethereum } = window;

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		if (accounts.length !== 0) {
			const account = accounts[0];
			let chainId = await ethereum.request({method: 'eth_chainId'});
			console.log("The Chain Id is : "+ chainId);
			setCurrentAccount(accounts[0]);
			
			console.log('Authorized account found: ', account);
			return;
  		} else {
  			console.log('No authorised account found');
  		}
	};

	const connectWallet = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			alert('Get Metamask..!');
			return;
		}

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

		console.log('Connected to: ', accounts[0]);
		setCurrentAccount(accounts[0]);

		setupEventListner();
	};

	const renderNotConnectedContainer = () => {
		<button
			onClick={connectWallet}>
			Connect to Wallet
		</button>;
	};


	useEffect(() => {
		checkConnectedWallet();
	}, []);

 
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          this is mint upgradable code
        </p>
      
		
				{currentAccount === '' ? 
					renderNotConnectedContainer()
					: 		
					<div>
					  <button onClick={() => mintNFT()}>mintNFT</button>
           			 <button onClick={() => upgradeNFT()}>upgradeNFT</button>

					</div>
				}
					 
					 

      </header>
    </div>
  );
}

export default App;
