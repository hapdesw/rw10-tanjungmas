// app/api/artikel/create/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import cloudinary from '@/lib/cloudinary';

// Mapping lembaga ID ke nama folder
const LEMBAGA_FOLDERS = {
  1: 'rw10',
  2: 'bsmt', 
  3: 'kwt',
  4: 'ctkt'
};

export async function POST(request) {
  console.log('=== API Route Started ===');
  
  // Check environment variables first
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error('Missing environment variables:', missingEnvVars);
    return NextResponse.json(
      { 
        error: 'Server configuration error',
        details: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        missingVars: missingEnvVars
      },
      { status: 500 }
    );
  }

  // Initialize Supabase client
  let supabase;
  try {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error.message
      },
      { status: 500 }
    );
  }

  try {
    console.log('Parsing form data...');
    const formData = await request.formData();
    
    const title = formData.get('title');
    const content = formData.get('content');
    const featuredImage = formData.get('featuredImage');
    const userId = formData.get('userId');
    const lembagaId = parseInt(formData.get('lembagaId'));

    console.log('Received data:', { 
      title: title?.substring(0, 50) + '...', 
      contentLength: content?.length,
      userId, 
      lembagaId, 
      hasImage: !!featuredImage && featuredImage.size > 0,
      imageSize: featuredImage?.size
    });

    // Validasi input yang lebih detail
    const validationErrors = [];
    
    if (!title || title.trim().length === 0) {
      validationErrors.push('Title is required');
    }
    if (!content || content.trim().length === 0) {
      validationErrors.push('Content is required');
    }
    if (!userId || userId.trim().length === 0) {
      validationErrors.push('User ID is required');
    }
    if (!lembagaId || isNaN(lembagaId)) {
      validationErrors.push('Valid Lembaga ID is required');
    }
    if (lembagaId && !LEMBAGA_FOLDERS[lembagaId]) {
      validationErrors.push(`Invalid lembaga_id: ${lembagaId}. Valid options: ${Object.keys(LEMBAGA_FOLDERS).join(', ')}`);
    }

    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors,
          receivedData: { title: !!title, content: !!content, userId: !!userId, lembagaId }
        },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Upload gambar ke Cloudinary jika ada
    if (featuredImage && featuredImage.size > 0) {
      console.log('Processing image upload...');
      
      // Validasi ukuran file
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (featuredImage.size > maxSize) {
        return NextResponse.json(
          { 
            error: 'File too large',
            details: `File size ${featuredImage.size} bytes exceeds maximum ${maxSize} bytes`
          },
          { status: 400 }
        );
      }

      // Validasi tipe file
      if (!featuredImage.type.startsWith('image/')) {
        return NextResponse.json(
          { 
            error: 'Invalid file type',
            details: `File type ${featuredImage.type} is not supported. Only images are allowed.`
          },
          { status: 400 }
        );
      }

      try {
        const bytes = await featuredImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const folderName = LEMBAGA_FOLDERS[lembagaId];
        console.log('Uploading image to folder:', `artikel/${folderName}`);

        // Upload ke Cloudinary dengan error handling yang lebih baik
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: `artikel/${folderName}`,
              transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { format: 'webp' }
              ],
              timeout: 60000 // 60 seconds timeout
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary error:', error);
                reject(new Error(`Cloudinary upload failed: ${error.message}`));
              } else {
                console.log('Cloudinary success:', result.secure_url);
                resolve(result);
              }
            }
          );
          
          uploadStream.end(buffer);
        });

        imageUrl = uploadResult.secure_url;
        console.log('Image uploaded successfully:', imageUrl);
        
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { 
            error: 'Failed to upload image',
            details: uploadError.message
          },
          { status: 500 }
        );
      }
    }

    // Simpan ke database dengan error handling yang lebih baik
    console.log('Saving to database...');
    
    const insertData = {
      user_id: userId,
      lembaga_id: lembagaId,
      judul: title.trim(),
      isi: content.trim(),
      gambar: imageUrl,
    };
    
    console.log('Insert data:', { ...insertData, isi: insertData.isi.substring(0, 100) + '...' });
    
    const { data, error } = await supabase
      .from('artikels')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to save article',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('Article saved successfully:', data.id);

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      data: {
        id: data.id,
        title: data.judul,
        imageUrl: data.gambar
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    
    // Provide more detailed error information
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}