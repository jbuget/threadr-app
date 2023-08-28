import { createRestAPIClient, mastodon } from 'masto'

function getEnvString(key: string): string {
    return process.env[key] || 'undefined'
}

let mastodonClient: mastodon.rest.Client

async function connectClients(): Promise<void> {
    if (!mastodonClient) {
        console.log('Connect to Mastodon…')
        mastodonClient = createRestAPIClient({
            url: getEnvString('MASTODON_URL'),
            accessToken: getEnvString('MASTODON_ACCESS_TOKEN')
        })
        console.log('Connection to Mastodon acquired.')
    }
}

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

async function postMessages(messages: Message[]): Promise<void> {
    console.log('Publish messages on Mastodon…')
    await postMessagesOnMastodon(messages)
    console.log('Messages published on Mastodon.')
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