import { prisma } from '../../prisma/db'

type UpdateSettingsRequest = {
    display_name?: string
    avatar_url?: string
    bluesky_enabled?: boolean
    bluesky_url?: string
    bluesky_identifier?: string
    bluesky_password?: string
    mastodon_enabled?: boolean
    mastodon_url?: string
    mastodon_access_token?: string
    twitter_enabled?: boolean
    twitter_consumer_key?: string
    twitter_consumer_secret?: string
    twitter_access_token?: string
    twitter_access_secret?: string
}

export default defineEventHandler(async (event: any) => {
    console.log(`PATCH /api/settings`)
    try {
        const requestData: any = await readBody(event)
        const now = new Date()

        const existingRecord = await prisma.settings.findFirst()

        if (!existingRecord) {
            throw new Error('There is no settings defined in the system')
        }

        const data: any = {
            updatedAt: now,
        }
        if (typeof requestData.avatar_url !== 'undefined') data.avatarUrl = requestData.avatar_url
        if (typeof requestData.display_name !== 'undefined') data.displayName = requestData.display_name
        if (typeof requestData.bluesky_enabled !== 'undefined') data.blueskyEnabled = requestData.bluesky_enabled
        if (typeof requestData.bluesky_url !== 'undefined') data.blueskyUrl = requestData.bluesky_url
        if (typeof requestData.bluesky_identifier !== 'undefined') data.blueskyIdentifier = requestData.bluesky_identifier
        if (typeof requestData.bluesky_password !== 'undefined') data.blueskyPassword = requestData.bluesky_password
        if (typeof requestData.mastodon_enabled !== 'undefined') data.mastodonEnabled = requestData.mastodon_enabled
        if (typeof requestData.mastodon_url !== 'undefined') data.mastodonUrl = requestData.mastodon_url
        if (typeof requestData.mastodon_access_token !== 'undefined') data.mastodonAccessToken = requestData.mastodon_access_token
        if (typeof requestData.twitter_enabled !== 'undefined') data.twitterEnabled = requestData.twitter_enabled
        if (typeof requestData.twitter_consumer_key !== 'undefined') data.twitterConsumerKey = requestData.twitter_consumer_key
        if (typeof requestData.twitter_consumer_secret !== 'undefined') data.twitterConsumerSecret = requestData.twitter_consumer_secret
        if (typeof requestData.twitter_access_token !== 'undefined') data.twitterAccessToken = requestData.twitter_access_token
        if (typeof requestData.twitter_access_secret !== 'undefined') data.twitterAccessSecret = requestData.twitter_access_secret

        const [settings] = await prisma.$transaction([
            prisma.settings.update({
                where: {
                    id: existingRecord.id
                },
                data,
            })
        ])

        const result: any = {
            id: settings.id,
            avatar_url: settings.avatarUrl,
            display_name: settings.displayName,
            bluesky_enabled: settings.blueskyEnabled,
            bluesky_url: settings.blueskyUrl,
            bluesky_identifier: settings.blueskyIdentifier,
            bluesky_password: settings.blueskyPassword,
            mastodon_enabled: settings.mastodonEnabled,
            mastodon_url: settings.mastodonUrl,
            mastodon_access_token: settings.mastodonAccessToken,
            twitter_enabled: settings.twitterEnabled,
            twitter_consumer_key: settings.twitterConsumerKey,
            twitter_consumer_secret: settings.twitterConsumerSecret,
            twitter_access_token: settings.twitterAccessToken,
            twitter_access_secret: settings.twitterAccessSecret,
        }

        return result;

    } catch (error: any) {
        console.error(error)
    }
})
