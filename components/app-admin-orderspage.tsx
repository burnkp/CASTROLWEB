'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'  // Update this line
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Package2, Home, ShoppingCart, Users2, LineChart } from 'lucide-react'

interface Order {
  id: string
  customer_id: string
  product_id: string
  quantity: number
  package_size: number
  order_status: 'Submitted' | 'Processing' | 'Paid' | 'Shipped'
  created_at: string
  updated_at: string
}

export function Page() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center space-x-2 text-lg font-semibold mb-6">
            <Package2 className="h-6 w-6" />
            <span>CASTROL</span>
          </Link>
          <Link href="/admin" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200">
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-2 p-2 rounded-lg bg-gray-200">
            <ShoppingCart className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link href="/admin/customers" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200">
            <Users2 className="h-5 w-5" />
            <span>Customers</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200">
            <LineChart className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Package Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer_id}</TableCell>
                    <TableCell>{order.product_id}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.package_size}</TableCell>
                    <TableCell>{order.order_status}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                    <TableCell>{order.updated_at ? new Date(order.updated_at).toLocaleString() : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}