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
  scheduledAt?: Date | undefined
  publishedAt?: Date | undefined
}
export interface ThreadSummary {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  scheduledAt?: Date
  publishedAt?: Date
  nbMesssages: number
}

