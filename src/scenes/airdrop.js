const WizardScene = require('telegraf/scenes/wizard')
const { Composer } = require('telegraf')
const { Keyboard } = require('telegram-keyboard')
const dedent = require('dedent')
const createCaptcha = require('nodejs-captcha')
const Web3 = require('web3')

const isMemberOfGroup = require('../utils/isMemberOfGroup')
const getAllMembers = require('../utils/getAllMembers')

const scene = new WizardScene('airdrop',
    async (ctx) => {
        ctx.session.captchaIsCompleted = false

        await ctx.reply(dedent`
            Подпишитесь на наши телеграм каналы
    
            @energy8rus
            @energy8eng
        `, Keyboard.reply('Check'))

        return ctx.wizard.next()
    },
    new Composer().hears('Check', async (ctx) => {
        const isMember1 = await isMemberOfGroup(ctx, '@energy8rus')
        const isMember2 = await isMemberOfGroup(ctx, '@energy8eng')
    
        if (!isMember1 || !isMember2) {
            return ctx.reply('Loh')
        }
        
        await ctx.reply(dedent`
            Подпишитесь на твиттер @energy8rus и введите свой никнейм для проверки подписки
        `, Keyboard.remove())

        return ctx.wizard.next()
    }),
    async (ctx) => {
        await ctx.reply('Отлично, теперь пройдите капчу')
    
        const captcha = createCaptcha()
    
        ctx.session.captchaValue = captcha.value
    
        await ctx.replyWithPhoto({ source: Buffer.from(captcha.image.replace('data:image/jpeg;base64,', ''), 'base64') })

        return ctx.wizard.next()
    },
    async (ctx) => {
        if (ctx.message.text !== ctx.session.captchaValue) {
            return ctx.reply('Captcha wrong!')
        }

        ctx.session.captchaIsCompleted = true
        ctx.session.captchaValue = null

        await ctx.reply('Теперь введите свой кошелек')

        return ctx.wizard.next()
    },
    async (ctx) => {
        const wallet = ctx.message.text
    
        if (!Web3.utils.isAddress(wallet)) {
            return ctx.reply('Wallet wrong')
        }

        const members = await getAllMembers()

        if (members.wallets.length >= 1000) {
            await ctx.reply('К сожалению всё')

            return ctx.scene.enter('menu')
        }

        if (members.wallets.includes(wallet)) {
            return ctx.reply('Этот кошелек уже был зарегистрирован')
        }

        ctx.session.wallet = wallet

        ctx.session.tokens += 250000000

        await ctx.reply('Ты зарегался, а теперь когда-то получишь свои N монет')

        return ctx.scene.enter('menu')
    }
)

scene.use((ctx, next) => {
    if (ctx.session.wallet) {
        return ctx.scene.enter('menu')
    }

    return next()
})

module.exports = scene
