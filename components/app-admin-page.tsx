'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardKPIs } from '@/lib/supabaseClient'

export function Page() {
  const [kpis, setKpis] = useState({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, totalProducts: 0, totalStock: 0, totalCustomers: 0, avgDailyRevenue: 0 })

  useEffect(() => {
    async function fetchKPIs() {
      const data = await getDashboardKPIs()
      setKpis(data)
    }
    fetchKPIs()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${kpis.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{kpis.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${kpis.averageOrderValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{kpis.totalProducts}</p>
            <p className="text-sm text-gray-500">+100.00% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{kpis.totalStock} Liters</p>
            <p className="text-sm text-gray-500">+5.0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{kpis.totalCustomers}</p>
            <p className="text-sm text-gray-500">+100.00% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${kpis.avgDailyRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">+100.00% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* You can add more sections here as needed */}
    </div>
  )
}