import Image from 'next/image'
import Link from 'next/link'

async function getArtikel(page = 1, limit = 6) {
  try {
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const url = `${baseUrl}/api/artikel?page=${page}&limit=${limit}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      throw new Error(errorData.error || `HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response: articles should be an array');
    }
    
    return {
      articles: data.articles,
      total: data.total || 0,
      page: data.page || page,
      totalPages: data.totalPages || 1
    };
  } catch (error) {
    return {
      articles: [],
      total: 0,
      page: 1,
      totalPages: 1,
      error: error.message
    };
  }
}

export default async function KelolaArtikelPage({ searchParams }) {
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 6;
  
  const { articles, total, page, totalPages, error } = await getArtikel(currentPage, limit);

  return (
    <section className="bg-[#f3f0e3] py-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-[#fbfaf6] rounded-xl shadow p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Daftar Artikel</h1>
            <p className="text-gray-600 text-center">Informasi terbaru dari RW 10 Tanjung Mas</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <h3 className="font-bold">Terjadi kesalahan:</h3>
              <p>{error}</p>
              <p className="text-sm mt-2">Periksa console browser untuk detail lebih lanjut</p>
            </div>
          )}

          {/* Grid Artikel */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.length > 0 ? (
              articles.map((artikel) => (
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
                      <span>{artikel.profiles?.nama || 'Admin'}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">{artikel.judul}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {artikel.isi ? artikel.isi.substring(0, 150) + '...' : 'Tidak ada preview...'}
                    </p>
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
                {error && (
                  <p className="text-red-500 mt-2">Ada error saat mengambil data</p>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Link
                  href={`/artikel?page=${Math.max(1, page - 1)}`}
                  className={`px-4 py-2 rounded-md ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#184D3B] hover:bg-gray-100'}`}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : undefined}
                >
                  &laquo; Prev
                </Link>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page <= 3 
                    ? i + 1 
                    : page >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : page - 2 + i
                  return (
                    pageNum > 0 && pageNum <= totalPages && (
                      <Link
                        key={pageNum}
                        href={`/artikel?page=${pageNum}`}
                        className={`px-4 py-2 rounded-md ${page === pageNum ? 'bg-[#184D3B] text-white' : 'text-[#184D3B] hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </Link>
                    )
                  )
                })}
                
                <Link
                  href={`/artikel?page=${Math.min(totalPages, page + 1)}`}
                  className={`px-4 py-2 rounded-md ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#184D3B] hover:bg-gray-100'}`}
                  aria-disabled={page === totalPages}
                  tabIndex={page === totalPages ? -1 : undefined}
                >
                  Next &raquo;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
