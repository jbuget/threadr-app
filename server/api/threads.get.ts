import { prisma } from '../../prisma/db'

export default defineEventHandler(async () => {
    console.log(`GET /api/threads`)

    const threads = await prisma.thread.findMany({
        orderBy: [{
            updatedAt: 'desc'
        }, {
            createdAt: 'desc'
        }],
        include: {
            versions: true
        }
    })
    const result = threads.map(thread => {
        const [latest] = thread.versions.slice(-1)
        const latestThreadData: any = latest.data
        return {
            id: thread.id,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            scheduledAt: thread.scheduledAt,
            publishedAt: thread.publishedAt,
            nbMessages: latestThreadData.messages.length
        }
    })
    return result;
})
