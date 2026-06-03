import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="w-full max-w-md rounded-[21px] bg-background p-8 text-center shadow-xl">
        <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">404</p>
        <h1 className="mt-2 text-[32px] font-bold text-text-primary">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-[14px] text-text-secondary">
          Tautan yang kamu buka tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
