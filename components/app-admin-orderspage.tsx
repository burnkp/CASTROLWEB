'use client'

import React, { useEffect, useState } from 'react'
import { supabase, getOrders, updateOrderStatus } from '@/lib/supabaseClient'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Copy, MoreVertical } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Product {
  product_id: string;
  quantity: number;
  package_size: number | null;
  name?: string;
  price?: number;
  subtotal: number;
}

interface Order {
  id: string
  customer_id: string
  total_price: number
  order_status: 'Submitted' | 'Processing' | 'Paid' | 'Shipped'
  created_at: string
  updated_at: string
  products: Product[] | null
  Customers: {
    company_name: string
    name: string
    email: string
  } | null
}

const statusColors = {
  Submitted: 'bg-yellow-500 hover:bg-yellow-600',
  Processing: 'bg-blue-500 hover:bg-blue-600',
  Paid: 'bg-green-500 hover:bg-green-600',
  Shipped: 'bg-purple-500 hover:bg-purple-600',
};

export function Page() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const ordersData = await getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const formatOrderId = (id: string) => {
    return `#${id.slice(0, 4)}`
  }

  const getTotalProducts = (products: Product[] | null) => {
    if (!products) return 0;
    return products.reduce((sum, product) => sum + (product.quantity || 0), 0)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  const OrderDetails = ({ order }: { order: Order }) => {
    console.log('Full order details:', order);

    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl">Order {formatOrderId(order.id)}</CardTitle>
            <CardDescription>{new Date(order.created_at).toLocaleString()}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${statusColors[order.order_status]} text-white`}
                >
                  {order.order_status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Submitted')}>Submitted</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Processing')}>Processing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Paid')}>Paid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Shipped')}>Shipped</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Remove the three-dot button and its dropdown */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {order.Customers?.name || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {order.Customers?.email || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Company:</span> {order.Customers?.company_name || 'N/A'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Total Products:</span> {getTotalProducts(order.products)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total Price:</span> ${order.total_price?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Package Size</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products && order.products.map((product, index) => {
                  console.log('Product details:', product);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name || `Product ${index + 1}`}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.package_size || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        ${product.subtotal?.toFixed(2) || '0.00'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Order Value:</span>
            <span className="text-2xl font-bold">${order.total_price?.toFixed(2) || '0.00'}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Total Products</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>{formatOrderId(order.id)}</TableCell>
                    <TableCell>{order.Customers?.company_name || 'N/A'}</TableCell>
                    <TableCell>{getTotalProducts(order.products)}</TableCell>
                    <TableCell>${order.total_price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{order.order_status}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button onClick={() => toggleOrderExpansion(order.id)}>
                        {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <OrderDetails order={order} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}