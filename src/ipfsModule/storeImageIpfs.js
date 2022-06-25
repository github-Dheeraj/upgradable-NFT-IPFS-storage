import  makeStorageClient  from "./ipfsClient.js"
const axios = require('axios').default;

const makeFileImagesObjects = async (IpfsImageObj)=> {
    const response = await axios.get(IpfsImageObj.imgSrcUrl,  { responseType: 'arraybuffer' })

    const buffer1 = Buffer.from(response.data, "utf-8")
    const files = [
        new File([buffer1], `${IpfsImageObj.imgName}.png`),
    ]
    console.log(files);
    return files
}

 const storeImageFiles = async (IpfsImageObj)=> {
    const fileObj = await makeFileImagesObjects(IpfsImageObj);
    //console.log(fileObj)
    const client = makeStorageClient()
    const cid = await client.put(fileObj)

    console.log('stored files with cid:', cid)
    //setContentCID(cid);
    //setimageIpfssrc(`/ipfs/${cid}`)
    return cid
}

export default storeImageFiles;