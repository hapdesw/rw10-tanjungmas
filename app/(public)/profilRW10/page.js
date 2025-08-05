import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ProfilRW10Page() {
  const { data, error } = await supabase
    .from('lembagas')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    return <div className="p-4 text-red-600">Gagal mengambil data: {error.message}</div>;
  }

  return (
    <section className="bg-[#f3f0e3] pt-4 pb-9">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Profil {data.nama}
          </h2>

          <div className="max-w-screen-xl mx-auto px-4 pb-2 md:pb-5">
            <img
              src="/images/berani berubah untuk berubah-laptop.png"
              alt="Header Desktop"
              className="hidden md:block w-full object-cover rounded-xl"
            />
            <img
              src="/images/berani berubah untuk berubah-hp.png"
              alt="Header Mobile"
              className="block md:hidden w-full object-cover rounded-xl"
            />
          </div>

          <p className="text-justify leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: data.deskripsi }} />

          <h3 className="text-xl font-bold text-gray-900 mt-10 mb-2">Visi</h3>
          <p className="text-justify font-bold pl-4 leading-relaxed text-gray-800">
            &quot;{data.visi}&quot;
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-10 mb-2">Misi</h3>
          <ol
            className="list-decimal list-outside pl-8 text-justify leading-relaxed text-gray-800 space-y-2"
            dangerouslySetInnerHTML={{ __html: data.misi }}
          />

         <h3 className="text-xl font-bold text-gray-900 mt-10 mb-2">Pencapaian</h3>
          <ol
            className="list-decimal list-outside pl-8 text-justify leading-relaxed text-gray-800 space-y-2"
            dangerouslySetInnerHTML={{ __html: data.misi }}
          />
        </div>
      </div>
    </section>
  );
}
