const express = require('express')
const bodyParser = require('body-parser')
const Web3 = require('web3')
const ERC725DID = require('@xiawpohr/erc725-did-method').default

const web3 = new Web3('http://127.0.0.1:8545')
const erc725did = new ERC725DID({ web3 })


const app = express()
const port = 3000

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

app.use(bodyParser.json())
app.get('/challenge', getChallenge)
app.post('/response', postResponse)
app.listen(port, () => console.log(`listening on port ${port}!`))
