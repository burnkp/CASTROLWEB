// lib/supabaseQueries.ts

import { supabaseClient } from '../lib/supabaseClient';
import { Customer, Order, Product } from '../types/supabase';

// Fetching All Products
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabaseClient
    .from<Product>('Products')
    .select('*');
  if (error) throw error;
  return data;
};

// Fetching a Product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabaseClient
    .from<Product>('Products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Updating a Product
export const updateProduct = async (
  id: string,
  updatedData: Partial<Product>
): Promise<Product[]> => {
  const { data, error } = await supabaseClient
    .from<Product>('Products')
    .update(updatedData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Uploading an Image to Storage
export const uploadProductImage = async (
  file: File,
  productId: string
): Promise<string> => {
  const fileName = `${productId}/${file.name}`;
  const { data, error } = await supabaseClient.storage
    .from('product-images')
    .upload(fileName, file);
  if (error) throw error;
  const { data: publicURLData } = supabaseClient.storage
    .from('product-images')
    .getPublicUrl(fileName);
  return publicURLData.publicUrl;
};

// Fetching Orders with Related Data
export const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabaseClient
    .from<Order>('Orders')
    .select(`
      *,
      Customers ( name, email, company_name )
    `);
  if (error) throw error;
  return data;
};

// Updating Order Status
export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  const { data, error } = await supabaseClient
    .from('Orders')
    .update({ order_status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  return data;
};

// Other common queries and mutations can be added here...