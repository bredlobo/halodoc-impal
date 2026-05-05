import prisma from "../src/helpers/db/prisma/client";

const specializations = [
  {
    name: "Dokter Umum",
    description:
      "Melayani pemeriksaan kesehatan umum, diagnosis awal, dan pengobatan penyakit medis dasar.",
  },
  {
    name: "Spesialis Anak (M.Sc., Sp.A)",
    description:
      "Fokus pada perawatan fisik, emosional, dan kesehatan sosial anak-anak dari bayi hingga remaja.",
  },
  {
    name: "Spesialis Penyakit Dalam (Sp.PD)",
    description:
      "Ahli dalam diagnosis dan pencegahan penyakit pada organ tubuh bagian dalam orang dewasa.",
  },
  {
    name: "Spesialis Kandungan dan Ginekologi (Sp.OG)",
    description:
      "Menangani kesehatan reproduksi wanita, kehamilan, persalinan, dan gangguan terkait alat reproduksi.",
  },
  {
    name: "Spesialis Saraf (Sp.S)",
    description:
      "Konsultan terkait sistem saraf meliputi otak, sumsum tulang belakang, dan saraf tepi.",
  },
  {
    name: "Spesialis Jantung dan Pembuluh Darah (Sp.JP)",
    description:
      "Berfokus pada deteksi dan pengobatan penyakit kardiovaskular atau jantung.",
  },
  {
    name: "Spesialis Mata (Sp.M)",
    description:
      "Mengatasi masalah gangguan mata, dari rabun hingga penyakit mata kompleks.",
  },
  {
    name: "Spesialis Kulit dan Kelamin (Sp.KK)",
    description:
      "Mendeteksi serta mengobati masalah jaringan kulit, rambut, kuku, dan penyakit kelamin.",
  },
  {
    name: "Spesialis THT (Sp.THT-KL)",
    description:
      "Menangani masalah kesehatan yang berhubungan dengan telinga, hidung, tenggorokan, serta kepala dan leher.",
  },
  {
    name: "Spesialis Gigi (Sp.KG)",
    description:
      "Memiliki keahlian menangani penyakit, trauma, dan kelainan pada gigi, mulut, atau struktur rahang.",
  },
];

async function main() {
  console.log(`Menyiapkan data seeding untuk Specialization...`);

  for (const spec of specializations) {
    const created = await prisma.specialization.upsert({
      where: { name: spec.name },
      update: {},
      create: spec,
    });
    console.log(`Berhasil menambahkan spesialisasi: ${created.name}`);
  }

  console.log(`Seeding selesai!`);
}

main()
  .catch((e) => {
    console.error("Terjadi error saat proses seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
