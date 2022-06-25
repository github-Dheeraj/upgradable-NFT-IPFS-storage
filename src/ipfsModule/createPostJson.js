import makeStorageClient from "./ipfsClient.js"

const  makeJsonFileObjectsPost = async (profileId, reviewDesciption)=> {
    const obj = { 
        Description: reviewDesciption,
        profileId: profileId,
    }
    const buffer = Buffer.from(JSON.stringify(obj))

    const files = [
        //new File(['This is stored in Ipfs'], 'IpfsText.txt'),
        new File([buffer], `${profileId}.json`)
    ]
    console.log(files);
    return files
}


async function storePostJsonFiles (profileId, reviewDesciption) {

    const fileObj = await makeJsonFileObjectsPost(profileId, reviewDesciption);
    console.log(fileObj)
    const client = makeStorageClient()
    const cid = await client.put(fileObj, {name: 'profileJson'})
    console.log('stored files with cid:', cid)
    setnftJsonCID(cid);
    ipfsProfileDict.profileJsonCid = cid;
    return cid
}

export {storePostJsonFiles};