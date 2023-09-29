import { prisma } from '../../prisma/db'

export default defineEventHandler(async () => {
    console.log(`GET /api/settings`)

    const settings = { foo: 'bar' };

    return settings
})
