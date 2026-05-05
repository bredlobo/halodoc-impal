import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        <p className="text-sm tracking-widest text-slate-300 uppercase">404</p>
        <h1 className="mt-2 text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm text-slate-300">
          Tautan yang kamu buka tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
