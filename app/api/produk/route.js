import { createClient } from '@supabase/supabase-js';

// Pastikan environment variables sudah di-set di Vercel
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lembagaId = searchParams.get('lembaga_id');

  // Validasi lembaga_id
  if (!lembagaId || isNaN(parseInt(lembagaId))) {
    return new Response(
      JSON.stringify({ error: "Parameter lembaga_id harus berupa angka" }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { data, error } = await supabase
      .from('produks')
      .select('*')
      .eq('lembaga_id', parseInt(lembagaId)) // Pastikan sebagai integer
      .order('nama', { ascending: true });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Supabase error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Gagal mengambil data produk",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}