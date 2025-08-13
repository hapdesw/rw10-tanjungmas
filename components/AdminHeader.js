'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
  Button,
} from 'flowbite-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiLogOut } from 'react-icons/fi'
import { supabase } from '/lib/supabase/supabase';

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isKsmOpen, setIsKsmOpen] = useState(false)
  const [isProdukOpen, setIsProdukOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  const closeAll = () => {
    setIsKsmOpen(false)
    setIsProdukOpen(false)
    setIsNavOpen(false)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/login')
    }
  }

  return (
    <header className="shadow-md fixed top-0 left-0 w-full z-50">
      <Navbar
        fluid
        rounded
        className="border-gray-200 px-4 lg:px-10 py-2.5"
        style={{ backgroundColor: '#f3f0e3' }}
      >
        <NavbarBrand href="/admin/kelolaartikel">
          <span className="self-center text-lg font-semibold whitespace-nowrap text-[#184D3B]">
            Admin RW 10 Tanjung Mas
          </span>
        </NavbarBrand>
        <div className="flex items-center lg:order-2">
          {/* Tombol Logout hanya tampil di desktop */}
          <div className="hidden lg:block">
            <Button
              pill
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 lg:px-4 lg:py-2 bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
            >
              <FiLogOut className="text-sm" />
              Logout
            </Button>
          </div>
          <NavbarToggle onClick={() => setIsNavOpen(!isNavOpen)} />
        </div>

        <NavbarCollapse className={isNavOpen ? 'block' : 'hidden'}>

          {/* Tombol Logout untuk mobile */}
          <div className="lg:hidden mb-3">
            <Button
              pill
              size="md"
              onClick={handleLogout}
              className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
            >
              <FiLogOut className="text-sm" />
              Logout
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-6">
            <NavbarLink
              as={Link}
              href="/admin/kelolaartikel" 
              className={`text-sm lg:text-base py-2 ${
                pathname === '/admin/kelolaartikel'
                  ? 'text-[#184D3B] font-bold underline underline-offset-4'
                  : 'text-gray-700'
              }`}
              onClick={closeAll}
            >
              Kelola Artikel
            </NavbarLink>
          </div>
        </NavbarCollapse>
      </Navbar>
    </header>
  )
}