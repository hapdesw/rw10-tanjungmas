import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 3600 // Revalidate setiap 1 jam

async function getArtikel() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: artikels, error } = await supabase
    .from('artikels')
    .select(`
      id,
      judul,
      isi,
      gambar,
      created_at,
      user_id,
      users (nama),
      lembagas (nama)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return artikels
}

export default async function ArtikelPage() {
  const artikels = await getArtikel()

  return (
    <section className="bg-[#f3f0e3] py-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-[#fbfaf6] rounded-xl shadow p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Daftar Artikel</h1>
            <p className="text-gray-600 text-center">Informasi terbaru dari RW 10 Tanjung Mas</p>
          </div>

          {/* Grid Artikel */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artikels.length > 0 ? (
              artikels.map((artikel) => (
                <div key={artikel.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {artikel.gambar && (
                    <div className="relative h-48">
                      <Image
                        src={artikel.gambar}
                        alt={`Thumbnail ${artikel.judul}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{new Date(artikel.created_at).toLocaleDateString('id-ID')}</span>
                      <span className="mx-2">•</span>
                      <span>{artikel.users?.nama || 'Admin'}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">{artikel.judul}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{artikel.isi.substring(0, 150)}...</p>
                    <Link
                      href={`/artikel/${artikel.id}`}
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
                <Link href="/artikel/tambah" className="mt-4 inline-block text-[#184D3B] hover:underline">
                  Tambah artikel pertama
                </Link>
              </div>
            )}
          </div>

          {/* Pagination (jika diperlukan) */}
          {/* <div className="mt-8 flex justify-center">
            <Pagination />
          </div> */}
        </div>
      </div>
    </section>
  )
}