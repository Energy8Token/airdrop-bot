const { BaseScene } = require('telegraf')
const { Keyboard, Key } = require('telegram-keyboard')
const dedent = require('dedent')

const getAllMembers = require('../utils/getAllMembers')

const scene = new BaseScene('menu')

scene.enter(ctx => {
    return ctx.reply(dedent`
        Hello, Welcome to the ⚡️Energy 8 Airdrop!

        💸 You can get up to <b>250 000 000 E8</b> for participating in our airdrop and <b>50 000 000 E8</b> for each person you refer

        <i>If you get stuck at any stage, you can enter /reset command to reset state</i>
    `, Keyboard.make([
        [Key.text('💸 Airdrop', !!ctx.session.wallet)],
        ['Profile', 'Airdrop Status'],
    ]).reply({ parse_mode: 'HTML' }))
})

scene.hears('💸 Airdrop', ctx => {
    if (ctx.session.wallet) {
        return ctx.reply('You have already registered')
    }

    return ctx.scene.enter('airdrop')
})

scene.hears('Airdrop Status', async ctx => {
    const { members } = await getAllMembers()

    const status = members.length < 1000 ? 'Active' : 'In Review'

    return ctx.reply(dedent`
        ${status === 'Active' ? '🟢' : '🟠'} <b>Status:</b> ${status}
        👥 <b>Participants:</b> ${members.length} / 1000
    `, { parse_mode: 'HTML', disable_web_page_preview: true })
})

scene.hears('Profile', async ctx => {
    return ctx.reply(dedent`
        ⚡️ <b>Balance:</b> ${ctx.session.tokens} E8
        👥 <b>Referrals:</b> ${ctx.session.referrals.length}

        Get <b>50 000 000 E8</b> for each referral!
        Your referral link: https://t.me/energy_airdrop_bot?start=${ctx.from.id}
    `, { parse_mode: 'HTML', disable_web_page_preview: true })
})

module.exports = scene
