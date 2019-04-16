const axios = require('axios')
const Web3 = require('web3')
const ERC725DID = require('@xiawpohr/erc725-did-method').default

const web3 = new Web3('http://127.0.0.1:8545')
const erc725did = new ERC725DID({ web3 })

const address = '0x7A1723a4B45715F6359e12179476473A02671BDa'
const privateKey = '0xb7b6dbc514d203932be7783592c917e9f2867b3c47143c3dd8512b42d3d9d2fd'

main ()

async function main () {
  try {
    const res = await axios.get('http://localhost:3000/challenge')
    const message = res.data.message
    const callback = res.data.callback
  
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

  } catch (e) {
    throw new Error(e)
  }

}
