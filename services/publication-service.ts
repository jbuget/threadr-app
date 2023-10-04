import { Thread, Message } from "~/models/models";
import { createRestAPIClient, mastodon } from "masto";
import AtProtocole from "@atproto/api";
import { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import {
  SendTweetV2Params,
  TweetV2PostTweetResult,
  TwitterApi,
} from "twitter-api-v2";
import { prisma } from "~/prisma/db";
import buildUrlFacets from "./bluesky-url-facets-extractor";
import { Settings } from "@prisma/client";

// Publication on Bluesky

interface RecordRef {
  uri: string;
  cid: string;
}

async function getBlueskyClient(settings: Settings): Promise<AtProtocole.BskyAgent> {
  console.log("Connect to Bluesky…")
  let blueskyClient: AtProtocole.BskyAgent
  blueskyClient = new AtProtocole.BskyAgent({
    service: settings.blueskyUrl,
  })
  await blueskyClient.login({
    identifier: settings.blueskyIdentifier,
    password: settings.blueskyPassword,
  })
  console.log("Connection to Bluesky acquired.")
  return blueskyClient
}

async function postMessageOnBluesky(
  blueskyClient: AtProtocole.BskyAgent,
  message: Message,
  reply: ReplyRef | null
): Promise<RecordRef> {
  try {
    const record: any = {};
    record.text = message.text;
    record.facets = buildUrlFacets(message.text);

    if (message.attachments && message.attachments.length > 0) {
      let embed: any;
      embed = {
        $type: "app.bsky.embed.images",
        images: [],
      };
      for (const file of message.attachments) {
        const mediaFile = await fetch(file.location);
        const mediaData = await mediaFile.arrayBuffer();
        const mediaResponse = await blueskyClient.uploadBlob(
          Buffer.from(mediaData),
          { encoding: file.mimetype }
        );
        embed.images.push({ image: mediaResponse.data.blob, alt: file.alt });
      }
      record.embed = embed;
    }

    if (reply) {
      record.reply = reply;
    }

    return blueskyClient.post(record);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function postMessagesOnBluesky(blueskyClient: AtProtocole.BskyAgent, messages: Message[]): Promise<void> {
  try {
    let reply: ReplyRef | null = null;

    for (const message of messages) {
      console.log("Publish message on Bluesky");
      const recordRef: RecordRef = await postMessageOnBluesky(blueskyClient, message, reply);
      reply = {
        parent: {
          cid: recordRef.cid,
          uri: recordRef.uri,
        },
        root: {
          cid: recordRef.cid,
          uri: recordRef.uri,
        },
      };
      console.log("Message published on Bluesky.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Publication on Mastodon

async function getMastodonClient(settings: Settings): Promise<mastodon.rest.Client> {
  console.log("Connect to Mastodon…")
  let mastodonClient: mastodon.rest.Client
  mastodonClient = createRestAPIClient({
    url: settings.mastodonUrl || 'undefined_url',
    accessToken: settings.mastodonAccessToken || 'undefined_access_token',
  })
  console.log("Connection to Mastodon acquired.")
  return mastodonClient
}

async function postMessageOnMastodon(
  mastodonClient: mastodon.rest.Client,
  message: Message,
  inReplyToId: string | null
): Promise<mastodon.v1.Status> {
  const mediaIds: string[] = [];
  if (message.attachments) {
    for (const attachment of message.attachments) {
      const remoteFile = await fetch(attachment.location);
      const media = await mastodonClient.v2.media.create({
        file: await remoteFile.blob(),
        description: attachment.alt,
      });
      mediaIds.push(media.id);
    }
  }

  return mastodonClient.v1.statuses.create({
    status: message.text,
    visibility: "public",
    mediaIds,
    inReplyToId,
  });
}

async function postMessagesOnMastodon(mastodonClient: mastodon.rest.Client, messages: Message[]): Promise<void> {
  let inReplyToId: string | null = null;

  for (const message of messages) {
    console.log("Publish message on Mastodon…");
    const status: mastodon.v1.Status = await postMessageOnMastodon(
      mastodonClient,
      message,
      inReplyToId
    );
    inReplyToId = status.id;
    console.log("Message published on Mastodon.");
  }
}

// Publication on Twitter

async function getTwitterClient(settings: Settings): Promise<TwitterApi> {
  console.log("Connect to Twitter…")
  let twitterClient: TwitterApi
  twitterClient = new TwitterApi({
    appKey: settings.twitterConsumerKey || 'twitter_consumer_key',
    appSecret: settings.twitterConsumerSecret || 'twitter_consumer_secret',
    accessToken: settings.twitterAccessToken || 'twitter_access_token',
    accessSecret: settings.twitterAccessSecret || 'twitter_access_secret',
  });
  console.log("Connection to Twitter acquired.")
  return twitterClient
}

async function postMessageOnTwitter(
  twitterClient: TwitterApi,
  message: Message,
  reply: TweetV2PostTweetResult | null
): Promise<TweetV2PostTweetResult> {
  try {
    const tweet: SendTweetV2Params = {};
    if (message.text) {
      tweet.text = message.text;
    }
    if (message.attachments && message.attachments.length > 0) {
      const mediaIds = [];
      for (const file of message.attachments) {
        const mediaResponse = await fetch(file.location);
        const mediaData = await mediaResponse.arrayBuffer();
        const mediaId = await twitterClient.v1.uploadMedia(
          Buffer.from(mediaData),
          { mimeType: file.mimetype }
        );
        mediaIds.push(mediaId);
      }
      tweet.media = { media_ids: mediaIds };
    }
    if (reply && reply.data) {
      tweet.reply = { in_reply_to_tweet_id: reply.data.id };
    }
    return twitterClient.v2.tweet(tweet);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function postMessagesOnTwitter(twitterClient: TwitterApi, messages: Message[]): Promise<void> {
  let reply: TweetV2PostTweetResult | null = null;

  for (const message of messages) {
    console.log("Publish message on Twitter");
    reply = await postMessageOnTwitter(twitterClient, message, reply);
    console.log("Message published on twitter.");
  }
}

async function postMessages(messages: Message[]): Promise<string[]> {
  const platforms: string[] = [];

  const settings = await prisma.settings.findFirst()

  if (settings) {
    if (settings.blueskyEnabled) {
      const blueskyClient = await getBlueskyClient(settings)
      console.log("Publish messages on Bluesky");
      await postMessagesOnBluesky(blueskyClient, messages);
      platforms.push("Bluesky");
      console.log("Messages published on Bluesky.");
    }

    if (settings.mastodonEnabled) {
      const mastodonClient = await getMastodonClient(settings)
      console.log("Publish messages on Mastodon…");
      await postMessagesOnMastodon(mastodonClient, messages);
      platforms.push("Mastodon");
      console.log("Messages published on Mastodon.");
    }

    if (settings.twitterEnabled) {
      const twitterClient = await getTwitterClient(settings)
      console.log("Publish messages on Twitter…");
      await postMessagesOnTwitter(twitterClient, messages);
      platforms.push("Twitter");
      console.log("Messages published on Twitter.");
    }

  }
  return platforms;
}

export async function publish(threadId: number): Promise<Thread> {
  const threadData = await prisma.thread.findFirst({
    where: {
      id: threadId,
    },
    include: {
      versions: true,
    },
  });

  if (!threadData) {
    throw new Error(
      `Could not publish thread with ID ${threadId} because it does not exist.`
    );
  }

  const [latestVersion] = threadData.versions.slice(-1);
  const latestVersionData: any = latestVersion.data;

  console.log("Publish thread…");
  const platforms: string[] = await postMessages(latestVersionData.messages);

  await prisma.thread.update({
    where: {
      id: threadId,
    },
    data: {
      publishedAt: new Date(),
    },
  });

  let report = "Thread published";
  if (platforms.length === 1) {
    report += " on " + platforms[0];
  }
  if (platforms.length > 1) {
    const last = platforms.pop();
    report += " on " + platforms.join(", ") + " and " + last;
  }
  console.log(`${report} 🎉 !`);
  return {
    id: threadData.id,
    messages: latestVersionData.messages,
  };
}
