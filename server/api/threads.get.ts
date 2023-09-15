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

        let title = `Thread #${thread.id}`
        if (latestThreadData.messages.length > 0) {
            title = latestThreadData.messages[0].text.slice(0, 80)
        }

        return {
            id: thread.id,
            title,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            scheduledAt: thread.scheduledAt,
            publishedAt: thread.publishedAt,
            nbMessages: latestThreadData.messages.length
        }
    })
    return result;
})
