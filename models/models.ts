export interface Attachment {
  location: string
  filename: string
  size: number
  mimetype: string
  alt?: string
}

export interface Message {
  text: string;
  attachments: Attachment[];
}


export interface Thread {
  id?: number
  messages?: Message[]
  createdAt?: Date
  updatedAt?: Date
  scheduledAt?: Date | undefined
  publishedAt?: Date | undefined
}
export interface ThreadSummary {
  id?: number
  title: string
  createdAt?: Date
  updatedAt?: Date
  scheduledAt?: Date
  publishedAt?: Date
  nbMesssages: number
}

export interface Settings {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  displayName?: string
  avatarUrl?: string
  blueskyEnabled: boolean
  blueskyUrl?: string
  blueskyIdentifier?: string
  blueskyPassword?: string
  mastodonEnabled: boolean
  mastodonUrl?: string
  mastodonAccessToken?: string
  twitterEnabled: boolean
  twitterConsumerKey?: string
  twitterConsumerSecret?: string
  twitterAccessToken?: string
  twitterAccessSecret?: string
}
