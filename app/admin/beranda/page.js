// app/page.js
import Image from 'next/image';
import Link from 'next/link';

async function getArtikel() {
  try {
    // Gunakan URL yang berbeda untuk development dan production
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    
    console.log('Fetching from:', `${baseUrl}/api/artikel`);
    
    const res = await fetch(`${baseUrl}/api/artikel`, { 
      cache: 'no-store', // Nonaktifkan cache untuk hasil real-time
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Data received:', data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getArtikel:', error.message);
    console.error('Full error:', error);
    // Return empty array instead of throwing error to prevent page crash
    return [];
  }
}

export default async function Beranda() {
  const artikel = await getArtikel();

  return (
    <section className="bg-[#f3f0e3] pt-3 pb-5">
      {/* Hero Section */}
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

      {/* Artikel Section */}
        <div className="bg-[#f3f0e3] py-8">
        <div className="max-w-screen-xl mx-auto px-4">
            <div className="bg-[#fbfaf6] rounded-xl shadow p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Artikel Terbaru
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {artikel.length > 0 ? (
                artikel.slice(0, 6).map((item) => (
                    <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    {item.gambar && (
                        <div className="relative h-48">
                        <Image
                            src={item.gambar}
                            alt={`Thumbnail ${item.judul}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        </div>
                    )}
                    <div className="p-4">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                        <span className="mx-2">•</span>
                        <span>{item.users?.nama || 'Admin'}</span>
                        {item.lembagas?.nama && (
                            <>
                            <span className="mx-2">•</span>
                            <span>{item.lembagas.nama}</span>
                            </>
                        )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{item.judul}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.isi ? 
                            item.isi.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                            : 'Tidak ada preview tersedia...'}
                        </p>
                        <Link
                        href={`/artikel/${item.id}`}
                        className="text-[#184D3B] font-medium hover:underline inline-flex items-center"
                        >
                        Baca selengkapnya
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        </Link>
                    </div>
                    </div>
                ))
                ) : (
                <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">Belum ada artikel tersedia</p>
                    <p className="text-gray-400 text-sm mt-2">
                    Silakan periksa koneksi database atau tambahkan artikel baru
                    </p>
                </div>
                )}
            </div>

            {artikel.length > 0 && (
                <div className="flex justify-center mt-8">
                <Link
                    href="/artikel"
                    className="px-5 py-2 bg-[#184D3B] text-white rounded-lg hover:bg-green-700 transition"
                >
                    Lihat Semua Artikel ({artikel.length})
                </Link>
                </div>
            )}
            </div>
        </div>
        </div>

      {/* Video Section */}
      <div className="bg-[#f3f0e3] pt-0.5 pb-3">
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
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}