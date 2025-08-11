import Image from 'next/image';
import Link from 'next/link';

async function getArtikelTerbaru() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/artikel`, {
      next: { revalidate: 3600 } // Revalidate setiap 1 jam
    });
    
    if (!res.ok) {
      throw new Error('Gagal mengambil data artikel');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function Beranda() {
  const artikel = await getArtikelTerbaru();

  return (
    <section className="bg-[#f3f0e3] pt-3 pb-5">
      {/* Hero Gambar RW 10 */}
      <div className="max-w-screen-xl mx-auto px-4">
        <Image
          src="/images/1000153634.jpg"
          alt="Foto RW 10"
          width={1200}
          height={500}
          className="w-full max-h-[500px] object-cover rounded-xl shadow"
          priority
        />
      </div>

      {/* Section Artikel */}
      <div className="bg-[#f3f0e3] py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-[#f7f6ee] rounded-xl shadow p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Artikel Terbaru
            </h2>

            {/* Grid Artikel */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              {artikel.length > 0 ? (
                artikel.map((artikel) => (
                  <div key={artikel.id} className="bg-[#fbfaf6] rounded-lg overflow-hidden shadow-md">
                    {artikel.gambar && (
                      <div className="relative h-48">
                        <Image
                          src={artikel.gambar}
                          alt={`Thumbnail Artikel ${artikel.judul}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{artikel.judul}</h3>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                        {artikel.isi.substring(0, 150)}...
                      </p>
                      <Link
                        href={`/artikel/${artikel.id}`}
                        className="text-[#184D3B] font-semibold hover:underline"
                      >
                        Baca Selengkapnya
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center py-8">Belum ada artikel tersedia</p>
              )}
            </div>

            {/* Tombol Lihat Semua Artikel - Hanya tampil jika ada artikel */}
            {artikel.length > 0 && (
              <div className="flex justify-center mt-4">
                <Link
                  href="/artikel"
                  className="text-white bg-[#184D3B] hover:bg-green-900 focus:ring-4 focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition duration-200"
                >
                  Lihat Semua Artikel
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Video Profil */}
      <div className="bg-[#f3f0e3] py-3">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-[#f7f6ee] rounded-xl shadow p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Video Profil RW 10
            </h2>
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/jxKjOOR9sPU?si=Ui2xAe4jJImV52cn"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}