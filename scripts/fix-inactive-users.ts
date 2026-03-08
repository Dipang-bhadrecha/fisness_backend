/**
 * One-time script: Set isActive = true for all users.
 * Run: npx tsx scripts/fix-inactive-users.ts
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.user.updateMany({
    where: { isActive: false },
    data: { isActive: true },
  })
  console.log(`✅ Activated ${result.count} user(s)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
