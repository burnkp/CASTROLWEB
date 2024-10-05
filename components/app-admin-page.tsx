'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardKPIs } from '@/lib/supabaseClient'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface KPIs {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalProducts: number
  totalStock: number
  totalCustomers: number
  avgDailyRevenue: number
  revenueChange: number
  ordersChange: number
  customersChange: number
}

export function Page() {
  const [kpis, setKpis] = useState<KPIs>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    totalStock: 0,
    totalCustomers: 0,
    avgDailyRevenue: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0
  })

  useEffect(() => {
    async function fetchKPIs() {
      const data = await getDashboardKPIs()
      setKpis(data)
    }
    fetchKPIs()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const renderTrend = (value: number) => {
    const Icon = value >= 0 ? ArrowUpIcon : ArrowDownIcon
    const color = value >= 0 ? 'text-green-600' : 'text-red-600'
    return (
      <div className={`flex items-center ${color}`}>
        <Icon className="w-4 h-4 mr-1" />
        <span>{Math.abs(value).toFixed(2)}%</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            {renderTrend(kpis.revenueChange)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
            <Progress value={kpis.revenueChange} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            {renderTrend(kpis.ordersChange)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalOrders}</div>
            <Progress value={kpis.ordersChange} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.averageOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalStock} Liters</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            {renderTrend(kpis.customersChange)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalCustomers}</div>
            <Progress value={kpis.customersChange} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.avgDailyRevenue)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}