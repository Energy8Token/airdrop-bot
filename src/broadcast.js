require('dotenv').config()
const Broadcaster = require('telegraf-broadcast')
const dedent = require('dedent')

const sessions = require('../session.json').sessions

const userIds = sessions.map(session => parseInt(session.id.split(':')[0]))

const bot = require('./bot')
const broadcaster = new Broadcaster(bot, {
    queueName: 'airdrop',
    bullQueueOptions: {
        limiter: {
           max: 5,
           duration: 2500,
        },
    },
})

broadcaster.sendText(userIds, dedent`
🎉 <b>Congratulation!</b> 1000 people took part in the airdrop

This means that the airdrop is finished and is now in a verification state.

Tokens will be sent to your wallet on June 17, and if you have any questions or want to make sure that you have specified the correct wallet, write @Ballet228
`, { parse_mode: 'HTML' })

broadcaster.onProcessed(() => console.log(`Progress: ${broadcaster.progress()}%`))
broadcaster.onFailed(job => {
    const failedJob = Broadcaster.formatFailedJob(job)

    console.error(`User with id ${failedJob.data.chatId} did not receive the message. Reason: ${failedJob.failedReason.message}`)
})
