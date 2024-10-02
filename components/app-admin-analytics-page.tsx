import { useEffect, useState } from 'react'
import { getDashboardKPIs } from '@/lib/supabaseClient'

export function Page() {
  const [kpis, setKPIs] = useState({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 })

  useEffect(() => {
    const fetchKPIs = async () => {
      const data = await getDashboardKPIs()
      setKPIs(data)
    }
    fetchKPIs()
  }, [])

  return (
    <div>
      <h1>Analytics Page</h1>
      <div>Total Revenue: ${kpis.totalRevenue.toFixed(2)}</div>
      <div>Total Orders: {kpis.totalOrders}</div>
      <div>Average Order Value: ${kpis.averageOrderValue.toFixed(2)}</div>
    </div>
  )
}