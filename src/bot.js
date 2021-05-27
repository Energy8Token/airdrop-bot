const { Telegraf } = require('telegraf')
const Web3 = require('web3')

const scenes = require('./scenes')
const getAllMembers = require('./utils/getAllMembers')
const localSession = require('./session')
const { airdrop, airdropEstimate } = require('./airdrop')

const bot = new Telegraf(process.env.BOT_TOKEN)

const admin = parseInt(process.env.ADMIN)

bot.use(localSession)

bot.command('/airdrop_gas', Telegraf.acl(admin, async (ctx) => {
    try {
        const members = await getAllMembers()

        const estimateGas = await airdropEstimate(members)

        return ctx.reply(`Gas: ${estimateGas}`)
    } catch (err) {
        return ctx.reply(err.message)
    }
}))

bot.command('/airdrop', Telegraf.acl(admin, async (ctx) => {
    try {
        const members = await getAllMembers()

        await airdrop(members)

        return ctx.reply('Success')
    } catch (err) {
        return ctx.reply(err.message)
    }
}))

bot.use(scenes)

bot.catch((err) => console.log('Catch: ', err))

bot.start(async (ctx) => {
    if (!('referrals' in ctx.session)) {
        ctx.session.referrals = []
    }

    if (!('tokens' in ctx.session)) {
        ctx.session.tokens = 0
    }

    const referralId = parseInt(ctx.startPayload)

    if (referralId && referralId != ctx.from.id && !ctx.session.isReferral && !ctx.session.referrals.includes(referralId)) {
        const referral = await localSession.DB
            .get('sessions')
            .find({ id: `${referralId}:${referralId}` })
            .value()

        if (referral && !referral.data.referrals.includes(ctx.from.id)) {
            await localSession.DB
                .get('sessions')
                .find({ id: `${referralId}:${referralId}` })
                .update('data.tokens', t => t + 50000000)
                .get('data.referrals')
                .push(ctx.from.id)
                .write()

            ctx.session.isReferral = true
        }
    }

    return ctx.scene.enter('menu')
})

module.exports = bot
