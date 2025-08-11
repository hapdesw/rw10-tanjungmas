import { Quote } from "lucide-react";
import { FaMapMarkerAlt, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { FiInstagram, FiMail } from "react-icons/fi";

export default async function ProfilCTKTPage() {
  let data;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/profil?id=4`, {
        next: { revalidate: 3600 } // Revalidate setiap 1 jam
    });
    if (!res.ok) throw new Error('Gagal mengambil data');
    data = await res.json();
  } catch (error) {
    return <div className="p-4 text-red-600">Gagal mengambil data: {error.message}</div>;
  }

  return (
    <section className="bg-[#f3f0e3] pt-4 pb-9">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-[#f7f6ee] rounded-xl shadow p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Profil {data.nama}
          </h2>

          <div className="max-w-md mx-auto px-4 pb-2 md:pb-5">
            <img
              src="/images/ctkt.JPG"
              alt="CTKT"
              className="hidden md:block w-full object-cover rounded-xl"
            />
            <img
              src="/images/ctkt.JPG"
              alt="CTKT"
              className="block md:hidden w-full object-cover rounded-xl"
            />
          </div>

          <p className="text-justify leading-relaxed text-gray-800 pt-5" dangerouslySetInnerHTML={{ __html: data.deskripsi }} />

            {data.visi && (
                <>
                    <h3 className="text-xl font-bold text-gray-900 mt-10 mb-2">Visi</h3>
                    <div className="relative p-6 pt-8 pb-8 border-l-4 border-[#184D3B] bg-[#f7f6ee] rounded-md">
                    <Quote className="absolute top-2 left-2 w-5 h-5 text-[#184D3B]" />
                    <p className="text-justify font-bold leading-relaxed text-gray-800">
                        {data.visi}
                    </p>
                    <Quote className="absolute bottom-2 right-2 w-5 h-5 text-[#184D3B]" />
                    </div>
                </>
            )}

            {data.misi && (
                <>
                    <h3 className="text-xl font-bold text-gray-900 mt-10 mb-2">Misi</h3>
                    <ol
                    className="list-decimal list-outside pl-8 text-justify leading-relaxed text-gray-800 space-y-2"
                    dangerouslySetInnerHTML={{ __html: data.misi }}
                    />
                </>
            )}

         {data.pencapaians && data.pencapaians.length > 0 && (
        <>
            <h3 className="text-xl font-bold text-gray-900 mt-10 mb-2">Pencapaian</h3>
            <ol className="list-decimal list-outside pl-8 text-justify leading-relaxed text-gray-800 space-y-2">
                {data.pencapaians.map((item) => (
                    <li key={item.id}>
                        {item.judul}
                        {item.gambar && (
                            <div className="mt-2">
                            <img
                                src={item.gambar}
                                alt={item.judul}
                                className="w-full max-w-xs rounded"
                            />
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </>
        )}

        {/* Kontak dan Google Maps Section */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontak</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Google Maps - Bagian Kiri */}
              <div className="md:w-1/2">
                <div className="bg-gray-200 rounded-lg overflow-hidden h-64 md:h-80">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.1131724810795!2d110.42893382835489!3d-6.95580609956348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70f3f74b5fb1bd%3A0xbf33f3403e46711e!2sCTKT%20Divisi%20Kain!5e0!3m2!1sen!2sid!4v1754905642966!5m2!1sen!2sid"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              {/* Informasi Kontak - Bagian Kanan */}
              <div className="md:w-1/2">
                <div className="bg-[#f3f0e3] p-6 rounded-lg shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>Lokasi Kami</span>
                    </h3>
                    <p className="text-gray-800 mb-2">
                      Jl. Usman Jannatin Gg. Armada 1 No.17, RT 01/RW 10, Tanjung Mas, Kec. Semarang Utara, Kota Semarang
                    </p>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href="https://wa.me/6285799799106" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 flex items-center gap-3 hover:text-green-600 transition-colors py-2"
                    >
                      <FaWhatsapp className="text-green-500 text-xl flex-shrink-0" />
                      <span>+62 857-9979-9106 (Divisi Kain)</span>
                    </a>
                    <a 
                      href="https://wa.me/6285842349974" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 flex items-center gap-3 hover:text-green-600 transition-colors py-2"
                    >
                      <FaWhatsapp className="text-green-500 text-xl flex-shrink-0" />
                      <span>+62 858-4234-9974 (Divisi Kayu)</span>
                    </a>
                    <a 
                      href="https://instagram.com/ctktdevisikain" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 flex items-center gap-3 hover:text-pink-600 transition-colors py-2"
                    >
                      <FiInstagram className="text-pink-500 text-xl flex-shrink-0" />
                      <span>ctktdevisikain</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
