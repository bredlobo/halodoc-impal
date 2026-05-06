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

const categories = [
  {
    name: "Obat Bebas",
    description: "Obat-obatan yang dapat dibeli tanpa resep dokter.",
  },
  {
    name: "Obat Resep",
    description: "Obat-obatan yang wajib menggunakan resep dokter.",
  },
  {
    name: "Vitamin & Suplemen",
    description:
      "Berbagai vitamin dan suplemen untuk menjaga daya tahan tubuh.",
  },
  {
    name: "Perawatan Pribadi",
    description: "Produk-produk untuk perawatan tubuh dan kulit keseharian.",
  },
  {
    name: "Alat Kesehatan",
    description: "Peralatan medis sederhana untuk penggunaan di rumah.",
  },
];

const products = [
  // --- Obat Bebas ---
  {
    name: "Paracetamol 500mg",
    categoryName: "Obat Bebas",
    description: "Obat pereda demam dan nyeri ringan hingga sedang.",
    price: 15000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Paracetamol",
  },
  {
    name: "Minyak Angin Eucalyptus",
    categoryName: "Obat Bebas",
    description:
      "Minyak angin dengan wangi eucalyptus untuk meredakan masuk angin.",
    price: 22000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Minyak+Angin",
  },
  {
    name: "Ibuprofen 400mg",
    categoryName: "Obat Bebas",
    description: "Obat untuk mengurangi rasa sakit dan peradangan ringan.",
    price: 18000,
    stock: 100,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Ibuprofen",
  },
  {
    name: "Obat Batuk Sirup Dewasa 100ml",
    categoryName: "Obat Bebas",
    description: "Sirup pereda batuk berdahak.",
    price: 26000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Obat+Batuk",
  },
  {
    name: "Antasida Tablet",
    categoryName: "Obat Bebas",
    description:
      "Meredakan gejala sakit maag, asam lambung, dan perut kembung.",
    price: 9000,
    stock: 200,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Antasida",
  },
  {
    name: "Obat Diare Tablet",
    categoryName: "Obat Bebas",
    description: "Bantu meredakan buang air besar berlebih.",
    price: 8000,
    stock: 250,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Obat+Diare",
  },
  {
    name: "Tetes Mata Kering 15ml",
    categoryName: "Obat Bebas",
    description:
      "Cairan pelumas untuk mengatasi mata kering dan iritasi ringan.",
    price: 19000,
    stock: 75,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Tetes+Mata",
  },
  {
    name: "Balsem Otot 20g",
    categoryName: "Obat Bebas",
    description: "Salep hangat pereda nyeri otot dan pegal linu.",
    price: 16000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Balsem",
  },
  {
    name: "Plester Luka Transparan (Isi 10)",
    categoryName: "Obat Bebas",
    description: "Plester pertolongan pertama kedap air.",
    price: 11000,
    stock: 300,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Plester",
  },
  {
    name: "Obat Flu dan Batuk Pil",
    categoryName: "Obat Bebas",
    description: "Kombinasi pereda flu, hidung tersumbat, dan demam.",
    price: 12000,
    stock: 210,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Obat+Flu",
  },
  {
    name: "Salep Kulit Gatal 10g",
    categoryName: "Obat Bebas",
    description:
      "Membantu meredakan gatal akibat gigitan serangga dan alergi ringan.",
    price: 24000,
    stock: 85,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Salep+Gatal",
  },
  {
    name: "Madu Herbal Masuk Angin 15m (Sachet)",
    categoryName: "Obat Bebas",
    description: "Ramuan herbal sirup sachet untuk melegakan tenggorokan.",
    price: 4500,
    stock: 500,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Madu+Herbal",
  },

  // --- Obat Resep ---
  {
    name: "Amoxicillin 500mg",
    categoryName: "Obat Resep",
    description:
      "Antibiotik golongan penisilin untuk mengobati berbagai infeksi bakteri.",
    price: 35000,
    stock: 50,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Amoxicillin",
  },
  {
    name: "Cefadroxil 500mg",
    categoryName: "Obat Resep",
    description: "Antibiotik spektrum luas untuk infeksi bakteri.",
    price: 42000,
    stock: 45,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Cefadroxil",
  },
  {
    name: "Amlodipine 5mg",
    categoryName: "Obat Resep",
    description: "Obat pengendali tekanan darah tinggi (hipertensi).",
    price: 15000,
    stock: 100,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Amlodipine",
  },
  {
    name: "Metformin 500mg",
    categoryName: "Obat Resep",
    description: "Obat pengontrol gula darah pada pasien diabetes tipe 2.",
    price: 12000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Metformin",
  },
  {
    name: "Captopril 25mg",
    categoryName: "Obat Resep",
    description:
      "Digunakan untuk terapi penurun tekanan darah tinggi dan gagal jantung.",
    price: 13500,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Captopril",
  },
  {
    name: "Salbutamol 2mg",
    categoryName: "Obat Resep",
    description: "Pereda bronkospasme pada asma.",
    price: 8500,
    stock: 110,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Salbutamol",
  },
  {
    name: "Simvastatin 10mg",
    categoryName: "Obat Resep",
    description: "Obat untuk menurunkan kadar kolesterol.",
    price: 13000,
    stock: 75,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Simvastatin",
  },
  {
    name: "Allopurinol 100mg",
    categoryName: "Obat Resep",
    description: "Obat untuk menurunkan kadar asam urat.",
    price: 14000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Allopurinol",
  },
  {
    name: "Cetirizine 10mg",
    categoryName: "Obat Resep",
    description: "Antihistamin pereda alergi kuat.",
    price: 18000,
    stock: 85,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Cetirizine",
  },
  {
    name: "Dexamethasone 0.5mg",
    categoryName: "Obat Resep",
    description: "Obat golongan kortikosteroid antiperadangan.",
    price: 7000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Dexamethasone",
  },
  {
    name: "Meloxicam 15mg",
    categoryName: "Obat Resep",
    description: "Obat antiinflamasi nonsteroid pereda nyeri sendi berat.",
    price: 25000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Meloxicam",
  },
  {
    name: "Omeprazole 20mg",
    categoryName: "Obat Resep",
    description:
      "Inhibitor pompa proton untuk menekan produksi asam lambung kuat.",
    price: 19000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Omeprazole",
  },

  // --- Vitamin & Suplemen ---
  {
    name: "Vitamin C 1000mg",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen untuk membantu menjaga sistem imun tubuh.",
    price: 45000,
    stock: 200,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+C",
  },
  {
    name: "Multivitamin Anak Sirup Rasa Jeruk",
    categoryName: "Vitamin & Suplemen",
    description: "Sirup vitamin anak untuk tumbuh kembang optimal.",
    price: 30000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vit+Anak",
  },
  {
    name: "Vitamin B Complex",
    categoryName: "Vitamin & Suplemen",
    description: "Kumpulan vitamin B untuk memelihara saraf dan energi.",
    price: 25000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+B",
  },
  {
    name: "Vitamin D3 1000 IU",
    categoryName: "Vitamin & Suplemen",
    description: "Baik untuk menjaga kesehatan tulang gigi dan sistem imun.",
    price: 55000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+D3",
  },
  {
    name: "Zinc 50mg Tablet",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen pelengkap daya tahan tubuh harian.",
    price: 35000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Zinc",
  },
  {
    name: "Suplemen Madu Herbal 250ml",
    categoryName: "Vitamin & Suplemen",
    description: "Madu murni dicampur ekstrak herbal penambah stamina.",
    price: 65000,
    stock: 45,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Madu+Herbal",
  },
  {
    name: "Kalsium + Vitamin D Tablet",
    categoryName: "Vitamin & Suplemen",
    description:
      "Formula padat untuk kebaikan tulang, dihindari dari pengeroposan.",
    price: 50000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Kalsium",
  },
  {
    name: "Fish Oil Omega 3 1000mg",
    categoryName: "Vitamin & Suplemen",
    description: "Minyak ikan kaya akan EPA dan DHA.",
    price: 110000,
    stock: 50,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Fish+Oil",
  },
  {
    name: "Suplemen Zat Besi (Iron)",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen tambah darah untuk penderita anemia.",
    price: 40000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Zat+Besi",
  },
  {
    name: "Tablet Effervescent Vitamin C Pomegranate",
    categoryName: "Vitamin & Suplemen",
    description: "Vitamin C larut dalam air yang menyegarkan.",
    price: 35000,
    stock: 130,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Effervescent",
  },
  {
    name: "Vitamin E 400 IU",
    categoryName: "Vitamin & Suplemen",
    description:
      "Bagus untuk menjaga kesehatan dan kelembaban kulit dari dalam.",
    price: 80000,
    stock: 75,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+E",
  },
  {
    name: "Suplemen Sendi Glucosamine",
    categoryName: "Vitamin & Suplemen",
    description: "Membantu melumasi pergerakan sendi, terutama lutut.",
    price: 145000,
    stock: 30,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Glucosamine",
  },

  // --- Perawatan Pribadi ---
  {
    name: "Sabun Cuci Muka Anti Jerawat",
    categoryName: "Perawatan Pribadi",
    description: "Sabun wajah dengan salicylic acid untuk kulit berjerawat.",
    price: 25000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sabun+Jerawat",
  },
  {
    name: "Shampo Anti Ketombe 200ml",
    categoryName: "Perawatan Pribadi",
    description:
      "Shampo untuk atasi masalah kulit kepala berminyak dan berketombe.",
    price: 28000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Shampo",
  },
  {
    name: "Sabun Mandi Cair Antibakteri 400ml",
    categoryName: "Perawatan Pribadi",
    description: "Membunuh bakteri tak kasat mata sehabis aktivitas luar.",
    price: 35000,
    stock: 110,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sabun+Cair",
  },
  {
    name: "Pasta Gigi Sensitif 100g",
    categoryName: "Perawatan Pribadi",
    description: "Diformulasi khusus menutupi gigi dan mencegah rasa linu.",
    price: 23000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Pasta+Gigi",
  },
  {
    name: "Sikat Gigi Halus (Isi 2)",
    categoryName: "Perawatan Pribadi",
    description: "Bulu sikat super halus dan tidak melukai gusi.",
    price: 15000,
    stock: 200,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sikat+Gigi",
  },
  {
    name: "Obat Kumur Antiseptik 250ml",
    categoryName: "Perawatan Pribadi",
    description: "Mencegah karies gigi dan mengurangi bau mulut.",
    price: 22000,
    stock: 100,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Obat+Kumur",
  },
  {
    name: "Deodoran Roll-on 50ml",
    categoryName: "Perawatan Pribadi",
    description: "Perlindungan anti-keringat dan bau ketiak 48 jam.",
    price: 20000,
    stock: 130,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Deodoran",
  },
  {
    name: "Hand Sanitizer Gel 50ml",
    categoryName: "Perawatan Pribadi",
    description:
      "Pembersih tangan non-bilas dengan kandungan alkohol medis 70%.",
    price: 12000,
    stock: 250,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Hand+Sanitizer",
  },
  {
    name: "Pelembab Kulit Kering 100ml",
    categoryName: "Perawatan Pribadi",
    description: "Lotion ekstra kelembaban untuk kulit sangat kering.",
    price: 45000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Pelembab",
  },
  {
    name: "Sunscreen Wajah SPF 50",
    categoryName: "Perawatan Pribadi",
    description: "Tabir surya harian menjaga wajah dari sinar UV-A & UV-B.",
    price: 55000,
    stock: 45,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sunscreen",
  },
  {
    name: "Tisu Basah Antibakteri (Isi 50 Lembar)",
    categoryName: "Perawatan Pribadi",
    description:
      "Tisu tebal higienis yang aman untuk menyeka tangan dan badan.",
    price: 15000,
    stock: 180,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Tisu+Basah",
  },
  {
    name: "Bedak Tabur Anti Gatal 90g",
    categoryName: "Perawatan Pribadi",
    description: "Bedak salicyl dingin pereda kulit alergi biang keringat.",
    price: 14000,
    stock: 110,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Bedak+Gatal",
  },

  // --- Alat Kesehatan ---
  {
    name: "Termometer Digital",
    categoryName: "Alat Kesehatan",
    description: "Termometer digital akurat untuk mengukur suhu tubuh.",
    price: 65000,
    stock: 30,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Termometer",
  },
  {
    name: "Masker Medis 3 Ply (Satu Box Isi 50)",
    categoryName: "Alat Kesehatan",
    description:
      "Masker bedah berkualitas filtrasi tinggi untuk perlindungan harian.",
    price: 35000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Masker",
  },
  {
    name: "Tensimeter Digital Lengan Atas",
    categoryName: "Alat Kesehatan",
    description: "Alat pengukur tekanan darah digital cerdas dan akurat.",
    price: 350000,
    stock: 15,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Tensimeter",
  },
  {
    name: "Oximeter Pulse Jari",
    categoryName: "Alat Kesehatan",
    description: "Mengukur SpO2 dan pulse rate dengan cepat.",
    price: 85000,
    stock: 40,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Oximeter",
  },
  {
    name: "Strip Cek Gula Darah (Isi 50)",
    categoryName: "Alat Kesehatan",
    description: "Isi ulang kertas reagen pengukur gula.",
    price: 110000,
    stock: 55,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Strip+Gula",
  },
  {
    name: "Alat Cek Gula Darah, Asam Urat, Kolesterol",
    categoryName: "Alat Kesehatan",
    description: "Set alat instrumen ukur 3 in 1 digital.",
    price: 275000,
    stock: 20,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Alat+3in1",
  },
  {
    name: "Kotak P3K Dinding Lengkap",
    categoryName: "Alat Kesehatan",
    description:
      "Kit lengkap pertolongan darurat medis isi obat luka dan perban.",
    price: 120000,
    stock: 35,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Kotak+P3K",
  },
  {
    name: "Kapas Medis Pembalut 500g",
    categoryName: "Alat Kesehatan",
    description: "Gulungan kapas steril higienis daya serap tinggi.",
    price: 35000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Kapas+Medis",
  },
  {
    name: "Kasa Hidrofil Steril (1 Box)",
    categoryName: "Alat Kesehatan",
    description: "Pembalut steril luka dan pasca operasi.",
    price: 15000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Kasa+Steril",
  },
  {
    name: "Perban Gulung Melar",
    categoryName: "Alat Kesehatan",
    description: "Perban elastis fiksasi luka sendi ukuran 10cm.",
    price: 18000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Perban",
  },
  {
    name: "Plester Gulung Kertas Tape",
    categoryName: "Alat Kesehatan",
    description: "Gulungan micropore perekat kasa bedah anti alergi.",
    price: 25000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Micropore",
  },
  {
    name: "Sarung Tangan Medis Latex (Isi 100)",
    categoryName: "Alat Kesehatan",
    description: "Gloves exam tidak mengandum bedak/bubuk safety murni.",
    price: 65000,
    stock: 75,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Gloves",
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

  console.log(`Menyiapkan data seeding untuk Pharmacy (Categories)...`);
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    console.log(`Berhasil menambahkan kategori apotek: ${created.name}`);
  }

  console.log(`Menyiapkan data seeding untuk Pharmacy (Products)...`);
  for (const prod of products) {
    // Cari ID kategori dari database agar relasi valid
    const categoryRecord = await prisma.category.findUnique({
      where: { name: prod.categoryName },
    });

    if (categoryRecord) {
      // Kita pakai nama obat sebagai kuncian saat melakukan update/create dummy.
      // Namun karena tabel Product tidak ada unique(name), cari dulu
      const existingProduct = await prisma.product.findFirst({
        where: { name: prod.name },
      });

      if (existingProduct) {
        console.log(`Produk sudah ada, dilewati: ${prod.name}`);
      } else {
        await prisma.product.create({
          data: {
            name: prod.name,
            categoryId: categoryRecord.id,
            description: prod.description,
            price: prod.price,
            stock: prod.stock,
            imageUrl: prod.imageUrl,
          },
        });
        console.log(`Berhasil menambahkan obat/produk: ${prod.name}`);
      }
    }
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
