import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Handler GET (sudah ada)
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { data: artikel, error } = await supabase
      .from('artikels')
      .select(`
        id,
        judul,
        isi,
        gambar,
        created_at,
        updated_at,
        user_id,
        lembaga_id,
        profiles:user_id (nama),
        lembagas (nama)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error Supabase:', error);
      throw error;
    }

    if (!artikel) {
      return new Response(
        JSON.stringify({ error: "Artikel tidak ditemukan" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(artikel), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Gagal mengambil data artikel",
        detail: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Tambahkan handler DELETE
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // Hapus artikel dari database
    const { error } = await supabase
      .from('artikels')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error menghapus artikel:', error);
      throw error;
    }

    // Jika berhasil dihapus
    return new Response(
      JSON.stringify({ 
        message: "Artikel berhasil dihapus",
        deleted_id: id 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Gagal menghapus artikel",
        detail: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}