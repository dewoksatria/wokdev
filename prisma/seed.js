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

const BIO = `Hi, I'm a Software Engineer and an IoT Enthusiast passionate about building innovative solutions that bridge the gap between the digital and physical worlds. With a strong foundation in software development and a keen interest in Internet of Things (IoT) technologies, I enjoy crafting efficient, scalable, and user-friendly systems. My expertise includes: Developing software solutions for complex problems. Designing and implementing IoT systems for smart environments. Leveraging modern frameworks and tools to create seamless integrations between devices, data, and applications. Whether it's writing clean code, optimizing performance, or exploring the latest in IoT advancements, I thrive on challenges that push the boundaries of technology. Feel free to explore my portfolio and see how I'm making an impact in the world of software and IoT. Let's create something amazing together!`

async function main() {
    const hashedPassword = await bcrypt.hash('ckzkUUrhf7s6b7g', 10)

    // Create super admin with profile
    const user = await prisma.user.upsert({
        where: {
            email: 'dewa.ketut.satriawan@gmail.com'
        },
        update: {},
        create: {
            email: 'dewa.ketut.satriawan@gmail.com',
            name: 'Dewa Ketut Satriawan',
            password: hashedPassword,
            role: ROLES.SUPER_ADMIN,
            profile: {
                create: {
                    bio: BIO,
                    headline: 'Software Engineer | IoT & AI Anthusiast',
                    location: 'Bali, Indonesia',
                    website: 'https://yourwebsite.com' // Update with your actual website
                }
            }
        },
        include: {
            profile: true
        }
    })

    // Optional: Add some initial social media links
    await prisma.social.createMany({
        data: [
            {
                platform: 'GitHub',
                url: 'https://github.com/koropati', // Update with your actual GitHub URL
                userId: user.id
            },
            {
                platform: 'LinkedIn',
                url: 'https://linkedin.com/in/yourusername', // Update with your actual LinkedIn URL
                userId: user.id
            },
            {
                platform: 'Twitter',
                url: 'https://twitter.com/yourusername', // Update with your actual Twitter URL
                userId: user.id
            }
        ],
        skipDuplicates: true
    })

    console.log('🌱 Seed completed!')
    console.log('👤 User created:', user.email)
    console.log('📝 Profile created:', user.profile ? 'Yes' : 'No')
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