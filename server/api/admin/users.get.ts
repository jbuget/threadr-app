import { prisma } from '../../../prisma/db'

export default defineEventHandler(async () => {
    console.log(`GET /api/admin/users`)

    const users = await prisma.user.findMany({
        orderBy: [{
            name: 'asc'
        }],
    })

    const result = users.map(user => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image
        }
    })
        
    return result;
})
