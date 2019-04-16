const Web3 = require('web3')
const web3 = new Web3('http://127.0.0.1:8545')

const address = '0x7A1723a4B45715F6359e12179476473A02671BDa'
const privateKey = '0xb7b6dbc514d203932be7783592c917e9f2867b3c47143c3dd8512b42d3d9d2fd'
const message = 'This is a message.'

const signedObj = web3.eth.accounts.sign(message, privateKey)
const signature = signedObj.signature

const recoveredAddr = web3.eth.accounts.recover(signedObj)
console.log(recoveredAddr)
