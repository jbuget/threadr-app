import { describe, it, expect, beforeAll } from "vitest"
import { setup, fetch } from '@nuxt/test-utils'
import { clearData } from '../utils/test-utils'
import { prisma } from '../prisma/db'

async function insertIntoSettings(data: any): Promise<void> {
    try {
        await prisma.settings.create({ data })
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data into Settings:', error);
    }
}

describe("GET /api/settings", async () => {

    await setup({
        browser: false,
    })

    describe('when there is no data in database', () => {

        beforeAll(async () => {
            await clearData();
        });

        it("should respond with status code 204", async () => {
            // when
            const response: Response = await fetch('/api/settings');

            // then
            expect(response.status).toBe(204)
        });

        it("should return nothing", async () => {
            // when
            const response: Response = await fetch('/api/settings');

            // then
            expect(response.body).toBe(null)
        })

    })

    describe('when there is data in database', () => {

        const data = {
            displayName: 'jbuget@threadr.app',
            avatarUrl: 'https://example.com/avatar.png',
            blueskyEnabled: true,
            blueskyUrl: 'https://bsky.social',
            blueskyIdentifier: 'my_bluesky_identifier',
            blueskyPassword: 'my_bluesky_password',
            mastodonEnabled: true,
            mastodonUrl: 'https://piaille.fr',
            mastodonAccessToken: 'my_mastodon_access_token',
            twitterEnabled: true,
            twitterConsumerKey: 'my_mastodon_access_token',
            twitterConsumerSecret: 'my_twitter_consumer_secret',
            twitterAccessToken: 'my_twitter_access_token',
            twitterAccessSecret: 'my_twitter_access_secret',
        }

        beforeAll(async () => {
            await clearData();
            await insertIntoSettings(data)
        });

        it("should respond with status code 200", async () => {
            // when
            const response: Response = await fetch('/api/settings');

            // then
            expect(response.status).toBe(200)
        });

        it("should return a JSON object", async () => {
            // when
            const response: Response = await fetch('/api/settings');

            /// then
            const body = await response.json();
            expect(body).toEqual({
                display_name: data.displayName,
                avatar_url: data.avatarUrl,
                bluesky_enabled: data.blueskyEnabled,
                bluesky_url: data.blueskyUrl,
                bluesky_identifier: data.blueskyIdentifier,
                bluesky_password: data.blueskyPassword,
                mastodon_enabled: data.mastodonEnabled,
                mastodon_url: data.mastodonUrl,
                mastodon_access_token: data.mastodonAccessToken,
                twitter_enabled: data.twitterEnabled,
                twitter_consumer_key: data.twitterConsumerKey,
                twitter_consumer_secret: data.twitterConsumerSecret,
                twitter_access_token: data.twitterAccessToken,
                twitter_access_secret: data.twitterAccessSecret,
            })
        });
    })

});
