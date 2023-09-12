import { publish } from '~/services/publication-service';
import { Thread } from '~/models/models';
import { prisma } from '~/prisma/db';

export default defineEventHandler(async (event: any) => {
    const threadId = parseInt(event.context.params.id) as number

    console.log(`POST /api/threads/${threadId}/publication`)

    try {
        const thread: Thread = await publish(threadId)
        return thread
    } catch (error) {
        return {
            status: 'error',
            data: error
        }
    }
})