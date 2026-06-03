import { products } from "../../../data/mockData";
import ProductCard from "../../../components/ProductCard";
import SectionHeader from "../../../components/SectionHeader";

function StorePreviewSection() {
  return (
    <section id="store" className="bg-surface py-[55px]">
      <div className="mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Produk kesehatan terpercaya"
          description="Belanja obat dan produk kesehatan dengan pengalaman checkout sederhana dan alur pembayaran yang jelas."
        />

        <div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StorePreviewSection;
