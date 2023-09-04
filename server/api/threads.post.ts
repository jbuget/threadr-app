import { createRestAPIClient, mastodon } from 'masto'
import AtProtocole from "@atproto/api";
import { ReplyRef } from '@atproto/api/dist/client/types/app/bsky/feed/post';
import { SendTweetV2Params, TweetV2PostTweetResult, TwitterApi } from 'twitter-api-v2';

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
    if (message.files) {
        for (const file of message.files) {
            const remoteFile = await fetch(file.location);
            const attachment = await mastodonClient.v2.media.create({
                file: await remoteFile.blob(),
                description: file.description,
            });
            mediaIds.push(attachment.id)
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

        if (message.files && message.files.length > 0) {
            let embed: any
            embed = {
                $type: 'app.bsky.embed.images',
                images: []
            }
            for (const file of message.files) {
                const mediaFile = await fetch(file.location);
                const mediaData = await mediaFile.arrayBuffer();
                const mediaResponse = await blueskyClient.uploadBlob(Buffer.from(mediaData), { encoding: file.mimetype });
                embed.images.push({ image: mediaResponse.data.blob, alt: file.description })
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
        if (message.files && message.files.length > 0) {
            const mediaIds = []
            for (const file of message.files) {
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

async function postMessages(messages: Message[]): Promise<void> {
    console.log('Publish messages on Bluesky')
    await postMessagesOnBluesky(messages)
    console.log('Messages published on Bluesky.')

     console.log('Publish messages on Mastodon…')
    await postMessagesOnMastodon(messages)
    console.log('Messages published on Mastodon.')

    console.log('Publish messages on Twitter…')
    await postMessagesOnTwitter(messages)
    console.log('Messages published on Twitter.')
}

interface MessageAttachment {
    location: string;
    data: any;
    mimetype?: string;
    description?: string
}

interface Message {
    text: string;
    files?: MessageAttachment[];
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log('Publish thread…')
    console.log(body)
    await connectClients()
    await postMessages(body.messages)
    console.log('Thread published 🎉')
    return { body }
})