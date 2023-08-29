import { createRestAPIClient, mastodon } from 'masto'
import AtProtocole from "@atproto/api";
import { ReplyRef } from '@atproto/api/dist/client/types/app/bsky/feed/post';
import { TwitterApi } from 'twitter-api-v2';

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

async function postMessageOnMastodon(status: string, inReplyToId: string | null): Promise<mastodon.v1.Status> {
    return mastodonClient.v1.statuses.create({
        status,
        visibility: 'public',
        inReplyToId
    });
}

async function postMessagesOnMastodon(messages: Message[]): Promise<void> {
    let inReplyToId: string | null = null

    for (const message of messages) {
        console.log('Publish message on Mastodon…')
        const status: mastodon.v1.Status = await postMessageOnMastodon(message.body, inReplyToId);
        inReplyToId = status.id
        console.log('Message published on Mastodon.')
    }

}

// Publication on Bluesky

interface RecordRef {
    uri: string;
    cid: string;
}

async function postMessageOnBluesky(status: string, reply: ReplyRef | null): Promise<RecordRef> {
    if (reply) {
        return blueskyClient.post({
            text: status,
            reply
        });
    } else {
        return blueskyClient.post({
            text: status
        });
    }
}

async function postMessagesOnBluesky(messages: Message[]): Promise<void> {
    let reply: ReplyRef | null = null

    for (const message of messages) {
        console.log('Publish message on Bluesky')
        const recordRef: RecordRef = await postMessageOnBluesky(message.body, reply);
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
}

// Publication on Twitter

async function postMessagesOnTwitter(messages: Message[]): Promise<void> {
    const tweets = messages.map(message => message.body)
    await twitterClient.v2.tweetThread(tweets);
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

interface Message {
    body: string;
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