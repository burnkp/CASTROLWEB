import AdminLayout from '@/components/AdminLayout'
import { Page as OrdersPage } from '@/components/app-admin-orderspage'

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrdersPage />
    </AdminLayout>
  )
}