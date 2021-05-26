const localSession = require('../session')

const getAllMembers = async () => {
    const data = await localSession.DB.read().then(DB => DB.value())

    const members = data.sessions.filter(session => !!session.data.wallet)

    const wallets = members.map(session => session.data.wallet)
    const tokens = members.map(session => session.data.tokens)

    return { members, wallets, tokens }
}

module.exports = getAllMembers
