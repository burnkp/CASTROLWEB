import React from 'react'
import { SidebarComponent } from './sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen">
      <SidebarComponent />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}