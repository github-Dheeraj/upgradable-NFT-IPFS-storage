
import makeStorageClient from "./ipfsClient.js"
import * as Name from 'web3.storage/name'


async function nameContent(ipfsProfileDict) {

    const client = makeStorageClient()
    const name = await Name.create();
    console.log('Name:', name.toString())

    const value = `/ipfs/${ipfsProfileDict.profileJsonCid }`
    const revision = await Name.v0(name, value)
    await Name.publish(client, revision, name.key)

    // Store the signing key to a file for use later
    //await fs.promises.writeFile('priv.key', name.key.bytes)

    ipfsProfileDict.ipnsName = name.toString();
    ipfsProfileDict.profileRevision = revision;
    ipfsProfileDict.profileNameKey = name.key['bytes'];
    console.log(ipfsProfileDict);

    return name.toString();
}
async function resolveName(ipfsProfileDict){
    
    const nameipfs = ipfsProfileDict.ipnsName;
    console.log(nameipfs)
    const client = makeStorageClient()
    //const bytes = await fs.promises.readFile('priv.key')
    //const name = await Name.from(bytes)	
    const name = Name.parse(nameipfs)

    const revision = await Name.resolve(client, name)

    console.log('Resolved value:', revision.value)
    // e.g. /ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
}

async function updateName(ipfsProfileDict){

    const client = makeStorageClient()
    const name = await Name.from(ipfsProfileDict.profileNameKey)

    const updatedCID = ipfsProfileDict.profileJsonCid;
    // ...later

    const nextValue = `/ipfs/${updatedCID}`
    console.log(nextValue);
    // Make a revision to the current record (increments sequence number and sets value)
    const nextRevision = await Name.increment(ipfsProfileDict.profileRevision, nextValue)

    await Name.publish(client, nextRevision, name.key)
    ipfsProfileDict.profileRevision = nextRevision

    console.log(ipfsProfileDict);
}

export {nameContent, resolveName, updateName};
