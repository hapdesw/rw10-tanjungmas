import "../styles/globals.css"
import { Inter } from "next/font/google"
import Header from '../components/Header'
import Footer from '../components/Footer'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata = {
  title: "RW 10 Tanjung Mas",
  description: "Web Profile RW 10 Tanjung Mas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased bg-[#f3f0e3]">
        <Header />
        <main className="pt-20 min-h-screen px-2">{children}</main>
        <Footer />
      </body>
    </html>
  )
}