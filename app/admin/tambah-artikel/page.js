'use client';

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TambahArtikelPage() {
  const [user, setUser] = useState(null)
  const [lembagaId, setLembagaId] = useState(1) // Default ke 1 (RW10), bisa diubah sesuai kebutuhan
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <section className="bg-[#f3f0e3] py-8 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-[#fbfaf6] rounded-xl shadow-lg p-6 sm:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="bg-[#f3f0e3] py-8 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-[#fbfaf6] rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
              <p className="text-gray-600">Anda harus login untuk mengakses halaman ini.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f3f0e3] py-8 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-[#fbfaf6] rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#184D3B] mb-2">Tambah Artikel</h1>
            <p className="text-gray-600">Buat artikel baru untuk lembaga Anda</p>
            
            {/* Dropdown untuk memilih lembaga */}
            <div className="mt-4">
              <label htmlFor="lembaga-select" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Lembaga
              </label>
              <select
                id="lembaga-select"
                value={lembagaId}
                onChange={(e) => setLembagaId(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>RW 10</option>
                <option value={2}>BSMT</option>
                <option value={3}>KWT Agro Tanjung</option>
                <option value={4}>CTKT</option>
              </select>
            </div>
          </div>
          
          <SimpleEditor 
            userId={user.id} 
            lembagaId={lembagaId}
          />
        </div>
      </div>
    </section>
  )
}