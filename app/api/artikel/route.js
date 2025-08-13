import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 6;
    
    if (isNaN(page) || page < 1) throw new Error('Parameter page harus number > 0');
    if (isNaN(limit) || limit < 1) throw new Error('Parameter limit harus number > 0');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: artikel, error, count } = await supabase
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
        profiles:user_id (nama, avatar_url),
        lembagas (nama)
      `, { 
        count: 'exact',
        head: false 
      })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    if (!artikel) throw new Error('Data artikel tidak ditemukan');
    
    return new Response(JSON.stringify({
      articles: artikel,
      total: count || 0,
      page: page,
      totalPages: Math.ceil((count || 0) / limit)
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: "Gagal mengambil data artikel",
        detail: error.message,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
