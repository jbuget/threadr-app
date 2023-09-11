import { prisma } from '../../../../prisma/db'

export default defineEventHandler(async (event: any) => {
    const id = parseInt(event.context.params.id) as number

    console.log(`POST /api/threads/${id}/publication`)

    return 'ok'
})