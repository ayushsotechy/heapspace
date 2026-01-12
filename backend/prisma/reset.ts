import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon"; // Keep using your adapter if needed

// Neon adapter setup (same as your seed.ts)
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🗑️  Cleaning up database...");

  // 1. Delete data in the correct order (Child -> Parent)
  //    Delete TestCases and Submissions first to avoid foreign key errors
  await prisma.testCase.deleteMany();
  await prisma.submission.deleteMany();
  
  //    Now delete the Problems
  await prisma.problem.deleteMany();
  console.log("✅ All problems deleted.");

  // 2. RESET THE ID COUNTER (The Magic Step)
  //    This SQL command forces the 'Problem' table's ID to start at 1 again.
  try {
    // Note: The sequence name is usually "Problem_id_seq" (ModelName_field_seq)
    // If your table is named "problems" in the DB, it might be "problems_id_seq"
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Problem_id_seq" RESTART WITH 1;');
    console.log("✅ ID Sequence reset to 1.");
  } catch (e) {
    console.warn("⚠️  Could not reset sequence (might be different name). Trying plural...");
    try {
        await prisma.$executeRawUnsafe('ALTER SEQUENCE "problems_id_seq" RESTART WITH 1;');
        console.log("✅ ID Sequence reset to 1 (plural).");
    } catch (err) {
        console.error("❌ Failed to reset sequence. Check your table name in Postgres.");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });