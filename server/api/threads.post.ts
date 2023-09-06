export default defineEventHandler(async (event: any) => {
    let body;
    body = await readBody(event)
    console.log(body)
    const thread = JSON.parse(body)
    return { body }
})