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
import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function Header() {
  const pathname = usePathname()
  const [isKsmOpen, setIsKsmOpen] = useState(false)
  const [isProdukOpen, setIsProdukOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false) // State untuk toggle navbar

  const closeAll = () => {
    setIsKsmOpen(false)
    setIsProdukOpen(false)
    setIsNavOpen(false) // Menutup navbar collapse
  }

  return (
    <header className="shadow-md fixed top-0 left-0 w-full z-50">
      <Navbar
        fluid
        rounded
        className="border-gray-200 px-4 lg:px-10 py-2.5"
        style={{ backgroundColor: '#f3f0e3' }}
      >
        <NavbarBrand href="/">
          <span className="self-center text-lg font-semibold whitespace-nowrap text-[#184D3B]">
            RW 10 Tanjung Mas
          </span>
        </NavbarBrand>

        <div className="flex items-center justify-center gap-2 lg:gap-4 lg:order-2">
          <Button
            pill
            className="text-sm px-3 py-1.5 lg:px-4 lg:py-2 bg-[#184D3B] text-white"
          >
            <Link href="/login">Login Admin</Link>
          </Button>
          <NavbarToggle onClick={() => setIsNavOpen(!isNavOpen)} />
        </div>

        <NavbarCollapse className={isNavOpen ? 'block' : 'hidden'}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-6">
            <NavbarLink
              as={Link}
              href="/"
              className={`text-sm lg:text-base py-2 ${
                pathname === '/'
                  ? 'text-[#184D3B] font-bold underline underline-offset-4'
                  : 'text-gray-700'
              }`}
              onClick={closeAll}
            >
              Beranda
            </NavbarLink>

            <NavbarLink
              as={Link}
              href="/profilRW10"
              className={`text-sm lg:text-base py-2 ${
                pathname === '/profilRW10'
                  ? 'text-[#184D3B] font-bold underline underline-offset-4'
                  : 'text-gray-700'
              }`}
              onClick={closeAll}
            >
              Profil
            </NavbarLink>

            {/* Dropdown KSM */}
            <div className="relative">
              <button
                onClick={() => setIsKsmOpen(!isKsmOpen)}
                className={`text-sm lg:text-base w-full text-left flex justify-between items-center py-2 px-3 lg:px-0 hover:text-gray-900 ${
                  pathname.startsWith('/ksm')
                    ? 'text-[#184D3B] font-bold underline underline-offset-4'
                    : 'text-gray-700'
                }`}
              >
                Kelompok Swadaya Masyarakat
                {isKsmOpen ? (
                  <FiChevronUp className="text-base ml-1" />
                ) : (
                  <FiChevronDown className="text-base ml-1" />
                )}
              </button>

              {isKsmOpen && (
                <div className="lg:absolute lg:left-0 lg:top-full lg:mb-2 w-full lg:w-48 bg-[#f7f6ee] lg:border lg:rounded lg:shadow-md z-50">
                  <ul className="flex flex-col pl-4 lg:pl-0">
                    <li>
                      <Link
                        href="/ksm/bsmt"
                        className={`block px-3 py-2 hover:bg-[#dad8cc] text-sm ${
                          pathname === '/ksm/bsmt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeAll}
                      >
                        BSMT
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ksm/kwt"
                        className={`block px-3 py-2 hover:bg-[#dad8cc] text-sm ${
                          pathname === '/ksm/kwt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeAll}
                      >
                        KWT
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ksm/ctkt"
                        className={`block px-3 py-2 hover:bg-[#dad8cc] text-sm ${
                          pathname === '/ksm/ctkt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeAll}
                      >
                        CTKT
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Dropdown Produk */}
            <div className="relative">
              <button
                onClick={() => setIsProdukOpen(!isProdukOpen)}
                className={`text-sm lg:text-base w-full text-left flex justify-between items-center py-2 px-3 lg:px-0 hover:text-gray-900 ${
                  pathname.startsWith('/produk')
                    ? 'text-[#184D3B] font-bold underline underline-offset-4'
                    : 'text-gray-700'
                }`}
              >
                Produk
                {isProdukOpen ? (
                  <FiChevronUp className="text-base ml-1" />
                ) : (
                  <FiChevronDown className="text-base ml-1" />
                )}
              </button>

              {isProdukOpen && (
                <div className="lg:absolute lg:left-0 lg:top-full lg:mb-2 w-full lg:w-48 bg-[#f7f6ee] lg:border lg:rounded lg:shadow-md z-50">
                  <ul className="flex flex-col pl-4 lg:pl-0">
                    <li>
                      <Link
                        href="/produk/bsmt"
                        className={`block px-3 py-2 hover:bg-[#dad8cc] text-sm ${
                          pathname === '/produk/bsmt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeAll}
                      >
                        BSMT
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/produk/kwt"
                        className={`block px-3 py-2 hover:bg-[#dad8cc] text-sm ${
                          pathname === '/produk/kwt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeAll}
                      >
                        KWT
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/produk/ctkt"
                        className={`block px-3 py-2 hover:bg-[#dad8cc] text-sm ${
                          pathname === '/produk/ctkt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeAll}
                      >
                        CTKT
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </NavbarCollapse>
      </Navbar>
    </header>
  )
}