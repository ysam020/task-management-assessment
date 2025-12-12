import { PrismaClient, UserRole, CandidateStage } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Sample candidate data
const candidateNames = [
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
  "Bob Williams",
  "Charlie Brown",
  "Diana Martinez",
  "Edward Davis",
  "Fiona Garcia",
  "George Miller",
  "Hannah Wilson",
];

const positions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "QA Engineer",
];

const skillSets = [
  ["React", "TypeScript", "Next.js", "CSS"],
  ["Node.js", "Express", "PostgreSQL", "MongoDB"],
  ["Python", "Django", "FastAPI", "Machine Learning"],
  ["Java", "Spring Boot", "Microservices"],
  ["AWS", "Docker", "Kubernetes", "CI/CD"],
  ["React", "Node.js", "TypeScript", "GraphQL"],
  ["Vue.js", "Tailwind CSS", "JavaScript"],
  ["Go", "gRPC", "Redis", "Kafka"],
];

const stages: CandidateStage[] = [
  "SCREENING",
  "L1",
  "L2",
  "DIRECTOR",
  "HR",
  "COMPENSATION",
  "BG_CHECK",
  "OFFER",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.stageHistory.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.note.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("👤 Creating users...");
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const hrUser = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "hr@company.com",
      password: hashedPassword,
      role: UserRole.HR,
    },
  });

  const interviewer1 = await prisma.user.create({
    data: {
      name: "Mike Chen",
      email: "interviewer1@company.com",
      password: hashedPassword,
      role: UserRole.INTERVIEWER,
    },
  });

  const interviewer2 = await prisma.user.create({
    data: {
      name: "Emily Rodriguez",
      email: "interviewer2@company.com",
      password: hashedPassword,
      role: UserRole.INTERVIEWER,
    },
  });

  console.log("✅ Created 3 users:");
  console.log(`   - HR: hr@company.com (password: Password123!)`);
  console.log(
    `   - Interviewer 1: interviewer1@company.com (password: Password123!)`
  );
  console.log(
    `   - Interviewer 2: interviewer2@company.com (password: Password123!)`
  );

  // Create candidates
  console.log("👥 Creating candidates...");
  const candidates = [];

  for (let i = 0; i < 10; i++) {
    const stage = getRandomElement(stages);
    const stageEntered = getRandomDate(7);

    const candidate = await prisma.candidate.create({
      data: {
        name: candidateNames[i],
        email: `${candidateNames[i].toLowerCase().replace(" ", ".")}@email.com`,
        phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
        position: getRandomElement(positions),
        experience: Math.floor(Math.random() * 10) + 1,
        skills: getRandomElement(skillSets),
        stage,
        stageEntered,
      },
    });

    candidates.push(candidate);

    // Create initial stage history
    await prisma.stageHistory.create({
      data: {
        candidateId: candidate.id,
        toStage: "SCREENING",
        reason: "Initial application received",
        movedAt: getRandomDate(14),
      },
    });

    // If not in screening, create additional stage history
    if (stage !== "SCREENING") {
      const currentStageIndex = stages.indexOf(stage);
      for (let j = 1; j <= currentStageIndex; j++) {
        await prisma.stageHistory.create({
          data: {
            candidateId: candidate.id,
            fromStage: stages[j - 1],
            toStage: stages[j],
            reason: `Progressed to ${stages[j]}`,
            movedAt: getRandomDate(10 - j),
          },
        });
      }
    }

    // Add some feedbacks
    if (Math.random() > 0.3) {
      await prisma.feedback.create({
        data: {
          candidateId: candidate.id,
          userId: getRandomElement([interviewer1.id, interviewer2.id]),
          stage: candidate.stage,
          comment: "Strong technical skills and good communication.",
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
          createdAt: getRandomDate(5),
        },
      });
    }

    // Add some notes
    if (Math.random() > 0.4) {
      await prisma.note.create({
        data: {
          candidateId: candidate.id,
          userId: getRandomElement([
            hrUser.id,
            interviewer1.id,
            interviewer2.id,
          ]),
          content:
            "Candidate has good experience with the required tech stack.",
          createdAt: getRandomDate(5),
        },
      });
    }
  }

  console.log(`✅ Created ${candidates.length} candidates with stage history`);

  // Create some stuck candidates (in stage > 2 days)
  const stuckCandidate = await prisma.candidate.create({
    data: {
      name: "Stuck Candidate",
      email: "stuck@email.com",
      phone: "+1-555-9999",
      position: "Senior Developer",
      experience: 5,
      skills: ["React", "Node.js", "AWS"],
      stage: "L2",
      stageEntered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  await prisma.stageHistory.create({
    data: {
      candidateId: stuckCandidate.id,
      toStage: "L2",
      reason: "Moved to L2 interview",
      movedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Created stuck candidate example");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: 3 (1 HR, 2 Interviewers)`);
  console.log(`   - Candidates: ${candidates.length + 1}`);
  console.log(`   - All users password: Password123!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
