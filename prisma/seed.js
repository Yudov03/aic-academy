import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
    const duy = await prisma.user.create({
        data: {
            name: 'duy',
            email: 'duy@gmail.com',
            password:
                '$2b$10$mj8Bf7gSndRNKzTs6.q.ruKtC0AzxtAeHxaffYPwZGo4QdcJzuuJG',
        },
    })

    await Promise.all(
        getUserCourse().map((x) => {
            const data = { userId: duy.id, ...x }
            return prisma.usercourse.create({ data })
        })
    )
}

seed()

function getUserCourse() {
    return [
        {
          courseId: 8192,
          enrollment_status: 'Start Learning',
        },
        {
          courseId: 8174,
          enrollment_status: 'Continue Learning',
        },
        {
          courseId: 8127,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7715,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7713,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7712,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7711,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7710,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7709,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7706,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7705,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7703,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7702,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7701,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7700,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7699,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7698,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7697,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7670,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7667,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7649,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7637,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7629,
          enrollment_status: 'Enroll Course',
        },
        {
          courseId: 7588,
          enrollment_status: 'Enroll Course',
        },
    ]
}