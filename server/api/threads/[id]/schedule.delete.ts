import { Thread } from '~/models/models'
import { Worker } from 'bullmq'
import { publish } from '~/services/publication-service'
import { connection, queue } from '~/utils/queue'
import { prisma } from '~/prisma/db'

export default defineEventHandler(async (event: any) => {
    const threadId = parseInt(event.context.params.id) as number

    console.log(`DELETE /api/threads/${threadId}/schedule`)

    const threadData = await prisma.thread.findFirst({ where: { id: threadId } })
    if (!threadData) {
        throw new Error(`Could not publish thread with ID ${threadId} because it does not exist.`)
    }
    await prisma.thread.update({
        where: { id: threadId },
        data: { scheduledAt: null }
    })

    // TODO : find and remove job

    return 'ok'
})