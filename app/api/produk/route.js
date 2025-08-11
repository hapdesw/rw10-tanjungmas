// app/api/produk/route.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let lembagaId = searchParams.get('lembaga_id');

  // Debugging: Log parameter yang diterima
  console.log('Parameter lembaga_id:', lembagaId);

  // Konversi dan validasi
  lembagaId = parseInt(lembagaId);
  if (isNaN(lembagaId)) {
    return new Response(
      JSON.stringify({ 
        error: "Parameter lembaga_id harus berupa angka",
        received: searchParams.get('lembaga_id')
      }),
      { status: 400 }
    );
  }

  try {
    // Debugging: Log sebelum query
    console.log('Menjalankan query dengan lembaga_id:', lembagaId);
    
    const { data, error } = await supabase
      .from('produks')
      .select('*')
      .eq('lembaga_id', lembagaId)
      .order('nama', { ascending: true });

    if (error) {
      // Debugging: Log error Supabase
      console.error('Error Supabase:', error);
      throw error;
    }

    // Debugging: Log hasil query
    console.log('Data yang ditemukan:', data.length, 'item');
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Debugging: Log error lengkap
    console.error('Error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: "Gagal mengambil data produk",
        detail: error.message 
      }),
      { status: 500 }
    );
  }
}