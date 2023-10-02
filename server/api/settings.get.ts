import { prisma } from '../../prisma/db'

export default defineEventHandler(async () => {
    console.log(`GET /api/settings`)

    try {
        const settings: any = await prisma.settings.findFirst()

        if (settings) {

            return {
                display_name: settings.displayName,
                avatar_url: settings.avatarUrl,
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
        }
        return null
    } catch (error: any) {
        console.error(error)
    }
})
