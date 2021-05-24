const { Stage } = require('telegraf')

const menuScene = require('./scenes/menu')
const airdropScene = require('./scenes/airdrop')

module.exports = new Stage([
    menuScene,
    airdropScene,
])
