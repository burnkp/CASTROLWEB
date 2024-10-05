import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/supabaseClient';
import { OrderDetails } from './components/order-details';
import { Order } from '@/types/supabase';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders();
      console.log('Fetched orders:', fetchedOrders);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['order_status']) => {
    console.log('Handling status update:', { orderId, newStatus });
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      console.log('Updated order:', updatedOrder);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
      console.log('Orders state updated');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {orders.map(order => (
        <OrderDetails 
          key={order.id} 
          order={order} 
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
  );
}