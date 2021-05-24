const dedent = require('dedent')
const { BaseScene } = require('telegraf')
const { Keyboard } = require('telegram-keyboard')

const scene = new BaseScene('menu')

scene.enter(ctx => {
    return ctx.reply('Menu', Keyboard.reply(['💸 Airdrop', 'Info']))
})

scene.hears('💸 Airdrop', ctx => {
    if (ctx.session.wallet) {
        return ctx.reply('Уже')
    }

    return ctx.scene.enter('airdrop')
})

scene.hears('Info', async ctx => {
    return ctx.reply(dedent`
        Баланс: ${ctx.session.tokens}
        Рефералов: ${ctx.session.referrals.length}

        Реферальная ссылка: https://t.me/energy_airdrop_bot?start=${ctx.from.id}
    `)
})

module.exports = scene
