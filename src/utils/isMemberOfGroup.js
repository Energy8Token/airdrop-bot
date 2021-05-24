const isMemberOfGroup = async (ctx, groupId) => {
    const member = await ctx.telegram.getChatMember(groupId, ctx.from.id)

    return member.status !== 'left'
}

module.exports = isMemberOfGroup
