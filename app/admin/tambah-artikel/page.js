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
  const [lembagaId, setLembagaId] = useState(1)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    // Debug environment variables
    setDebugInfo({
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    })

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('Auth user result:', { user: user?.id, error })
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Test API endpoint
  const testAPI = async () => {
    try {
      console.log('Testing API endpoint...')
      const response = await fetch('/api/artikel/create', {
        method: 'POST',
        body: JSON.stringify({ test: true }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Test response status:', response.status)
      const text = await response.text()
      console.log('Test response text:', text.substring(0, 200))
    } catch (error) {
      console.error('API test error:', error)
    }
  }

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
              <p className="text-gray-600 mb-4">Anda harus login untuk mengakses halaman ini.</p>
              
              {/* Debug info */}
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
                <button 
                  onClick={testAPI}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test API Endpoint
                </button>
              </div>
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
            
            {/* Debug info untuk logged in user */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
              <strong>Debug:</strong> User ID: {user.id}, Lembaga ID: {lembagaId}
              <button 
                onClick={testAPI}
                className="ml-4 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Test API
              </button>
            </div>
            
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