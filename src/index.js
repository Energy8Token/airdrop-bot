require('dotenv').config()

const bot = require('./bot')

const launch = async () => {
    try {
        await bot.launch()
    } catch (err) {
        console.log(err)
    }
}

launch()
