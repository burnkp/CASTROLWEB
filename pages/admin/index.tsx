import AdminLayout from '@/components/AdminLayout'
import { Page as AdminDashboard } from '@/components/app-admin-page'

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}