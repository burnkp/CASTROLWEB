import React from 'react'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Dashboard, People, ShoppingCart, Inventory, BarChart } from '@mui/icons-material'
import Link from 'next/link'

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, href: '/admin' },
  { text: 'Customers', icon: <People />, href: '/admin/customers' },
  { text: 'Orders', icon: <ShoppingCart />, href: '/admin/orders' },
  { text: 'Products', icon: <Inventory />, href: '/admin/products' },
  { text: 'Analytics', icon: <BarChart />, href: '/admin/analytics' },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <Link href={item.href} key={item.text} passHref>
              <ListItem button component="a">
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}