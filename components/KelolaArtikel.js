"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ActionButtons({ artikelId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleEdit = () => {
    router.push(`/admin/edit-artikel/${artikelId}`);
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;

    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/artikel/${artikelId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal menghapus artikel');
      }

      alert('Artikel berhasil dihapus!');
      router.refresh();
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex gap-2">
        <button 
          onClick={handleEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          disabled={isDeleting}
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menghapus...
            </>
          ) : 'Hapus'}
        </button>
      </div>
      
      {error && (
        <div className="mt-2">
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
            <div className="font-semibold mb-1">Error:</div>
            <div>{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}