export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    console.log('Thread published 🎉')
    return { body }
})