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

  const closeDropdown = () => setIsKsmOpen(false)

  return (
    <header className="shadow-md fixed top-0 left-0 w-full z-50">
      <Navbar
        fluid
        rounded
        className="border-gray-200 px-4 lg:px-10 py-2.5" 
        style={{ backgroundColor: '#f3f0e3' }}
      >
        <NavbarBrand href="/">
          <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-900">
            RW 10 Tanjung Mas
          </span>
        </NavbarBrand>

        <div className="flex items-center justify-center gap-2 lg:gap-4 lg:order-2">
          <Button
            pill
            className="text-sm px-3 py-1.5 lg:px-4 lg:py-2 bg-[#184D3B] text-white"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <NavbarLink
              as={Link}
              href="/"
              className={`text-sm lg:text-base ${
                pathname === '/'
                  ? 'text-[#184D3B] font-bold underline underline-offset-4'
                  : 'text-gray-700'
              }`}
            >
              Beranda
            </NavbarLink>

            <NavbarLink
              as={Link}
              href="/profilRW10"
              className={`text-sm lg:text-base ${
                pathname === '/profilRW10'
                  ? 'text-[#184D3B] font-bold underline underline-offset-4'
                  : 'text-gray-700'
              }`}
            >
              Profil
            </NavbarLink>

            {/* Dropdown KSM */}
            <div className="relative">
              <button
                onClick={() => setIsKsmOpen(!isKsmOpen)}
                className={`text-sm lg:text-base flex flex-row items-center gap-1 relative pl-3 lg:pl-0 hover:text-gray-900 ${
                  pathname.startsWith('/ksm')
                    ? 'text-[#184D3B] font-bold underline underline-offset-4'
                    : 'text-gray-700'
                }`}
              >
                Kelompok Swadaya Masyarakat
                {isKsmOpen ? (
                  <FiChevronUp className="text-base" />
                ) : (
                  <FiChevronDown className="text-base" />
                )}
              </button>

              {isKsmOpen && (
                <div className="absolute left-0 top-full mb-2 w-48 bg-[#f7f6ee] border rounded shadow-md z-50">
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        href="/ksm/bsmt"
                        className={`block px-4 py-2 hover:bg-[#dad8cc] text-sm ${
                          pathname === '/ksm/bsmt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeDropdown}
                      >
                        BSMT
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ksm/kwt"
                        className={`block px-4 py-2 hover:bg-bg-[#dad8cc] text-sm ${
                          pathname === '/ksm/kwt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeDropdown}
                      >
                        KWT
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ksm/ctkt"
                        className={`block px-4 py-2 hover:bg-bg-[#dad8cc] text-sm ${
                          pathname === '/ksm/ctkt'
                            ? 'text-[#184D3B] font-bold'
                            : 'text-gray-800'
                        }`}
                        onClick={closeDropdown}
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
