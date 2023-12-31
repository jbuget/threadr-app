import { prisma } from '../../../prisma/db'

type UpdateThreadRequest = {
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
    const threadId = parseInt(event.context.params.id) as number
    
    console.log(`POST /api/threads/${threadId}`)

    const threadData: UpdateThreadRequest = await readBody(event)
    const now = new Date()

    const [thread] = await prisma.$transaction([
        prisma.thread.update({
            where: {
                id: threadId
            },
            data: {
                updatedAt: now,
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
    return result;
})