import { prisma } from '../../prisma/db'

export default defineEventHandler(async () => {
    const threads = await prisma.thread.findMany({
        include: {
            versions: true
        }
    })
    const result = threads.map(thread => {
        const [latest] = thread.versions.slice(-1)
        const latestThreadData: any = latest.data
        console.log('', latestThreadData)
        return {
            id: thread.id,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            published: thread.published,
            nbMessages: latestThreadData.messages.length
        }
    })
    console.log(result)
    return result;
})
