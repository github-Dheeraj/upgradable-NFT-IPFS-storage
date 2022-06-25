
import  { Buffer }  from "buffer";
import makeStorageClient from "./ipfsClient.js"

const  makeImageJsonFileObjects = async (IpfsImageObj)=> {
    const obj = { Description: IpfsImageObj.description, image:IpfsImageObj.imgIpfsUrl, name: IpfsImageObj.imgName }
    const buffer = Buffer.from(JSON.stringify(obj))

    const files = [
        //new File(['This is stored in Ipfs'], 'IpfsText.txt'),
        new File([buffer], 'nftTrutsV1.json')
    ]
    return files
}

const storeImageJsonFiles = async (IpfsImageObj) => {

    const fileObj = await makeImageJsonFileObjects(IpfsImageObj);
    console.log(fileObj)
    const client = makeStorageClient()
    const cid = await client.put(fileObj, {name: 'profileJson'})
    console.log('stored files with cid:', cid)
    //setImageJsonCID(cid)
    return cid
}

export { storeImageJsonFiles };