// app/artikel/[id]/page.js
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/artikel/${params.id}`);
    
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
    
    if (!res.ok) {
      return notFound();
    }

    artikel = await res.json();
  } catch (error) {
    return notFound();
  }

  return (
    <section className="bg-[#f3f0e3] pt-4 pb-9">
      <div className="max-w-screen-xl mx-auto px-4">
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

          {/* Judul Artikel */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{artikel.judul}</h1>

          {/* Meta Info */}
          <div className="flex items-center justify-center mb-6 text-sm text-gray-500">
            <span>Oleh: {artikel.users?.nama || 'Admin'}</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(artikel.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            {artikel.lembagas && (
              <>
                <span className="mx-2">•</span>
                <span>{artikel.lembagas.nama}</span>
              </>
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
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: artikel.isi }} 
          />
        </div>
      </div>
    </section>
  )
}