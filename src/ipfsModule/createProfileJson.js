import makeStorageClient from "./ipfsClient.js"

const  makeJsonFileObjectsProfile = async (profileDict)=> {
    const obj = { 
        Description: profileDict.profDescription,
        image: profileDict.imageIpfsSrc,
        profileId: profileDict.profileId,    
        discordId: profileDict.discordId,
    }
    const buffer = Buffer.from(JSON.stringify(obj))

    const files = [
        //new File(['This is stored in Ipfs'], 'IpfsText.txt'),
        new File([buffer], `${profileDict.profileId}.json`)
    ]
    return files
}


async function storeProfileJsonFiles (profileDict) {

    const fileObj = await makeJsonFileObjectsProfile(profileDict);
    console.log(fileObj)
    const client = makeStorageClient()
    const cid = await client.put(fileObj, {name: 'profileJson'})
    console.log('stored files with cid:', cid)
    return cid
}

export { storeProfileJsonFiles };