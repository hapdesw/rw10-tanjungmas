import { data } from "autoprefixer";
import ProdukCard from "/components/ProdukCard";
import { FaWhatsapp } from "react-icons/fa";

export default async function ProdukBSMTPage() {
  let produkBSMT = [];
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produk?lembaga_id=2`);
    if (!res.ok) throw new Error('Gagal mengambil data produk');
    produkBSMT = await res.json();
  } catch (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

 return (
    <section className="bg-[#f3f0e3] pt-4 pb-9">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-[#f7f6ee] rounded-xl shadow p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Produk Bank Sampah Mekar Tanjung 
          </h2>

          {produkBSMT.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada produk yang tersedia</p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {produkBSMT.map((produk) => (
                  <ProdukCard key={produk.id} produk={produk} />
                ))}
              </div>
              
              {/* WhatsApp Contact Section */}
              <div className="mt-12 text-center">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  Tertarik dengan produk-produk BSMT? Silakan hubungi narahubung di bawah:
                </p>
                <a 
                  href="https://wa.me/6285328845576" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
                >
                  <FaWhatsapp className="text-xl" />
                  Hubungi via WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}