import { prisma } from '../../prisma/db'

type CreateThreadRequest = {
    published: boolean
    messages: [{
        text: string,
        attachments: [{
            createdAt: Date
            updatedAt: Date
            location: string
            alt?: string
        }]
    }]
}

export default defineEventHandler(async (event: any) => {
    console.log(`GET /api/threads`)

    const threadData: CreateThreadRequest = await readBody(event)
    const now = new Date()

    const [thread] = await prisma.$transaction([
        prisma.thread.create({
            data: {
                createdAt: now,
                updatedAt: now,
                published: false,
                versions: {
                    create: [{
                        createdAt: now,
                        data: threadData
                    }]
                }
            },
            include: {
                versions: true
            }
        })])
    const result: any = { ...thread }
    if (thread && thread.versions) {
        const [latest] = thread.versions.slice(-1)
        result.latest = latest
    }
    console.log(result)
    return result;
})