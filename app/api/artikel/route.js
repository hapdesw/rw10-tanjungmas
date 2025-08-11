// app/api/artikel/route.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
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
        users (nama),
        lembagas (nama)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error Supabase:', error);
      throw error;
    }

    return new Response(JSON.stringify(artikel || []), {
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