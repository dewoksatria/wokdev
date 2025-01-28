// prisma/seed.js
/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const PASS_SEED = process.env.PASS_SEED

const prisma = new PrismaClient()

const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF'
}

const BIO = `Hi, I'm a Software Engineer and an IoT Enthusiast passionate about building innovative solutions that bridge the gap between the digital and physical worlds. With a strong foundation in software development and a keen interest in Internet of Things (IoT) technologies, I enjoy crafting efficient, scalable, and user-friendly systems. My expertise includes: Developing software solutions for complex problems. Designing and implementing IoT systems for smart environments. Leveraging modern frameworks and tools to create seamless integrations between devices, data, and applications. Whether it's writing clean code, optimizing performance, or exploring the latest in IoT advancements, I thrive on challenges that push the boundaries of technology. Feel free to explore my portfolio and see how I'm making an impact in the world of software and IoT. Let's create something amazing together!`

async function main() {
    const hashedPassword = await bcrypt.hash(PASS_SEED, 10)

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
                    headline: 'Software Engineer | IoT & AI Enthusiast',
                    location: 'Bali, Indonesia',
                    website: 'https://dewaketus.com',
                    avatar: '/images/profile/avatar.jpg'
                }
            }
        },
        include: {
            profile: true
        }
    })

    // Add experiences
    const experiences = [
        {
            title: 'Senior Software Engineer',
            company: 'Tech Innovations Inc.',
            location: 'Bali, Indonesia',
            startDate: new Date('2022-01-01'),
            current: true,
            description: 'Leading development of IoT-based smart city solutions. Managing a team of 5 developers. Implementing microservices architecture using Node.js and Python.',
            userId: user.id
        },
        {
            title: 'Full Stack Developer',
            company: 'Digital Solutions Ltd',
            location: 'Jakarta, Indonesia',
            startDate: new Date('2019-06-01'),
            endDate: new Date('2021-12-31'),
            description: 'Developed and maintained enterprise web applications. Implemented RESTful APIs and real-time features using WebSocket.',
            userId: user.id
        },
        {
            title: 'IoT Developer',
            company: 'Smart Systems Co',
            location: 'Surabaya, Indonesia',
            startDate: new Date('2017-03-01'),
            endDate: new Date('2019-05-31'),
            description: 'Designed and implemented IoT solutions for industrial automation. Created embedded systems using Arduino and Raspberry Pi.',
            userId: user.id
        }
    ]

    // Use Promise.all with individual create operations instead of createMany
    await Promise.all(
        experiences.map(experience =>
            prisma.experience.create({
                data: experience
            })
        )
    )

    // Add projects
    const projects = [
        {
            title: 'Smart City Monitoring System',
            description: 'Developed a comprehensive IoT-based system for monitoring city infrastructure, including traffic flow, air quality, and energy usage. Implemented real-time data visualization and predictive maintenance features.',
            image: '/images/projects/smart-city.png',
            link: 'https://smartcity-demo.com',
            githubUrl: 'https://github.com/koropati/smart-city',
            startDate: new Date('2023-01-01'),
            technologies: JSON.stringify(['Node.js', 'React', 'Python', 'TensorFlow', 'MQTT', 'LoRaWAN']),
            userId: user.id
        },
        {
            title: 'AI-Powered Agriculture System',
            description: 'Created an intelligent farming system using IoT sensors and AI for optimal crop management. Features included automated irrigation, pest detection, and yield prediction.',
            image: '/images/projects/smart-agriculture.png',
            link: 'https://agri-smart.com',
            githubUrl: 'https://github.com/koropati/agri-smart',
            startDate: new Date('2022-06-01'),
            endDate: new Date('2022-12-31'),
            technologies: JSON.stringify(['Python', 'TensorFlow', 'Arduino', 'React Native', 'AWS IoT']),
            userId: user.id
        }
    ]

    await Promise.all(
        projects.map(project =>
            prisma.project.create({
                data: project
            })
        )
    )

    // Add skills
    const skills = [
        // Programming Languages
        { name: 'JavaScript', level: 5, category: 'Programming Languages', userId: user.id },
        { name: 'Python', level: 5, category: 'Programming Languages', userId: user.id },
        { name: 'Java', level: 4, category: 'Programming Languages', userId: user.id },
        { name: 'C++', level: 4, category: 'Programming Languages', userId: user.id },
        
        // Frontend
        { name: 'React', level: 5, category: 'Frontend', userId: user.id },
        { name: 'Next.js', level: 5, category: 'Frontend', userId: user.id },
        { name: 'Vue.js', level: 4, category: 'Frontend', userId: user.id },
        { name: 'CSS/SCSS', level: 4, category: 'Frontend', userId: user.id },
        
        // Backend
        { name: 'Node.js', level: 5, category: 'Backend', userId: user.id },
        { name: 'Express.js', level: 5, category: 'Backend', userId: user.id },
        { name: 'Django', level: 4, category: 'Backend', userId: user.id },
        { name: 'PostgreSQL', level: 4, category: 'Backend', userId: user.id },
        
        // IoT & Hardware
        { name: 'Arduino', level: 5, category: 'IoT', userId: user.id },
        { name: 'Raspberry Pi', level: 5, category: 'IoT', userId: user.id },
        { name: 'MQTT', level: 4, category: 'IoT', userId: user.id },
        { name: 'LoRaWAN', level: 4, category: 'IoT', userId: user.id }
    ]

    await Promise.all(
        skills.map(skill =>
            prisma.skill.create({
                data: skill
            })
        )
    )

    // Add social media links
    const socials = [
        {
            platform: 'GitHub',
            url: 'https://github.com/koropati',
            userId: user.id
        },
        {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/dewaketut',
            userId: user.id
        },
        {
            platform: 'Twitter',
            url: 'https://twitter.com/dewaketus',
            userId: user.id
        }
    ]

    await Promise.all(
        socials.map(social =>
            prisma.social.create({
                data: social
            })
        )
    )

    // Add articles
    const articles = [
        {
            title: 'Building Scalable IoT Systems with Node.js',
            slug: 'building-scalable-iot-systems-with-nodejs',
            content: `# Building Scalable IoT Systems with Node.js

In this article, we'll explore how to build scalable IoT systems using Node.js. We'll cover:

## Architecture Overview
The key to building scalable IoT systems lies in choosing the right architecture...

## Key Components
1. Message Broker (MQTT)
2. Data Processing Pipeline
3. Real-time Analytics
4. Storage Solutions

## Best Practices
When building IoT systems, consider these best practices...

## Conclusion
Node.js proves to be an excellent choice for IoT systems due to its event-driven nature...`,
            excerpt: 'Learn how to leverage Node.js to build scalable IoT systems that can handle thousands of connected devices.',
            coverImage: '/images/articles/iot-nodejs.png',
            published: true,
            publishedAt: new Date('2024-01-15'),
            userId: user.id
        },
        {
            title: 'Implementing AI in IoT: A Practical Guide',
            slug: 'implementing-ai-in-iot-practical-guide',
            content: `# Implementing AI in IoT: A Practical Guide

This guide will walk you through the process of implementing AI in IoT systems...

## Why AI in IoT?
The combination of AI and IoT creates powerful possibilities...

## Implementation Steps
1. Data Collection
2. Model Selection
3. Training Pipeline
4. Deployment Strategy

## Case Studies
Let's look at some real-world applications...

## Conclusion
AI and IoT together create unprecedented opportunities...`,
            excerpt: 'A comprehensive guide on implementing artificial intelligence in IoT systems, with practical examples and best practices.',
            coverImage: '/images/articles/ai-iot.png',
            published: true,
            publishedAt: new Date('2024-01-01'),
            userId: user.id
        }
    ]

    await Promise.all(
        articles.map(article =>
            prisma.article.create({
                data: article
            })
        )
    )

    console.log('🌱 Seed completed!')
    console.log('👤 User created:', user.email)
    console.log('📝 Profile created:', user.profile ? 'Yes' : 'No')
    console.log('💼 Experiences added:', experiences.length)
    console.log('🚀 Projects added:', projects.length)
    console.log('🔧 Skills added:', skills.length)
    console.log('🔗 Social links added:', socials.length)
    console.log('📚 Articles added:', articles.length)
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