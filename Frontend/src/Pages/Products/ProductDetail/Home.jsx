import { useParams, useNavigate } from "react-router-dom";
import { useProductDetail } from "../../../hooks";
import ProductDetailSkeleton from "./components/ProductDetailSkeleton";
import ProductDetailImage from "./components/ProductDetailImage";
import ProductDetailInfo from "./components/ProductDetailInfo";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, isError, error, refetch } = useProductDetail(id);

  const formattedPrice = product
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(product.price)
    : "";

  const isLowStock = product && product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product && product.stock === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Back Button ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Produk
        </button>
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <ProductDetailSkeleton />
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {isError && !isLoading && (
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-32 text-center">
          <span className="mb-4 text-6xl">⚠️</span>
          <h2 className="text-lg font-bold text-slate-800">Gagal memuat produk</h2>
          <p className="mt-2 text-sm text-slate-500">
            {error?.message || "Terjadi kesalahan saat mengambil data produk."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Product Detail ────────────────────────────────────────────────── */}
      {!isLoading && !isError && product && (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2">
            <ProductDetailImage
              product={product}
              isOutOfStock={isOutOfStock}
            />
            <ProductDetailInfo
              product={product}
              formattedPrice={formattedPrice}
              isLowStock={isLowStock}
              isOutOfStock={isOutOfStock}
              onBack={() => navigate(-1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
