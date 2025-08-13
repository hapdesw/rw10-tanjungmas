import AdminHeader from '../../components/AdminHeader'
import AdminGuard from '../../components/AdminGuard'

export default function RootLayout({ children }) {
  return (
    <AdminGuard>
        <AdminHeader />
            {children}
    </AdminGuard>
  )
}