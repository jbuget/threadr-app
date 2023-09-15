import { Thread } from '~/models/models'
import { Worker } from 'bullmq'
import { publish } from '~/services/publication-service'
import { connection, queue } from '~/utils/queue'
import { prisma } from '~/prisma/db'

export default defineEventHandler(async (event: any) => {
    const threadId = parseInt(event.context.params.id) as number
    const data: any = await readBody(event)

    console.log(`POST /api/threads/${threadId}/schedule`)

console.log("data:", data)

    console.log('data.scheduledAt', data.scheduledAt)
    const scheduledAt = Date.parse(data.scheduledAt)
    const delay = scheduledAt - Date.now()

    const threadData = await prisma.thread.findFirst({ where: { id: threadId } })
    if (!threadData) {
        throw new Error(`Could not publish thread with ID ${threadId} because it does not exist.`)
    }
    await prisma.thread.update({
        where: { id: threadId },
        data: { scheduledAt: data.scheduledAt }
    })

    await queue.add(`thread-${threadId}`, { threadId: threadId }, { delay });

    const worker = new Worker('thread-schedules', async (job) => {
        try {
            const thread: Thread = await publish(threadId)
            return thread
        } catch (error) {
            return {
                status: 'error',
                data: error
            }
        }
    }, { connection })
    worker.on('completed', job => {
        console.log(`Job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job?.id} has failed with ${err.message}`);
    });
})