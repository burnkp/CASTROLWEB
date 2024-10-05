import AdminLayout from '@/components/AdminLayout'
import { Page as ProductsPage } from '@/components/app-admin-products-page'

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <ProductsPage />
    </AdminLayout>
  )
}