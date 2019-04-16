# DID Auth Playground
## Motivation
The motivation of the project is to make the concept into implementation about DID Auth. I want to try more various implementations to see their pros and cons.

## Simple Implementation
### Server
```js
// To make a chellenge to others
function getChallenge(req, res) {
  res.json({
    message: 'I do not tell a lie.',
    callback: 'http://localhost:3000/response'
  })
}

// To authenticate the response
async function postResponse(req, res) {
  try {
    // response is a signature string
    const resSignatire = req.body.response
    const did = req.body.did
  
    // Get publicKey in the DID Document
    const identity = await erc725did.connect(did)
    const rawDoc = await identity.resolve()
    const doc = JSON.parse(rawDoc)
    const publicKeyHex = doc.publicKey[0].publicKeyHex
    const publicKey = '0x' + publicKeyHex
  
    // recover the signature to address
    const recoveredAddress = web3.eth.accounts.recover('I do not tell a lie.', resSignatire)
    const hashedAddress = web3.utils.keccak256(recoveredAddress)
  
    // check if the hashedAddress is the same as publicKey
    if (hashedAddress === publicKey) {
      res.json({
        isAuth: true
      })
    } else {
      res.json({
        isAuth: false
      })
    }

  } catch (e) {
    res.status(400).json({
      error: e
    })
  }
}
```

### Client
```js
// Create a DID
const identity = await erc725did.register({
  from: address,
  gas: 3000000
})
const did = await identity.getDid()

// Sign the message
const signObj = web3.eth.accounts.sign(message, privateKey)
const signature = signObj.signature

// send response back
const result = await axios.post(callback, {
  response: signature,
  did
})
console.log(result.data)
```

### To test the implementation
```
npm run server
npm run client
```