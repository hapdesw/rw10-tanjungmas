import { createClient } from '@supabase/supabase-js';
import { Quote } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ProfilBSMTPage() {
  const { data, error } = await supabase
    .from('lembagas')
    .select('*, pencapaians(*)')
    .eq('id', 4)
    .maybeSingle();

  if (error) {
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
        </div>
      </div>
    </section>
  );
}
