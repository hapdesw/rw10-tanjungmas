import { Inter } from "next/font/google"
import "../styles/globals.css"

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
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
