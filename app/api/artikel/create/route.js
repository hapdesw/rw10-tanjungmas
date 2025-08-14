// app/api/artikel/create/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  console.log('Create artikel API called'); // Debug log

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const userId = formData.get('userId');
    const lembagaId = formData.get('lembagaId');
    const featuredImage = formData.get('featuredImage');

    console.log('Received data:', { title, content: content?.substring(0, 100), userId, lembagaId, hasImage: !!featuredImage });

    // Validasi input
    if (!title || !content || !userId || !lembagaId) {
      console.log('Missing required fields');
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          received: { title: !!title, content: !!content, userId: !!userId, lembagaId: !!lembagaId }
        },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Jika ada gambar, upload ke Cloudinary
    if (featuredImage && featuredImage.size > 0) {
      console.log('Uploading image to Cloudinary...');
      try {
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
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                console.log('Cloudinary upload success:', result.secure_url);
                resolve(result);
              }
            }
          ).end(buffer);
        });

        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return NextResponse.json(
          { 
            success: false,
            error: 'Failed to upload image',
            details: uploadError.message 
          },
          { status: 500 }
        );
      }
    }

    // Simpan artikel ke database
    console.log('Saving to database...');
    const { data, error } = await supabase
      .from('artikels')
      .insert([
        {
          judul: title,
          isi: content,
          gambar: imageUrl,
          user_id: userId,
          lembaga_id: parseInt(lembagaId),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to save article to database',
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log('Article created successfully:', data.id);

    return NextResponse.json({
      success: true,
      message: 'Artikel berhasil dibuat',
      data: {
        id: data.id,
        title: data.judul,
        content: data.isi,
        imageUrl: data.gambar
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}