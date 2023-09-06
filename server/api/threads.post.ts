import { prisma } from '../../prisma/db'

interface CreateOrUpdateThreadRequest {
    id?: number
    createdAt: Date
    updatedAt: Date
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
    const threadData: CreateOrUpdateThreadRequest = await readBody(event)
    const now = new Date()

    const [persistedThread] = await prisma.$transaction([
        prisma.thread.create({
            data: {
                createdAt: now,
                updatedAt: now,
                published: false,
                versions: {
                    create: [{
                        createdAt: now,
                        data: JSON.stringify(threadData)
                    }]
                }
            },
            include: {
                versions: true
            }
        })])
    console.log(persistedThread)
    return persistedThread;
})