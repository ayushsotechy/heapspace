import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { problems } from "./data/problems"; // Keep your path

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Neon adapter
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Database Seed...");

  // 1. Ensure admin exists
  const admin = await prisma.admin.upsert({
    where: { email: "admin@local.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@local.com",
      password: "admin123",
    },
  });

  console.log(`👤 Admin ensured: ${admin.username}`);

  // 2. Loop through problems
  for (const p of problems) {
    // Check if problem already exists
    const existingProblem = await prisma.problem.findUnique({
      where: { slug: p.slug },
    });

    if (existingProblem) {
      // === UPDATE PATH ===
      console.log(`🔄 Updating: ${p.title}`);

      // A. Update the Problem details
      await prisma.problem.update({
        where: { slug: p.slug },
        data: {
          title: p.title,
          description: p.description,
          difficulty: p.difficulty,
          constraints: p.constraints,
          adminId: admin.id,
        },
      });

      // B. WIPE old test cases (The dirty "x=121" ones)
      await prisma.testCase.deleteMany({
        where: { problemId: existingProblem.id },
      });

      // C. CREATE new test cases (The clean "121" ones)
      // We map over them to attach the problemId explicitly
      await prisma.testCase.createMany({
        data: p.testCases.map((tc) => ({
          input: tc.input,
          output: tc.output,
          problemId: existingProblem.id,
        })),
      });

    } else {
      // === CREATE PATH ===
      console.log(`✨ Creating: ${p.title}`);

      await prisma.problem.create({
        data: {
          title: p.title,
          slug: p.slug,
          description: p.description,
          difficulty: p.difficulty,
          constraints: p.constraints,
          adminId: admin.id,
          testCases: {
            create: p.testCases, // Prisma handles the relation here automatically
          },
        },
      });
    }
  }

  console.log("✅ Database seeded/updated successfully");
}

// Run
main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });