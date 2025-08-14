// app/api/artikel/update/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import cloudinary from '@/lib/cloudinary';

export async function PUT(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const content = formData.get('content');
    const featuredImage = formData.get('featuredImage');
    const currentImageUrl = formData.get('currentImageUrl');

    // Validasi input
    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Cek apakah artikel ada
    const { data: existingArticle, error: findError } = await supabase
      .from('artikels')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingArticle) {
      return NextResponse.json(
        { error: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }

    let imageUrl = currentImageUrl;

    // Jika ada gambar baru, upload ke Cloudinary
    if (featuredImage && featuredImage.size > 0) {
      const bytes = await featuredImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'webp' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // Update artikel di database
    const { data, error } = await supabase
      .from('artikels')
      .update({
        judul: title,
        isi: content,
        gambar: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Artikel berhasil diperbarui',
      data: {
        id: data.id,
        title: data.judul,
        content: data.isi,
        imageUrl: data.gambar
      }
    });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update article', details: error.message },
      { status: 500 }
    );
  }
}