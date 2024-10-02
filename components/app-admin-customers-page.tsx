import { useEffect, useState } from 'react'
import { getCustomers } from '@/lib/supabaseClient'

export function Page() {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getCustomers()
      setCustomers(data)
    }
    fetchCustomers()
  }, [])

  return (
    <div>
      <h1>Customers Page</h1>
      {/* Add a table or list to display customers */}
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  )
}