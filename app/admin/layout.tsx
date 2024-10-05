import { SidebarComponent } from '@/components/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <SidebarComponent />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}