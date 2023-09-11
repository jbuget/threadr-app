export default defineEventHandler(async (event: any) => {
    const threadId = parseInt(getRouterParam(event, 'id') || '')

    console.log(`DELETE /api/threads/${threadId}`)

    return 'ok'
})