import { prisma } from '../../../prisma/db'

export default defineEventHandler(async (event: any) => {
    const threadId = parseInt(event.context.params.id) as number

    console.log(`GET /api/threads/${threadId}`)

    const thread = await prisma.thread.findFirst({
        where: {
            id: threadId
        },
        include: {
            versions: true
        }
    })
    const result: any = { ...thread }
    if (thread && thread.versions) {
        const [latest] = thread.versions.slice(-1)
        result.latest = latest
    }
    return result;
})