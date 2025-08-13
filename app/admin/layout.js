import AdminHeader from '../../components/AdminHeader'
import AdminGuard from '../../components/AdminGuard'
import Footer from '../../components/Footer'

export default function RootLayout({ children }) {
  return (
    <AdminGuard>
        <div className="flex flex-col min-h-screen">
          <AdminHeader />
          <main className="flex-grow pt-20 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
          <Footer />
        </div>
    </AdminGuard>
  )
}