export default function Beranda() {
  return (
    <section className="bg-[#f3f0e3] pt-3 pb-5">
      {/* Hero Gambar RW 10 */}
      <div className="max-w-screen-xl mx-auto px-4">
        <img
          src="/images/IMG_4831.JPG"
          alt="Foto RW 10"
          className="w-full max-h-[500px] object-cover rounded-xl shadow"
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
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#fbfaf6] rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/images/IMG_4831.JPG"
                    alt={`Thumbnail Artikel ${i + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Judul Artikel {i + 1}</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Deskripsi singkat artikel {i + 1}.
                    </p>
                    <a
                      href="#"
                      className="text-[#184D3B] font-semibold hover:underline"
                    >
                      Baca Selengkapnya
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Tombol Lihat Semua Artikel */}
            <div className="flex justify-center mt-4">
              <a
                href="#"
                className="text-white bg-[#184D3B] hover:bg-green-900 focus:ring-4 focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition duration-200"
              >
                Lihat Semua Artikel
              </a>
            </div>
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
