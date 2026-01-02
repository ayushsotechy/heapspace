// 1. Import from your CUSTOM output path
// Since we are in src/, we go up one level (backend), then up again (CODEFORCES), then into generated
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding Codeforces Data...")

  // 1. Create a User (Ayush)
  const user = await prisma.user.create({
    data: {
      username: 'ayushhvermaaa',
      email: 'ayushh@codeforcaes.com',
      password: 'hashed_secret_password',
      isAdmin: true
    }
  })

  // 2. Create a Problem (Two Sum) with a Test Case
  const problem = await prisma.problem.create({
    data: {
      title: 'Two Summ',
      slug: 'two-summ',
      description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
      difficulty: 'Easy',
      testCases: {
        create: {
          input: '[2,7,11,15], 9',
          output: '[0,1]'
        }
      }
    }
  })

  // 3. User submits a solution
  const submission = await prisma.submission.create({
    data: {
      language: 'cpp',
      code: '#include <iostream>...',
      userId: user.id,
      problemId: problem.id,
      status: 'Accepted'
    }
  })

  console.log('✅ Simulation Complete!')
  console.log(`User ${user.username} submitted to "${problem.title}" [Status: ${submission.status}]`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })