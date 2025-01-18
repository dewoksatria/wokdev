// prisma/seed.js
const {
    PrismaClient
} = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF'
}

async function main() {
    const hashedPassword = await bcrypt.hash('ckzkUUrhf7s6b7g', 10)

    // Create super admin
    await prisma.user.upsert({
        where: {
            email: 'dewa.ketut.satriawan@gmail.com'
        },
        update: {},
        create: {
            email: 'dewa.ketut.satriawan@gmail.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: ROLES.SUPER_ADMIN
        },
    })

    console.log('🌱 Seed completed!')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        console.log('↔️ Disconnecting from database...')
        await prisma.$disconnect()
    })