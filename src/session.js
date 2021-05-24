const LocalSession = require('telegraf-session-local')

const localSession = new LocalSession({
    database: 'session.json',
    storage: LocalSession.storageFileAsync,
})

module.exports = localSession
