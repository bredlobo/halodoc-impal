/**
 * One-time script: update consultationFee for all doctor profiles.
 *
 * - Dokter Umum   : random between 35_000 – 50_000  (step 5_000)
 * - Specialist    : random between 75_000 – 350_000 (step 25_000)
 *
 * Run with:
 *   npx tsx prisma/update-fees.ts
 */

import prisma from "../src/helpers/db/prisma/client";

function randomStep(min: number, max: number, step: number): number {
  const steps = Math.floor((max - min) / step) + 1;
  return min + Math.floor(Math.random() * steps) * step;
}

async function main() {
  const profiles = await prisma.doctorProfile.findMany({
    include: {
      specialization: { select: { name: true } },
    },
  });

  console.log(`Found ${profiles.length} doctor profile(s). Updating fees...\n`);

  for (const profile of profiles) {
    const isGeneral = profile.specialization.name === "Dokter Umum";

    const fee = isGeneral
      ? randomStep(35_000, 50_000, 5_000)   // e.g. 35000 / 40000 / 45000 / 50000
      : randomStep(75_000, 350_000, 25_000); // e.g. 75000 / 100000 / … / 350000

    await prisma.doctorProfile.update({
      where: { id: profile.id },
      data: { consultationFee: fee },
    });

    console.log(
      `  [${profile.specialization.name}] userId=${profile.userId} → fee = Rp ${fee.toLocaleString("id-ID")}`,
    );
  }

  console.log("\nDone! All consultation fees updated.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
