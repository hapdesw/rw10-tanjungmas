import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SimpleEditor from '@/components/tiptap-templates/simple/simple-editor';

export default async function EditArtikelPage({ params }) {
  const supabase = createClientComponentClient();
  const { data: artikel } = await supabase
    .from('artikels')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!artikel) {
    return <div>Artikel tidak ditemukan</div>;
  }

  return (
    <section className="bg-[#f3f0e3] py-8 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-[#fbfaf6] rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-[#184D3B] mb-6">Edit Artikel</h1>
          <SimpleEditor 
            userId={artikel.user_id} 
            lembagaId={artikel.lembaga_id}
            initialData={{
              title: artikel.judul,
              content: artikel.isi,
              featuredImage: artikel.gambar
            }}
          />
        </div>
      </div>
    </section>
  );
}