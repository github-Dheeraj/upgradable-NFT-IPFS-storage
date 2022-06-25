
import makeStorageClient from "./ipfsClient.js"
import { create, urlSource, IpfsHttpClient } from 'ipfs-http-client';

	async function getLinks(ipfsPath) {
		const url = 'https://dweb.link/api/v0';
		const ipfs = create({ url });
	
		const links = [];
		for await (const link of ipfs.ls(ipfsPath)) {
			links.push(link);
		}
		console.log(links[0]);

		//retrieveFiles(links[0].path);
		let linkImageMeta = "ipfs://" + links[0].path ;
		return linkImageMeta;
    }
    
    async function retrieveFiles (cid) {
		const client = makeStorageClient()
		const res = await client.get(cid)
		console.log(`Got a response! [${res.status}] ${res.statusText}`)
		console.log(res);
		if (!res.ok) {
		  throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
		}
	  
		// unpack File objects from the response
		const files = await res.files()
		console.log(files);
		for (const file of files) {
		  console.log(`${file.cid} -- ${file.name} -- ${file.size}`)
		}
		//setContentCID('');
    }
    
    export {getLinks, retrieveFiles};