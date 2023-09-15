import { queue } from '~/utils/queue'
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

    const jobName = `thread-${threadId}`
    const jobs = await queue.getDelayed()
    const threadScheduleJob = jobs.find((job) => job.name === jobName)
    if (threadScheduleJob && threadScheduleJob.id) {
        await queue.remove(threadScheduleJob.id)
    }

    return
})