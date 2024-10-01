import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';  // Add this import
import crypto from 'crypto';

// Initialize Supabase with your project URL and public API key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('Products')
    .select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
};

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('Products')
    .insert([productData])
    .select();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from('Products')
    .update(productData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Customers
export const createCustomer = async (customerData) => {
  const { data, error } = await supabase
    .from('Customers')
    .insert([customerData])
    .select();
  if (error) throw error;
  return data;
};

export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('Customers')
    .select('*');
  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  return data || [];
};

export const getCustomerById = async (id: string) => {
  const { data, error } = await supabase
    .from('Customers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Orders
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('Orders')
    .insert([orderData])
    .select();
  if (error) throw error;
  return data;
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('Orders')
    .select(`
      *,
      Customers (name, email),
      Products (name, price)
    `);
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data || [];
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('Orders')
    .update({ order_status: status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

// Image upload
export const uploadProductImage = async (file: File) => {
  const fileName = `${uuidv4()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);
  if (error) throw error;
  return getProductImageUrl(fileName);
};

export const getProductImageUrl = (path) => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
};

// Dashboard KPIs
export const getDashboardKPIs = async () => {
  const { data: orders, error: ordersError } = await supabase
    .from('Orders')
    .select(`
      *,
      Products (name, price)
    `);
  
  if (ordersError) throw ordersError;

  const totalRevenue = orders.reduce((sum, order) => {
    const price = order.Products?.price || 0;
    return sum + (order.quantity * price);
  }, 0);
  
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue
  };
};