import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('artikels')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6); // Ambil 6 artikel terbaru

    if (error) throw error;

    return new Response(JSON.stringify(data), {
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
      { status: 500 }
    );
  }
}