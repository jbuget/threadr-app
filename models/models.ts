export class Attachment {
    filename!: string
    location!: string
    size!: number
    mimetype!: string
    alt?: string

    constructor(filename: string, location: string, mimetype: string, size: number, alt?: string) {
        this.filename = filename
        this.location = location
        this.mimetype = mimetype
        this.size = size
        this.alt = alt
    }
}

export class Message {
    text!: string;
    attachments!: Attachment[];

    constructor(text: string, attachements?: Attachment[]) {
        this.text = text;
        if (attachements) {
            this.attachments = attachements
        } else {
            this.attachments = []
        }
    }
}

export class Thread {
  id?: number
  messages?: Message[]

  constructor(id?: number, messages?: Message[]) {
    if (id) {
        this.id = id
    }
    if (messages) {
        this.messages = messages
    } else {
        this.messages = []
    }
  }
}
export class ThreadSummmary {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  published: boolean = false
  nbMesssages: number = 0
  messages?: Message[]

  constructor() {
    this.messages = []
  }
}
