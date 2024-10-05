import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Home, ShoppingCart, Package, Users, BarChart } from "lucide-react"

export function SidebarComponent() {
  const router = useRouter()

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/admin" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Customers", icon: Users, href: "/admin/customers" },
    { name: "Analytics", icon: BarChart, href: "/admin/analytics" },
  ]

  return (
    <div className="flex h-screen w-64 flex-col bg-[#00693E]">
      <div className="flex h-16 items-center bg-[#004D2E] px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
          <Package className="h-6 w-6" />
          <span className="text-lg">OIL KS</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out ${
              router.pathname === item.href ? 'bg-[#005A34]' : 'hover:bg-[#005A34]'
            }`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
        {/* This space is intentionally left blank to maintain the original sidebar length */}
      </div>
    </div>
  )
}