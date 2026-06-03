import { useParams, useNavigate } from "react-router-dom";
import { useProductDetail } from "../../../hooks";
import ProductDetailSkeleton from "./components/ProductDetailSkeleton";
import ProductDetailImage from "./components/ProductDetailImage";
import ProductDetailInfo from "./components/ProductDetailInfo";
import { ArrowLeft, AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen bg-surface">
      {/* ── Back Button ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2 text-[14px] font-semibold text-text-primary shadow-sm transition-all hover:bg-primary-light hover:text-primary"
        >
          <ArrowLeft size={16} strokeWidth={2} />
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
          <AlertTriangle size={48} strokeWidth={1.5} className="mb-4 text-error" />
          <h2 className="text-[18px] font-semibold text-text-primary">Gagal memuat produk</h2>
          <p className="mt-2 text-[14px] text-text-secondary">
            {error?.message || "Terjadi kesalahan saat mengambil data produk."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Product Detail ────────────────────────────────────────────────── */}
      {!isLoading && !isError && product && (
        <div className="mx-auto max-w-5xl px-4 py-[34px] sm:px-6 lg:px-8">
          <div className="grid gap-[34px] md:grid-cols-2">
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
