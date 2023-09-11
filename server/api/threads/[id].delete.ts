import { prisma } from '../../../prisma/db'

export default defineEventHandler(async (event: any) => {
    const threadId = parseInt(event.context.params.id) as number
    
    console.log(`DELETE /api/threads/${threadId}`)

    await prisma.thread.delete({
        where: {
            id: threadId,
        },
    })

    return {}
})