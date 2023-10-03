import { describe, it, expect, beforeEach } from "vitest"
import { $fetch, setup } from '@nuxt/test-utils'
import { prisma } from '../prisma/db'

async function insertIntoSettings(data: any): Promise<any> {
    try {
        const settings = await prisma.settings.create({ data })
        console.log('Data inserted successfully');
        return settings
    } catch (error) {
        console.error('Error inserting data into Settings:', error);
    }
}

describe("PATCH /api/settings", async () => {

    await setup({ browser: false })

    describe('when there is data in database', () => {

        const beforeData = {
            displayName: 'before_display_name',
            avatarUrl: 'https://before.avatar.url',
            blueskyEnabled: false,
            blueskyUrl: 'https://before.bluesky.url',
            blueskyIdentifier: 'before_bluesky_identifier',
            blueskyPassword: 'before_bluesky_password',
            mastodonEnabled: false,
            mastodonUrl: 'https://before.mastodon.url',
            mastodonAccessToken: 'before_mastodon_access_token',
            twitterEnabled: false,
            twitterConsumerKey: 'before_mastodon_access_token',
            twitterConsumerSecret: 'before_twitter_consumer_secret',
            twitterAccessToken: 'before_twitter_access_token',
            twitterAccessSecret: 'before_twitter_access_secret',
        }

        let existingSettings: any

        const afterData = {
            displayName: 'after_display_name',
            avatarUrl: 'https://after.avatar.url',
            blueskyEnabled: true,
            blueskyUrl: 'https://after.bluesky.url',
            blueskyIdentifier: 'after_bluesky_identifier',
            blueskyPassword: 'after_bluesky_password',
            mastodonEnabled: true,
            mastodonUrl: 'https://after.mastodon.url',
            mastodonAccessToken: 'after_mastodon_access_token',
            twitterEnabled: true,
            twitterConsumerKey: 'after_mastodon_access_token',
            twitterConsumerSecret: 'after_twitter_consumer_secret',
            twitterAccessToken: 'after_twitter_access_token',
            twitterAccessSecret: 'after_twitter_access_secret',
        }

        const newBody = {
            display_name: afterData.displayName,
            avatar_url: afterData.avatarUrl,
            bluesky_enabled: afterData.blueskyEnabled,
            bluesky_url: afterData.blueskyUrl,
            bluesky_identifier: afterData.blueskyIdentifier,
            bluesky_password: afterData.blueskyPassword,
            mastodon_enabled: afterData.mastodonEnabled,
            mastodon_url: afterData.mastodonUrl,
            mastodon_access_token: afterData.mastodonAccessToken,
            twitter_enabled: afterData.twitterEnabled,
            twitter_consumer_key: afterData.twitterConsumerKey,
            twitter_consumer_secret: afterData.twitterConsumerSecret,
            twitter_access_token: afterData.twitterAccessToken,
            twitter_access_secret: afterData.twitterAccessSecret,
        }

        beforeEach(async () => {
            await prisma.settings.deleteMany()
            existingSettings = await insertIntoSettings(beforeData)
        });

        it.skip("should respond with status code 200", async () => {
            // when
            const response: Response = await $fetch('/api/settings', { method: 'PATCH', body: newBody });

            // then
            expect(response.status).toBe(200)
        })

        it.skip("should return a JSON object", async () => {
            // when
            const response: Response = await $fetch('/api/settings', { method: 'PATCH', body: newBody });

            // then
            const body = await response.json();
            expect(body).toEqual(newBody)
        });

        it("should update data in DB", async () => {
            // when
            await $fetch('/api/settings', { method: 'PATCH', body: { ...newBody } });

            // then
            const persistedSettings = await prisma.settings.findFirst()
            expect(persistedSettings).toMatchObject({
                id: existingSettings.id,
                createdAt: existingSettings.createdAt,
                ...afterData
            })
        });

    })

});
