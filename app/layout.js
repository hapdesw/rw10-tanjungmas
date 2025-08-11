import "../styles/globals.css"
import { Inter } from "next/font/google"
import Header from '../components/Header'
import Footer from '../components/Footer'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
})

export const metadata = {
  title: "RW 10 Tanjung Mas",
  description: "Web Profile RW 10 Tanjung Mas",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#f3f0e3] text-gray-800">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-20 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}