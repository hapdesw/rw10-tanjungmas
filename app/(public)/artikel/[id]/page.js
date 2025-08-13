// app/artikel/[id]/page.js
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/artikel/${params.id}`);
    next: { revalidate: 60 }
    
    if (!res.ok) {
      return {
        title: 'Artikel Tidak Ditemukan',
        description: 'Artikel tidak ditemukan di RW 10 Tanjung Mas'
      }
    }
    const artikel = await res.json();
    return {
      title: artikel.judul,
      description: artikel.isi.substring(0, 160),
      openGraph: {
        title: artikel.judul,
        description: artikel.isi.substring(0, 160),
        images: artikel.gambar ? [{ url: artikel.gambar }] : undefined
      }
    }
  } catch (error) {
    return {
      title: 'Error',
      description: 'Gagal memuat metadata artikel'
    }
  }
}

export default async function ArtikelDetail({ params }) {
  let artikel = null;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/artikel/${params.id}`);
    
    // Tambahkan logging untuk debugging
    console.log('Response status:', res.status);
    console.log('Response headers:', [...res.headers.entries()]);
    
    if (!res.ok) {
      console.log('Response not OK, returning not found');
      return notFound();
    }
    artikel = await res.json();
    console.log('Artikel data:', artikel); // Periksa data yang diterima
  } catch (error) {
    console.error('Fetch error:', error);
    return notFound();
  }

  return (
    <section className="bg-[#f3f0e3] pt-4 pb-9">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-[#f7f6ee] rounded-xl shadow p-6 sm:p-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-[#184D3B]">
                  Beranda
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/artikel" className="ml-1 text-gray-700 hover:text-[#184D3B] md:ml-2">
                    Artikel
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">{artikel.judul.substring(0, 20)}...</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Judul Artikel - Responsif untuk Mobile */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center leading-tight">
            {artikel.judul}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 text-sm text-gray-500">
            <div className="flex items-center">
              <span>Oleh: {artikel.users?.nama || 'Admin'}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(artikel.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            {artikel.lembagas && (
              <div className="flex items-center mt-1 sm:mt-0">
                <span className="mx-2 hidden sm:inline">•</span>
                <span className="text-center sm:text-left">{artikel.lembagas.nama}</span>
              </div>
            )}
          </div>

          {/* Gambar Utama */}
          {artikel.gambar && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-md">
              <Image
                src={artikel.gambar}
                alt={artikel.judul}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                priority
              />
            </div>
          )}

          {/* Konten Artikel */}
          <div 
            className="prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: artikel.isi }} 
          />
        </div>
      </div>
    </section>
  )
}