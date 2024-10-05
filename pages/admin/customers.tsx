import AdminLayout from '@/components/AdminLayout'
import { Page as CustomersPage } from '@/components/app-admin-customers-page'

export default function AdminCustomersPage() {
  return (
    <AdminLayout>
      <CustomersPage />
    </AdminLayout>
  )
}