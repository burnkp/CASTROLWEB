import React, { useState, useEffect } from 'react';
import { Order } from '@/types/supabase';
import { updateOrderStatus } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the status colors
const statusColors = {
  Submitted: 'bg-yellow-500 hover:bg-yellow-600',
  Processing: 'bg-blue-500 hover:bg-blue-600',
  Paid: 'bg-green-500 hover:bg-green-600',
  Shipped: 'bg-purple-500 hover:bg-purple-600',
};

type OrderDetailsProps = {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: Order['order_status']) => void;
};

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onStatusUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState<Order['order_status']>(order.order_status || 'Submitted');

  useEffect(() => {
    setCurrentStatus(order.order_status || 'Submitted');
  }, [order.order_status]);

  const handleStatusChange = async (newStatus: Order['order_status']) => {
    console.log('Attempting to change status to:', newStatus);
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      console.log('Order status updated:', updatedOrder);
      setCurrentStatus(updatedOrder.order_status);
      onStatusUpdate(order.id, updatedOrder.order_status);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className={`${statusColors[currentStatus]} text-white`}
            >
              {currentStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusChange('Submitted')}>
              Submitted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Processing')}>
              Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Paid')}>
              Paid
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Shipped')}>
              Shipped
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Add your order details here */}
    </div>
  );
};