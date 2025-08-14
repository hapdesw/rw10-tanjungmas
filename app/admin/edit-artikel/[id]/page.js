// app/admin/edit-artikel/[id]/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

export default async function EditArtikelPage({ params }) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: artikel, error } = await supabase
    .from('artikels')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !artikel) {
    console.error('Error fetching artikel:', error);
    return (
      <section className="bg-[#f3f0e3] py-8 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-[#fbfaf6] rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-6">Error</h1>
            <p>Artikel dengan ID {params.id} tidak ditemukan.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f3f0e3] py-8 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-[#fbfaf6] rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-[#184D3B] mb-6">Edit Artikel</h1>
          <SimpleEditor 
            key={artikel.id} // Force re-render when artikel changes
            userId={artikel.user_id} 
            lembagaId={artikel.lembaga_id}
            articleId={artikel.id} 
            initialData={{
              title: artikel.judul,
              isi: artikel.isi,        // Pastikan menggunakan 'isi' bukan 'content'
              gambar: artikel.gambar   // Pastikan menggunakan 'gambar' bukan 'featuredImage'
            }}
          />
        </div>
      </div>
    </section>
  );
}