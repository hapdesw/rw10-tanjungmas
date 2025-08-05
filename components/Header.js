'use client'

import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
  Button,
} from 'flowbite-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="shadow-md fixed top-0 left-0 w-full z-50">
      <Navbar
        fluid
        rounded
        className="border-gray-200 px-4 lg:px-6 py-2.5"
        style={{ backgroundColor: '#f3f0e3' }}
      >
        <NavbarBrand href="/">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900">
            RW 10 Tanjung Mas
          </span>
        </NavbarBrand>

        <div className="flex items-center justify-center lg:order-2">
            <Button pill className="mr-2 text-sm tex px-4 py-2 lg:px-5 lg:py-2.5 bg-[#184D3B]">
                <Link href="/login">Log in</Link>
            </Button>
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <NavbarLink
            as={Link}
            href="/"
            className={pathname === '/' ? 'text-[#184D3B] font-bold underline underline-offset-4' : ''}
          >
            Beranda
          </NavbarLink>
          <NavbarLink
            as={Link}
            href="/profilRW10"
            className={pathname === '/profilRW10' ? 'text-[#184D3B] font-bold underline underline-offset-4' : ''}
          >
            Profil
          </NavbarLink>
          <NavbarLink
            as={Link}
            href="/ksm"
            className={pathname === '/ksm' ? 'text-[#184D3B] font-bold underline underline-offset-4' : ''}
          >
            Kelompok Swadaya Masyarakat
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </header>
  )
}
