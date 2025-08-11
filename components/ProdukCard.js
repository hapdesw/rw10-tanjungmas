"use client";
import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function ProdukCard({ produk }) {
  return (
    <div className="bg-[#fbfaf6] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full pb-[100%]">
        <Image
          src={produk.gambar || "/images/default-product.jpg"}
          alt={produk.nama}
          fill
          className="object-contain bg-[#f3f0e3]" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
        />
      </div>
      
      {/* Bagian Teks (tidak berubah) */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{produk.nama}</h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-6">
          {produk.deskripsi}
        </p>
      </div>
    </div>
  );
}