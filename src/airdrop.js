const Web3 = require('web3')

const Energy8AirdropABI = require('./abi/Energy8Airdrop.abi.json')
const Energy8AirdropAddress = '0x9AE1767aDa3c89F3C511109fe95C9e8383439f03'

const web3 = new Web3(process.env.BSC_NODE)

const Energy8Airdrop = new web3.eth.Contract(Energy8AirdropABI, Energy8AirdropAddress)

const airdropEstimate = async (members) => {
    return Energy8Airdrop.methods.airdrop(members.wallets, members.tokens).estimateGas({
        from: process.env.OWNER_WALLET_ADDRESS,
        gas: 100000000,
    })
}

const airdrop = async (members) => {
    const tx = {
        from: process.env.OWNER_WALLET_ADDRESS,
        to: Energy8AirdropAddress,
        gas: 1000000,
        data: Energy8Airdrop.methods
            .airdrop(members.wallets, members.tokens)
            .encodeABI()
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.WALLET_PRIVATE_KEY)

    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction)

    return new Promise((resolve, reject) => {
        sentTx.on('receipt', receipt => resolve(receipt))
        sentTx.on('error', err => reject(err))
    })
}

module.exports = {
    airdrop,
    airdropEstimate,
}
