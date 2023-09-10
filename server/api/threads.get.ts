import { prisma } from '../../prisma/db'

export default defineEventHandler(async () => {
    console.log(`GET /api/threads`)

    const threads = await prisma.thread.findMany({
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
            published: thread.published,
            nbMessages: latestThreadData.messages.length
        }
    })
    return result;
})
