import prisma from "../src/helpers/db/prisma/client";
import bcrypt from "bcrypt";

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
    description: "Paracetamol 500mg adalah obat analgesik dan antipiretik yang paling banyak digunakan untuk meredakan demam, sakit kepala, nyeri otot, serta nyeri ringan hingga sedang lainnya. Bekerja dengan cara menghambat sintesis prostaglandin di sistem saraf pusat sehingga menurunkan suhu tubuh dan persepsi rasa nyeri. Aman dikonsumsi oleh dewasa dan anak-anak sesuai dosis yang dianjurkan, tidak mengiritasi lambung.",
    price: 15000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Paracetamol",
  },
  {
    name: "Minyak Angin Eucalyptus",
    categoryName: "Obat Bebas",
    description: "Minyak angin dengan aroma eucalyptus segar yang menenangkan, diformulasikan khusus untuk meredakan gejala masuk angin seperti mual, pusing, dan perut kembung. Kandungan eucalyptus oil-nya bekerja sebagai analgesik topikal yang memberikan sensasi hangat nyaman saat dioleskan atau dihirup. Cocok dibawa bepergian dan digunakan kapan saja oleh seluruh anggota keluarga untuk kesehatan sehari-hari.",
    price: 22000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Minyak+Angin",
  },
  {
    name: "Ibuprofen 400mg",
    categoryName: "Obat Bebas",
    description: "Ibuprofen 400mg adalah obat antiinflamasi nonsteroid (NSAID) yang efektif untuk mengurangi rasa sakit, peradangan, dan demam. Umum digunakan untuk mengatasi sakit gigi, sakit kepala, nyeri haid, nyeri otot, serta nyeri sendi ringan. Bekerja dengan menghambat enzim COX yang memproduksi prostaglandin penyebab nyeri dan radang. Konsumsi bersama makanan untuk mengurangi risiko iritasi lambung.",
    price: 18000,
    stock: 100,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Ibuprofen",
  },
  {
    name: "Obat Batuk Sirup Dewasa 100ml",
    categoryName: "Obat Bebas",
    description: "Sirup obat batuk khusus dewasa yang mengandung ekspektoran untuk mengencerkan dahak serta memudahkan pengeluarannya dari saluran pernapasan. Formula cair yang mudah ditelan ini membantu meredakan iritasi tenggorokan dan batuk berdahak akibat flu, infeksi saluran napas atas, atau alergi. Dikemas dalam botol 100ml dengan tutup aman anak dan sendok takar untuk kemudahan penggunaan sehari-hari.",
    price: 26000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Obat+Batuk",
  },
  {
    name: "Antasida Tablet",
    categoryName: "Obat Bebas",
    description: "Antasida tablet mengandung kombinasi aluminium hidroksida dan magnesium hidroksida yang bekerja menetralisir asam lambung berlebih secara cepat. Efektif meredakan gejala sakit maag, rasa terbakar di dada (heartburn), mual, dan perut kembung akibat produksi asam lambung yang tinggi. Tersedia dalam bentuk tablet kunyah dengan rasa mint yang menyegarkan, mudah dikonsumsi tanpa air kapan saja diperlukan.",
    price: 9000,
    stock: 200,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Antasida",
  },
  {
    name: "Obat Diare Tablet",
    categoryName: "Obat Bebas",
    description: "Obat diare tablet mengandung attapulgit aktif yang bekerja menyerap toksin, bakteri, dan kelebihan cairan di saluran pencernaan untuk memadatkan tinja dan menghentikan buang air besar berlebih. Sangat membantu saat diare akut akibat perubahan pola makan, konsumsi makanan tidak bersih, atau infeksi ringan. Aman dan cepat bekerja, sehingga cocok digunakan sebagai pertolongan pertama saat diare menyerang.",
    price: 8000,
    stock: 250,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Obat+Diare",
  },
  {
    name: "Tetes Mata Kering 15ml",
    categoryName: "Obat Bebas",
    description: "Tetes mata kering mengandung larutan natrium klorida isotonik yang berfungsi sebagai pelumas alami pengganti air mata. Efektif mengatasi mata kering, perih, dan iritasi ringan akibat terlalu lama menatap layar, paparan angin, debu, atau penggunaan lensa kontak. Formula bebas pengawet dalam kemasan 15ml yang higienis dan mudah digunakan kapan saja untuk memberikan kelembaban instan pada permukaan bola mata.",
    price: 19000,
    stock: 75,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Tetes+Mata",
  },
  {
    name: "Balsem Otot 20g",
    categoryName: "Obat Bebas",
    description: "Balsem otot dengan formula hangat yang mengandung mentol, metil salisilat, dan camphor untuk meredakan nyeri otot, pegal linu, kaku sendi, dan nyeri punggung secara topikal. Sensasi panas yang dihasilkan meningkatkan sirkulasi darah lokal sehingga mempercepat pemulihan otot yang tegang. Kemasan 20g praktis dan mudah dioleskan langsung ke area yang terasa nyeri setelah aktivitas fisik berat.",
    price: 16000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Balsem",
  },
  {
    name: "Plester Luka Transparan (Isi 10)",
    categoryName: "Obat Bebas",
    description: "Plester luka transparan kedap air berbahan polyurethane tipis dan fleksibel yang memungkinkan kulit bernapas sekaligus melindungi luka kecil dari kotoran, bakteri, dan air. Bantalan penyerap di bagian tengah membantu menyerap eksudat luka agar tetap bersih dan kering. Isi 10 lembar per kemasan dalam berbagai ukuran, cocok untuk pertolongan pertama luka gores, lecet, dan sayatan kecil sehari-hari.",
    price: 11000,
    stock: 300,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Plester",
  },
  {
    name: "Obat Flu dan Batuk Pil",
    categoryName: "Obat Bebas",
    description: "Obat flu dan batuk dalam bentuk pil dengan formula kombinasi yang mengandung paracetamol, dekstrometorfan, dan fenilefrin untuk mengatasi gejala flu secara menyeluruh. Bekerja meredakan demam, hidung tersumbat, bersin-bersin, batuk, serta rasa tidak nyaman di tenggorokan sekaligus dalam satu tablet. Praktis dibawa ke mana-mana dan dapat dikonsumsi tanpa resep dokter sesuai dosis yang tertera pada kemasan.",
    price: 12000,
    stock: 210,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Obat+Flu",
  },
  {
    name: "Salep Kulit Gatal 10g",
    categoryName: "Obat Bebas",
    description: "Salep kulit gatal mengandung hidrokortison dan diphenhydramine yang bekerja sinergis untuk meredakan rasa gatal, kemerahan, dan pembengkakan akibat gigitan serangga, alergi kulit ringan, eksim, atau ruam kontak. Tekstur salep yang lembut mudah meresap ke dalam lapisan kulit dan memberikan efek menenangkan yang tahan lama. Aman digunakan pada area kulit yang sensitif, cukup oleskan tipis 2-3 kali sehari.",
    price: 24000,
    stock: 85,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Salep+Gatal",
  },
  {
    name: "Madu Herbal Masuk Angin 15m (Sachet)",
    categoryName: "Obat Bebas",
    description: "Ramuan madu herbal alami dalam kemasan sachet praktis 15ml yang diformulasikan dari perpaduan madu murni, jahe, temulawak, dan ekstrak rempah pilihan untuk mengatasi gejala masuk angin seperti perut kembung, mual, dan badan pegal. Membantu melegakan tenggorokan, menghangatkan tubuh dari dalam, serta meningkatkan daya tahan tubuh secara alami. Cocok dikonsumsi kapan saja tanpa perlu diseduh terlebih dahulu.",
    price: 4500,
    stock: 500,
    imageUrl: "https://dummyimage.com/300x300/a3ccf1/fff&text=Madu+Herbal",
  },

  // --- Obat Resep ---
  {
    name: "Amoxicillin 500mg",
    categoryName: "Obat Resep",
    description: "Amoxicillin 500mg adalah antibiotik golongan penisilin spektrum luas yang efektif mengobati berbagai infeksi bakteri seperti infeksi saluran pernapasan atas, infeksi telinga tengah, infeksi saluran kemih, dan infeksi kulit. Bekerja dengan cara menghambat pembentukan dinding sel bakteri sehingga menyebabkan kematian bakteri. Wajib dikonsumsi sesuai dosis dan durasi yang diresepkan dokter agar tidak terjadi resistensi antibiotik.",
    price: 35000,
    stock: 50,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Amoxicillin",
  },
  {
    name: "Cefadroxil 500mg",
    categoryName: "Obat Resep",
    description: "Cefadroxil 500mg adalah antibiotik sefalosporin generasi pertama dengan spektrum luas yang digunakan untuk mengobati infeksi bakteri pada kulit, jaringan lunak, saluran kemih, dan saluran pernapasan. Memiliki waktu paruh yang panjang sehingga cukup diminum satu hingga dua kali sehari. Penggunaannya harus sesuai resep dan petunjuk dokter untuk memastikan efektivitas terapi dan mencegah resistensi bakteri.",
    price: 42000,
    stock: 45,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Cefadroxil",
  },
  {
    name: "Amlodipine 5mg",
    categoryName: "Obat Resep",
    description: "Amlodipine 5mg adalah obat antihipertensi golongan calcium channel blocker yang bekerja dengan cara melebarkan pembuluh darah sehingga menurunkan tekanan darah dan mengurangi beban kerja jantung. Digunakan untuk mengendalikan tekanan darah tinggi (hipertensi) dan mencegah serangan angina (nyeri dada). Diminum sekali sehari dan harus digunakan secara rutin sesuai instruksi dokter meskipun tidak ada gejala.",
    price: 15000,
    stock: 100,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Amlodipine",
  },
  {
    name: "Metformin 500mg",
    categoryName: "Obat Resep",
    description: "Metformin 500mg adalah obat antidiabetik oral lini pertama yang paling direkomendasikan untuk mengelola kadar gula darah pada pasien diabetes melitus tipe 2. Bekerja dengan cara mengurangi produksi glukosa di hati, meningkatkan sensitivitas insulin, dan memperlambat penyerapan glukosa di usus. Dikonsumsi bersama makanan untuk meminimalkan efek samping gastrointestinal dan harus diminum secara teratur sesuai anjuran dokter.",
    price: 12000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Metformin",
  },
  {
    name: "Captopril 25mg",
    categoryName: "Obat Resep",
    description: "Captopril 25mg adalah obat golongan ACE inhibitor yang bekerja menghambat enzim pengubah angiotensin sehingga pembuluh darah melebar dan tekanan darah menurun. Digunakan untuk terapi hipertensi, gagal jantung kongestif, dan perlindungan ginjal pada pasien diabetes. Diminum 30 menit hingga 1 jam sebelum makan untuk penyerapan optimal. Penggunaan jangka panjang harus dalam pengawasan dokter dengan pemantauan fungsi ginjal secara berkala.",
    price: 13500,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Captopril",
  },
  {
    name: "Salbutamol 2mg",
    categoryName: "Obat Resep",
    description: "Salbutamol 2mg adalah bronkodilator agonis beta-2 kerja cepat yang digunakan untuk meredakan dan mencegah bronkospasme pada penderita asma dan penyakit paru obstruktif kronik (PPOK). Bekerja dengan cara merelaksasi otot polos saluran napas sehingga saluran udara melebar dan pernapasan menjadi lebih lancar dalam hitungan menit. Tersedia dalam bentuk tablet dan inhaler, wajib digunakan sesuai petunjuk dokter.",
    price: 8500,
    stock: 110,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Salbutamol",
  },
  {
    name: "Simvastatin 10mg",
    categoryName: "Obat Resep",
    description: "Simvastatin 10mg adalah obat penurun kolesterol golongan statin yang bekerja dengan menghambat enzim HMG-CoA reduktase dalam hati sehingga produksi kolesterol jahat (LDL) berkurang dan kolesterol baik (HDL) meningkat. Digunakan untuk mencegah risiko penyakit jantung koroner dan stroke. Diminum pada malam hari karena produksi kolesterol di hati paling aktif saat tidur. Penggunaan jangka panjang di bawah pengawasan dokter.",
    price: 13000,
    stock: 75,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Simvastatin",
  },
  {
    name: "Allopurinol 100mg",
    categoryName: "Obat Resep",
    description: "Allopurinol 100mg adalah obat yang digunakan untuk menurunkan kadar asam urat dalam darah pada penderita gout (asam urat) kronik dan batu ginjal akibat hiperurisemia. Bekerja dengan menghambat enzim xantin oksidase yang berperan dalam pembentukan asam urat dari purin. Diminum setelah makan dan disertai banyak minum air putih. Tidak digunakan saat serangan gout akut sedang berlangsung.",
    price: 14000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Allopurinol",
  },
  {
    name: "Cetirizine 10mg",
    categoryName: "Obat Resep",
    description: "Cetirizine 10mg adalah antihistamin generasi kedua yang efektif dan selektif dalam menghambat reseptor H1 untuk meredakan reaksi alergi tanpa menyebabkan kantuk yang berlebihan. Digunakan untuk mengatasi rinitis alergi musiman, urtikaria (biduran), gatal-gatal, mata berair, dan bersin akibat alergi debu, serbuk sari, atau bulu hewan. Cukup diminum sekali sehari sehingga sangat praktis untuk penggunaan jangka pendek maupun panjang.",
    price: 18000,
    stock: 85,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Cetirizine",
  },
  {
    name: "Dexamethasone 0.5mg",
    categoryName: "Obat Resep",
    description: "Dexamethasone 0.5mg adalah obat golongan kortikosteroid sintetis dengan potensi antiinflamasi dan imunosupresan yang kuat. Digunakan untuk mengatasi berbagai kondisi peradangan seperti alergi berat, asma akut, rematik, penyakit autoimun, serta pembengkakan otak. Bekerja dengan menekan sistem imun dan mengurangi produksi zat peradangan. Penggunaan harus sesuai resep dokter dan tidak boleh dihentikan mendadak setelah penggunaan jangka panjang.",
    price: 7000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Dexamethasone",
  },
  {
    name: "Meloxicam 15mg",
    categoryName: "Obat Resep",
    description: "Meloxicam 15mg adalah obat antiinflamasi nonsteroid (NSAID) selektif COX-2 yang digunakan untuk meredakan nyeri dan peradangan pada kondisi osteoarthritis, rheumatoid arthritis, dan ankylosing spondylitis. Dibandingkan NSAID lain, meloxicam memiliki risiko iritasi lambung lebih rendah karena selektivitasnya terhadap COX-2. Diminum sekali sehari bersama makanan dan wajib diresepkan dokter untuk memantau efek samping kardiovaskular dan ginjal.",
    price: 25000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Meloxicam",
  },
  {
    name: "Omeprazole 20mg",
    categoryName: "Obat Resep",
    description: "Omeprazole 20mg adalah obat golongan penghambat pompa proton (PPI) yang sangat efektif menekan produksi asam lambung dengan cara memblokir enzim H+/K+-ATPase di sel parietal lambung. Digunakan untuk mengobati tukak lambung, tukak duodenum, penyakit refluks gastroesofageal (GERD), dan sindrom Zollinger-Ellison. Dikonsumsi 30 menit sebelum makan untuk hasil optimal. Penggunaan jangka panjang harus di bawah pengawasan dokter.",
    price: 19000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/f1a3a3/fff&text=Omeprazole",
  },

  // --- Vitamin & Suplemen ---
  {
    name: "Vitamin C 1000mg",
    categoryName: "Vitamin & Suplemen",
    description: "Vitamin C 1000mg dengan formula high-dose yang dirancang untuk memaksimalkan fungsi sistem imun tubuh, mempercepat pemulihan dari flu dan infeksi, serta berperan sebagai antioksidan kuat yang melawan radikal bebas. Membantu meningkatkan penyerapan zat besi, menjaga kesehatan kulit dengan merangsang produksi kolagen, serta melindungi sel dari kerusakan oksidatif. Tersedia dalam bentuk tablet atau kapsul yang mudah dikonsumsi setiap hari.",
    price: 45000,
    stock: 200,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+C",
  },
  {
    name: "Multivitamin Anak Sirup Rasa Jeruk",
    categoryName: "Vitamin & Suplemen",
    description: "Sirup multivitamin anak dengan rasa jeruk yang disukai si kecil, mengandung vitamin A, B kompleks, C, D, E, dan mineral penting seperti zinc dan kalsium yang dibutuhkan untuk mendukung tumbuh kembang optimal. Membantu meningkatkan nafsu makan, menjaga daya tahan tubuh dari infeksi, serta mendukung perkembangan otak dan tulang anak. Formulasi bebas alkohol dan pewarna berbahaya, aman untuk anak usia 2 tahun ke atas.",
    price: 30000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vit+Anak",
  },
  {
    name: "Vitamin B Complex",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen Vitamin B Complex yang mengandung vitamin B1 (tiamin), B2 (riboflavin), B3 (niasin), B5, B6, B7 (biotin), B9 (asam folat), dan B12 dalam satu kapsul. Berperan penting dalam metabolisme energi, memelihara fungsi sistem saraf, mendukung produksi sel darah merah, serta menjaga kesehatan kulit dan rambut. Sangat bermanfaat bagi yang aktif bekerja, mudah lelah, atau menjalani diet ketat yang berisiko kekurangan vitamin B.",
    price: 25000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+B",
  },
  {
    name: "Vitamin D3 1000 IU",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen Vitamin D3 (cholecalciferol) 1000 IU yang membantu tubuh menyerap kalsium dan fosfor secara optimal untuk menjaga kepadatan dan kekuatan tulang serta gigi. Berperan penting dalam regulasi sistem imun, fungsi otot, dan kesehatan mental. Sangat dianjurkan bagi mereka yang jarang terpapar sinar matahari, lansia, atau yang memiliki risiko osteoporosis. Dikonsumsi bersama makanan berlemak untuk penyerapan maksimal.",
    price: 55000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+D3",
  },
  {
    name: "Zinc 50mg Tablet",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen Zinc 50mg yang berperan sebagai mineral esensial dalam ratusan reaksi enzimatis di dalam tubuh. Zinc mendukung sistem kekebalan tubuh, mempercepat penyembuhan luka, menjaga kesehatan kulit dan rambut, serta mendukung fungsi reproduksi dan pertumbuhan normal. Sangat bermanfaat dikonsumsi setiap hari terutama saat tubuh dalam kondisi stres, kurang tidur, atau dalam masa pemulihan dari sakit.",
    price: 35000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Zinc",
  },
  {
    name: "Suplemen Madu Herbal 250ml",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen madu herbal premium 250ml yang mengandung campuran madu hutan murni dengan ekstrak tanaman herbal pilihan seperti jahe merah, temulawak, kayu manis, dan ginseng. Diformulasikan untuk meningkatkan stamina, mengurangi kelelahan, memperkuat sistem imun, dan menjaga vitalitas tubuh secara alami. Bebas bahan pengawet dan pewarna buatan, cocok dikonsumsi oleh seluruh keluarga sebagai suplemen kesehatan harian yang menyehatkan.",
    price: 65000,
    stock: 45,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Madu+Herbal",
  },
  {
    name: "Kalsium + Vitamin D Tablet",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen kombinasi kalsium dan vitamin D dalam satu tablet yang diformulasikan untuk mendukung kepadatan tulang dan mencegah osteoporosis sejak dini. Kalsium berperan membangun dan mempertahankan kepadatan massa tulang, sementara vitamin D membantu penyerapan kalsium secara optimal di usus. Sangat dianjurkan untuk lansia, wanita pasca menopause, dan remaja dalam masa pertumbuhan untuk menjaga kesehatan tulang jangka panjang.",
    price: 50000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Kalsium",
  },
  {
    name: "Fish Oil Omega 3 1000mg",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen minyak ikan berkualitas tinggi 1000mg yang kaya akan asam lemak omega-3 esensial, termasuk EPA (eicosapentaenoic acid) dan DHA (docosahexaenoic acid). Berperan penting dalam menjaga kesehatan jantung dan pembuluh darah, mendukung fungsi otak dan kognitif, mengurangi peradangan kronis, serta menjaga kesehatan sendi dan mata. Kapsul lembut dengan lapisan enterik untuk mencegah bau amis dan mengurangi efek samping pencernaan.",
    price: 110000,
    stock: 50,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Fish+Oil",
  },
  {
    name: "Suplemen Zat Besi (Iron)",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen zat besi (ferrous sulfate) yang diformulasikan untuk membantu mengatasi dan mencegah anemia defisiensi besi, ditandai dengan rasa lelah berlebih, pucat, dan sesak napas. Zat besi berperan esensial dalam pembentukan hemoglobin yang mengangkut oksigen ke seluruh jaringan tubuh. Dilengkapi vitamin C untuk meningkatkan penyerapan zat besi secara signifikan. Sangat dianjurkan untuk ibu hamil, remaja putri, dan penderita anemia.",
    price: 40000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Zat+Besi",
  },
  {
    name: "Tablet Effervescent Vitamin C Pomegranate",
    categoryName: "Vitamin & Suplemen",
    description: "Tablet vitamin C effervescent rasa delima (pomegranate) yang menyegarkan, mudah larut dalam air dan siap diminum sebagai minuman vitamin yang nikmat. Mengandung 1000mg vitamin C yang membantu memperkuat sistem imun, melawan radikal bebas, dan menjaga kesehatan kulit dari dalam. Formulasi effervescent memungkinkan penyerapan lebih cepat dibandingkan tablet biasa. Cocok dikonsumsi setiap pagi sebagai bagian dari rutinitas sehat harian.",
    price: 35000,
    stock: 130,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Effervescent",
  },
  {
    name: "Vitamin E 400 IU",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen Vitamin E 400 IU yang mengandung tokoferol alami sebagai antioksidan larut lemak yang kuat untuk melindungi sel-sel tubuh dari kerusakan akibat radikal bebas. Berperan penting dalam menjaga kelembaban dan elastisitas kulit dari dalam, mendukung kesehatan rambut, memperkuat sistem imun, serta menjaga kesehatan mata. Sangat bermanfaat bagi yang terpapar polusi, stres tinggi, atau memiliki masalah kulit kering dan kusam.",
    price: 80000,
    stock: 75,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Vitamin+E",
  },
  {
    name: "Suplemen Sendi Glucosamine",
    categoryName: "Vitamin & Suplemen",
    description: "Suplemen glucosamine sulfat yang diformulasikan secara khusus untuk mendukung kesehatan sendi dan tulang rawan. Glucosamine adalah senyawa alami yang membantu membangun dan memperbarui jaringan tulang rawan sendi, sekaligus mengurangi nyeri dan kekakuan sendi akibat osteoarthritis. Sering dikombinasikan dengan chondroitin dan MSM untuk hasil optimal. Sangat dianjurkan bagi lansia, atlet, atau siapa saja yang mengalami nyeri sendi kronik pada lutut, pinggul, atau punggung.",
    price: 145000,
    stock: 30,
    imageUrl: "https://dummyimage.com/300x300/ebf1a3/1a1a1a&text=Glucosamine",
  },

  // --- Perawatan Pribadi ---
  {
    name: "Sabun Cuci Muka Anti Jerawat",
    categoryName: "Perawatan Pribadi",
    description: "Sabun cuci muka yang mengandung salicylic acid 2% untuk membersihkan pori-pori secara mendalam dan membantu mengurangi jerawat, komedo, serta kelebihan minyak pada wajah. Formulanya yang lembut tidak merusak lapisan pelindung kulit sehingga tidak membuat wajah terasa kering setelah pemakaian. Diperkaya dengan ekstrak tea tree yang bersifat antibakteri alami. Cocok untuk kulit berminyak, kombinasi, dan berjerawat, digunakan dua kali sehari.",
    price: 25000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sabun+Jerawat",
  },
  {
    name: "Shampo Anti Ketombe 200ml",
    categoryName: "Perawatan Pribadi",
    description: "Shampo anti ketombe 200ml yang diformulasikan dengan zinc pyrithione dan selenium sulfide untuk mengatasi masalah kulit kepala berminyak, berketombe, dan gatal secara efektif. Bekerja dengan cara menghambat pertumbuhan jamur Malassezia penyebab ketombe sekaligus mengontrol produksi minyak berlebih pada kulit kepala. Penggunaan rutin 2-3 kali seminggu membantu menjaga kebersihan dan kesehatan kulit kepala untuk rambut yang bersih dan berkilau.",
    price: 28000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Shampo",
  },
  {
    name: "Sabun Mandi Cair Antibakteri 400ml",
    categoryName: "Perawatan Pribadi",
    description: "Sabun mandi cair antibakteri 400ml dengan kandungan triclosan dan ekstrak aloe vera yang efektif membunuh 99.9% bakteri tak kasat mata setelah aktivitas di luar ruangan. Formulanya yang kaya busa namun lembut menjaga kelembaban alami kulit, tidak menyebabkan kulit kering atau iritasi meski digunakan setiap hari. Tersedia dalam kemasan pump yang higienis dan mudah digunakan oleh seluruh anggota keluarga.",
    price: 35000,
    stock: 110,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sabun+Cair",
  },
  {
    name: "Pasta Gigi Sensitif 100g",
    categoryName: "Perawatan Pribadi",
    description: "Pasta gigi khusus untuk gigi sensitif yang diformulasikan dengan potassium nitrate dan fluoride untuk menutup tubulus dentin yang terbuka sehingga mencegah rasa ngilu dan linu saat mengonsumsi makanan atau minuman panas, dingin, dan manis. Penggunaan rutin dua kali sehari membantu memperkuat enamel gigi, mencegah karies, dan mengurangi hipersensitivitas gigi secara progresif dalam beberapa minggu pemakaian pertama.",
    price: 23000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Pasta+Gigi",
  },
  {
    name: "Sikat Gigi Halus (Isi 2)",
    categoryName: "Perawatan Pribadi",
    description: "Sikat gigi dengan bulu bristle super halus (ultra soft) yang lembut di gigi dan gusi namun tetap efektif membersihkan plak dan sisa makanan di sela-sela gigi. Kepala sikat yang ergonomis dan berukuran compact memungkinkan akses ke area gigi belakang yang sulit dijangkau. Gagang bertekstur anti-selip memberikan kenyamanan genggaman saat menyikat. Isi 2 sikat dalam satu kemasan untuk kebutuhan keluarga.",
    price: 15000,
    stock: 200,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sikat+Gigi",
  },
  {
    name: "Obat Kumur Antiseptik 250ml",
    categoryName: "Perawatan Pribadi",
    description: "Obat kumur antiseptik 250ml mengandung cetylpyridinium chloride dan fluoride yang bekerja membunuh bakteri penyebab bau mulut, plak, dan radang gusi (gingivitis). Membantu mencegah pembentukan karies gigi dengan memperkuat enamel sekaligus memberikan kesegaran napas yang tahan lama sepanjang hari. Cukup berkumur selama 30 detik setelah menyikat gigi, tidak perlu dibilas. Formulanya bebas alkohol sehingga aman untuk penggunaan harian.",
    price: 22000,
    stock: 100,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Obat+Kumur",
  },
  {
    name: "Deodoran Roll-on 50ml",
    categoryName: "Perawatan Pribadi",
    description: "Deodoran roll-on 50ml dengan teknologi perlindungan 48 jam yang mengandung aluminum zirconium untuk menghambat produksi keringat berlebih sekaligus menetralisir bakteri penyebab bau ketiak. Formula lembut bebas alkohol dan pewarna cocok untuk kulit sensitif, tidak meninggalkan noda putih pada pakaian. Aroma segar yang tahan lama memberikan kepercayaan diri sepanjang hari meski beraktivitas intensitas tinggi di luar ruangan.",
    price: 20000,
    stock: 130,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Deodoran",
  },
  {
    name: "Hand Sanitizer Gel 50ml",
    categoryName: "Perawatan Pribadi",
    description: "Hand sanitizer gel 50ml dengan kandungan alkohol 70% yang memenuhi standar WHO untuk membunuh kuman, bakteri, dan virus penyebab penyakit secara efektif tanpa perlu air dan sabun. Tekstur gel yang lembut dan cepat meresap tidak meninggalkan rasa lengket di tangan, dilengkapi moisturizer aloe vera untuk mencegah kulit tangan kering akibat penggunaan berulang. Kemasan pocket size sangat praktis dibawa ke mana saja.",
    price: 12000,
    stock: 250,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Hand+Sanitizer",
  },
  {
    name: "Pelembab Kulit Kering 100ml",
    categoryName: "Perawatan Pribadi",
    description: "Lotion pelembab intensif 100ml yang diformulasikan dengan ceramide, shea butter, dan hyaluronic acid untuk memberikan hidrasi mendalam pada kulit yang sangat kering, kasar, dan bersisik. Bekerja dengan cara memulihkan lapisan pelindung kulit (skin barrier) serta mengunci kelembaban agar kulit tetap lembut, halus, dan kenyal sepanjang hari. Formula hypoallergenic dan bebas pewangi buatan, aman untuk kulit sensitif dan atopi.",
    price: 45000,
    stock: 60,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Pelembab",
  },
  {
    name: "Sunscreen Wajah SPF 50",
    categoryName: "Perawatan Pribadi",
    description: "Tabir surya wajah dengan SPF 50 dan PA++++ yang memberikan perlindungan maksimal dari paparan sinar UV-A yang menyebabkan penuaan dini dan UV-B yang menyebabkan sunburn. Formula ringan berbasis air cepat meresap tanpa meninggalkan white cast, cocok digunakan sebagai base makeup sehari-hari. Diperkaya antioksidan vitamin C dan niacinamide yang membantu mencerahkan wajah dan meratakan warna kulit. Wajib digunakan ulang setiap 2-3 jam saat beraktivitas di luar.",
    price: 55000,
    stock: 45,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Sunscreen",
  },
  {
    name: "Tisu Basah Antibakteri (Isi 50 Lembar)",
    categoryName: "Perawatan Pribadi",
    description: "Tisu basah antibakteri isi 50 lembar dengan tekstur tebal dan lembut yang mengandung benzalkonium chloride untuk membunuh bakteri dan kuman pada tangan dan permukaan kulit secara efektif tanpa perlu air. Formulanya yang mengandung aloe vera dan vitamin E membuat kulit tetap lembap dan tidak iritasi setelah digunakan. Bebas alkohol dan pewangi keras, aman untuk seluruh keluarga termasuk bayi. Kemasan flip-cap menjaga tisu tetap lembab.",
    price: 15000,
    stock: 180,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Tisu+Basah",
  },
  {
    name: "Bedak Tabur Anti Gatal 90g",
    categoryName: "Perawatan Pribadi",
    description: "Bedak tabur salicyl dingin 90g yang mengandung salicylic acid dan talc untuk meredakan rasa gatal, panas, dan tidak nyaman akibat biang keringat, ruam popok, dan alergi kulit ringan. Memberikan sensasi dingin dan segar pada kulit yang meradang sekaligus menyerap kelembaban berlebih untuk mencegah gesekan antar lipatan kulit. Aman untuk bayi, anak-anak, dan dewasa, terutama di musim panas atau setelah aktivitas yang menyebabkan banyak berkeringat.",
    price: 14000,
    stock: 110,
    imageUrl: "https://dummyimage.com/300x300/d8a3f1/fff&text=Bedak+Gatal",
  },

  // --- Alat Kesehatan ---
  {
    name: "Termometer Digital",
    categoryName: "Alat Kesehatan",
    description: "Termometer digital presisi tinggi yang menggunakan sensor thermistor canggih untuk mengukur suhu tubuh secara akurat dalam waktu kurang dari 60 detik. Dilengkapi layar LCD yang mudah dibaca, bunyi alarm saat pengukuran selesai, dan fungsi memori untuk menyimpan hasil pengukuran terakhir. Aman digunakan untuk semua usia termasuk bayi. Tersedia dalam mode pengukuran oral, aksila (ketiak), maupun rektal sesuai kebutuhan.",
    price: 65000,
    stock: 30,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Termometer",
  },
  {
    name: "Masker Medis 3 Ply (Satu Box Isi 50)",
    categoryName: "Alat Kesehatan",
    description: "Masker bedah 3 lapis (3 ply) berkualitas tinggi dengan efisiensi filtrasi partikel dan bakteri di atas 95%. Lapisan pertama berfungsi sebagai penghalang cairan, lapisan tengah sebagai filter bakteri dan partikel, serta lapisan dalam yang lembut nyaman di kulit wajah. Dilengkapi kawat hidung yang dapat dibentuk untuk mencegah celah udara. Satu box berisi 50 masker, ideal untuk penggunaan harian di fasilitas kesehatan maupun aktivitas publik.",
    price: 35000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Masker",
  },
  {
    name: "Tensimeter Digital Lengan Atas",
    categoryName: "Alat Kesehatan",
    description: "Tensimeter digital otomatis untuk lengan atas yang menggunakan teknologi oscillometric terkini untuk mengukur tekanan darah sistolik, diastolik, dan detak jantung secara akurat dan cepat hanya dalam satu kali pemompaan. Layar LCD besar dengan tampilan jelas memudahkan pembacaan hasil. Dilengkapi indikator aritmia jantung, memori untuk 60 hasil pengukuran, dan fitur deteksi gerakan tubuh. Ideal untuk pemantauan tekanan darah mandiri di rumah.",
    price: 350000,
    stock: 15,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Tensimeter",
  },
  {
    name: "Oximeter Pulse Jari",
    categoryName: "Alat Kesehatan",
    description: "Pulse oximeter jari yang menggunakan teknologi fotopletysmografi inframerah untuk mengukur kadar saturasi oksigen dalam darah (SpO2) dan detak jantung (pulse rate) secara non-invasif dalam waktu kurang dari 10 detik. Layar OLED berwarna dengan tampilan grafik gelombang nadi yang mudah dibaca dari berbagai sudut. Ringan, kompak, dan mudah dioperasikan, sangat berguna bagi penderita asma, PPOK, atau pemantauan kondisi kesehatan umum sehari-hari.",
    price: 85000,
    stock: 40,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Oximeter",
  },
  {
    name: "Strip Cek Gula Darah (Isi 50)",
    categoryName: "Alat Kesehatan",
    description: "Strip reagen pengukur gula darah isi 50 buah yang kompatibel dengan alat glucometer standar. Setiap strip dilapisi enzim glucose oxidase presisi tinggi yang bereaksi dengan sampel darah untuk memberikan hasil pengukuran yang akurat dan konsisten hanya dengan 0.5 mikroliter darah. Dikemas dalam botol tertutup rapat untuk menjaga kualitas strip dari paparan udara dan kelembaban. Hasil pembacaan tersedia dalam 5 detik.",
    price: 110000,
    stock: 55,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Strip+Gula",
  },
  {
    name: "Alat Cek Gula Darah, Asam Urat, Kolesterol",
    categoryName: "Alat Kesehatan",
    description: "Set alat monitoring kesehatan 3-in-1 digital yang memungkinkan pengguna mengukur kadar gula darah, asam urat, dan kolesterol total hanya dengan satu perangkat menggunakan strip reagen yang berbeda untuk masing-masing parameter. Teknologi biosensor elektrokimia memberikan hasil yang akurat dan reproducible. Dilengkapi memori penyimpanan 500 hasil ukur, tampilan layar besar, dan kompatibel dengan strip dari berbagai merek ternama untuk kemudahan penggunaan mandiri.",
    price: 275000,
    stock: 20,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Alat+3in1",
  },
  {
    name: "Kotak P3K Dinding Lengkap",
    categoryName: "Alat Kesehatan",
    description: "Kotak pertolongan pertama pada kecelakaan (P3K) lengkap yang dilengkapi berbagai perlengkapan medis esensial seperti plester luka berbagai ukuran, perban gulung, kasa steril, gunting medis, pinset, antiseptik povidone iodine, kapas, sarung tangan sekali pakai, dan obat-obatan dasar. Kotak berbahan ABS kokoh dengan kait untuk dipasang di dinding, mudah diakses dalam kondisi darurat. Ideal untuk kantor, rumah, sekolah, dan kendaraan.",
    price: 120000,
    stock: 35,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Kotak+P3K",
  },
  {
    name: "Kapas Medis Pembalut 500g",
    categoryName: "Alat Kesehatan",
    description: "Kapas medis pembalut 500g yang terbuat dari serat kapas alami 100% yang telah melalui proses sterilisasi dan pemurnian untuk menghasilkan kapas yang putih bersih, lembut, dan memiliki daya serap cairan yang sangat tinggi. Digunakan untuk membersihkan luka, mengaplikasikan antiseptik, menutup dan membalut luka minor. Bebas bahan kimia berbahaya dan serat sintetis, aman untuk kulit sensitif dan luka terbuka.",
    price: 35000,
    stock: 80,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Kapas+Medis",
  },
  {
    name: "Kasa Hidrofil Steril (1 Box)",
    categoryName: "Alat Kesehatan",
    description: "Kasa hidrofil steril dalam kemasan box yang terbuat dari anyaman serat kapas murni bergelombang yang lembut dan berdaya serap tinggi. Digunakan sebagai pembalut luka bersih, penutup luka pasca operasi, serta media aplikasi antiseptik dan obat luka topikal. Setiap lembar kasa telah melalui proses sterilisasi gamma untuk memastikan kemandulannya. Tersedia dalam berbagai ukuran potongan yang dapat disesuaikan dengan area luka.",
    price: 15000,
    stock: 150,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Kasa+Steril",
  },
  {
    name: "Perban Gulung Melar",
    categoryName: "Alat Kesehatan",
    description: "Perban gulung elastis lebar 10cm yang terbuat dari bahan rajutan katun dan spandex yang dapat melar hingga dua kali panjang aslinya, memberikan kompresi lembut dan fiksasi yang kuat tanpa membatasi sirkulasi darah. Ideal untuk membalut luka, mendukung sendi yang terkilir, dan mengurangi pembengkakan pada cedera olahraga. Dapat dicuci dan digunakan berulang kali. Ujung perban mudah diamankan dengan klip logam yang disertakan.",
    price: 18000,
    stock: 90,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Perban",
  },
  {
    name: "Plester Gulung Kertas Tape",
    categoryName: "Alat Kesehatan",
    description: "Plester gulung micropore berbahan kertas medis hypoallergenic yang dirancang khusus sebagai perekat kasa dan pembalut bedah bagi kulit sensitif yang rentan alergi terhadap perekat berbahan karet atau plastik. Permukaannya berpori memungkinkan sirkulasi udara sehingga kulit di bawahnya tetap bernapas dan mengurangi risiko maserasi kulit. Mudah dipotong tanpa gunting, meninggalkan sedikit residu saat dilepas, dan aman untuk digunakan jangka panjang.",
    price: 25000,
    stock: 120,
    imageUrl: "https://dummyimage.com/300x300/a3f1c8/1a1a1a&text=Micropore",
  },
  {
    name: "Sarung Tangan Medis Latex (Isi 100)",
    categoryName: "Alat Kesehatan",
    description: "Sarung tangan pemeriksaan medis berbahan latex alami isi 100 lembar (50 pasang) yang bebas bedak (powder-free) untuk meminimalkan risiko kontaminasi dan reaksi alergi pada pasien. Tekstur permukaan bertekstur di ujung jari memberikan cengkeraman yang baik pada instrumen basah maupun kering. Ketebalan seragam memberikan sensasi sentuhan yang baik serta perlindungan terhadap cairan tubuh dan bahan kimia ringan. Tersedia dalam ukuran S, M, dan L.",
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

  console.log(`Menyiapkan data seeding untuk Doctors...`);
  const allSpecializations = await prisma.specialization.findMany();
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  let doctorCounter = 1;
  for (const spec of allSpecializations) {
    for (let i = 1; i <= 3; i++) {
      const email = `doctor${doctorCounter}@halohealth.com`;
      const fullName = `Dr. Specialist ${doctorCounter} (${spec.name})`;
      const telephoneNumber = `081234567${doctorCounter.toString().padStart(3, '0')}`;
      const strNumber = `STR-${spec.id}-${i}-${doctorCounter}`;
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        console.log(`Doctor ${fullName} sudah ada, dilewati.`);
      } else {
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            fullName,
            telephoneNumber,
            role: "DOCTOR",
            doctorProfile: {
              create: {
                specializationId: spec.id,
                strNumber,
              }
            }
          }
        });
        console.log(`Berhasil menambahkan doctor: ${fullName}`);
      }
      doctorCounter++;
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
