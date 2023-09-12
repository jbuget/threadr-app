import { Thread, Message } from "~/models/models";
import { createRestAPIClient, mastodon } from 'masto'
import AtProtocole from "@atproto/api";
import { ReplyRef } from '@atproto/api/dist/client/types/app/bsky/feed/post';
import { SendTweetV2Params, TweetV2PostTweetResult, TwitterApi } from 'twitter-api-v2';
import { prisma } from "~/prisma/db";

function getEnvString(key: string): string {
    return process.env[key] || 'undefined'
}

// Social network API clients

let blueskyClient: AtProtocole.BskyAgent

let mastodonClient: mastodon.rest.Client

let twitterClient: TwitterApi;

async function connectClients(): Promise<void> {
    if (!blueskyClient) {
        console.log('Connect to Bluesky…')
        blueskyClient = new AtProtocole.BskyAgent({ service: getEnvString('BLUESKY_URL') })
        await blueskyClient.login({
            identifier: getEnvString('BLUESKY_IDENTIFIER'),
            password: getEnvString('BLUESKY_PASSWORD'),
        });
        console.log('Connection to Bluesky acquired.')
    }

    if (!mastodonClient) {
        console.log('Connect to Mastodon…')
        mastodonClient = createRestAPIClient({
            url: getEnvString('MASTODON_URL'),
            accessToken: getEnvString('MASTODON_ACCESS_TOKEN')
        })
        console.log('Connection to Mastodon acquired.')
    }
    if (!twitterClient) {
        console.log('Connect to Twitter…')
        twitterClient = new TwitterApi({
            appKey: getEnvString('TWITTER_CONSUMER_KEY'),
            appSecret: getEnvString('TWITTER_CONSUMER_SECRET'),
            accessToken: getEnvString('TWITTER_ACCESS_TOKEN'),
            accessSecret: getEnvString('TWITTER_ACCESS_SECRET')
        });
        console.log('Connection to Twitter acquired.')
    }
}

// Publication on Mastodon

async function postMessageOnMastodon(message: Message, inReplyToId: string | null): Promise<mastodon.v1.Status> {
    const mediaIds: string[] = []
    if (message.attachments) {
        for (const attachment of message.attachments) {
            const remoteFile = await fetch(attachment.location);
            const media = await mastodonClient.v2.media.create({
                file: await remoteFile.blob(),
                description: attachment.alt,
            });
            mediaIds.push(media.id)
        }
    }

    return mastodonClient.v1.statuses.create({
        status: message.text,
        visibility: 'public',
        mediaIds,
        inReplyToId
    });
}

async function postMessagesOnMastodon(messages: Message[]): Promise<void> {
    let inReplyToId: string | null = null

    for (const message of messages) {
        console.log('Publish message on Mastodon…')
        const status: mastodon.v1.Status = await postMessageOnMastodon(message, inReplyToId);
        inReplyToId = status.id
        console.log('Message published on Mastodon.')
    }
}

// Publication on Bluesky

interface RecordRef {
    uri: string;
    cid: string;
}

async function postMessageOnBluesky(message: Message, reply: ReplyRef | null): Promise<RecordRef> {
    try {

        const record: any = {}
        record.text = message.text

        if (message.attachments && message.attachments.length > 0) {
            let embed: any
            embed = {
                $type: 'app.bsky.embed.images',
                images: []
            }
            for (const file of message.attachments) {
                const mediaFile = await fetch(file.location);
                const mediaData = await mediaFile.arrayBuffer();
                const mediaResponse = await blueskyClient.uploadBlob(Buffer.from(mediaData), { encoding: file.mimetype });
                embed.images.push({ image: mediaResponse.data.blob, alt: file.alt })
            }
            record.embed = embed
        }

        if (reply) {
            record.reply = reply
        }

        return blueskyClient.post(record)
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function postMessagesOnBluesky(messages: Message[]): Promise<void> {
    try {
        let reply: ReplyRef | null = null

        for (const message of messages) {
            console.log('Publish message on Bluesky')
            const recordRef: RecordRef = await postMessageOnBluesky(message, reply);
            reply = {
                parent: {
                    cid: recordRef.cid,
                    uri: recordRef.uri
                },
                root: {
                    cid: recordRef.cid,
                    uri: recordRef.uri
                }
            }
            console.log('Message published on Bluesky.')
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

// Publication on Twitter

async function postMessageOnTwitter(message: Message, reply: TweetV2PostTweetResult | null): Promise<TweetV2PostTweetResult> {
    try {
        const tweet: SendTweetV2Params = {}
        if (message.text) {
            tweet.text = message.text
        }
        if (message.attachments && message.attachments.length > 0) {
            const mediaIds = []
            for (const file of message.attachments) {
                const mediaResponse = await fetch(file.location);
                const mediaData = await mediaResponse.arrayBuffer();
                const mediaId = await twitterClient.v1.uploadMedia(Buffer.from(mediaData), { mimeType: file.mimetype })
                mediaIds.push(mediaId)
            }
            tweet.media = { media_ids: mediaIds }
        }
        if (reply && reply.data) {
            tweet.reply = { in_reply_to_tweet_id: reply.data.id }
        }
        return twitterClient.v2.tweet(tweet)
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function postMessagesOnTwitter(messages: Message[]): Promise<void> {
    let reply: TweetV2PostTweetResult | null = null

    for (const message of messages) {
        console.log('Publish message on Twitter')
        reply = await postMessageOnTwitter(message, reply);
        console.log('Message published on twitter.')
    }
}

async function postMessages(messages: Message[]): Promise<string[]> {
    const platforms: string[] = []

    if (process.env.BLUESKY_ENABLED as string === 'true') {
        console.log('Publish messages on Bluesky')
        //await postMessagesOnBluesky(messages)
        platforms.push('Bluesky')
        console.log('Messages published on Bluesky.')
    }

    if (process.env.MASTODON_ENABLED as string === 'true') {
        console.log('Publish messages on Mastodon…')
        //await postMessagesOnMastodon(messages)
        platforms.push('Mastodon')
        console.log('Messages published on Mastodon.')
    }

    if (process.env.TWITTER_ENABLED as string === 'true') {
        console.log('Publish messages on Twitter…')
        //await postMessagesOnTwitter(messages)
        platforms.push('Twitter')
        console.log('Messages published on Twitter.')
    }
    return platforms
}

export async function publish(threadId: number): Promise<Thread> {
    const threadData = await prisma.thread.findFirst({
        where: {
            id: threadId
        },
        include: {
            versions: true
        }
    })
    
    if (!threadData) {
        throw new Error(`Could not publish thread with ID ${threadId} because it does not exist.`)
    }

    const [latestVersion] = threadData.versions.slice(-1)
    const latestVersionData: any = latestVersion.data

    console.log('Publish thread…')
    await connectClients()
    const platforms: string[] = await postMessages(latestVersionData.messages)

    await prisma.thread.update({
        where: {
            id: threadId
        }, 
        data: {
            publishedAt: new Date(),
        }
    })

    let report = 'Thread published'
    if (platforms.length === 1) {
        report += ' on ' + platforms[0]
    }
    if (platforms.length > 1) {
        const last = platforms.pop();
        report += ' on ' + platforms.join(', ') + ' and ' + last;
    }
    console.log(`${report} 🎉 !`)
    return {
        id: threadData.id,
        messages: latestVersionData.messages
    }
}
