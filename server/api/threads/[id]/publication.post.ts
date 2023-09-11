export default defineEventHandler(async (event: any) => {
    const threadId = parseInt(getRouterParam(event, 'id') || '')

    console.log(`POST /api/threads/${threadId}/publication`)

    return 'ok'
})