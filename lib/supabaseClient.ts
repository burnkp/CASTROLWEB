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
  console.log('Creating product with data:', productData)
  const { data, error } = await supabase
    .from('Products')
    .insert([{
      name: productData.name,
      description: productData.description,
      price: productData.price,
      image_url: productData.image_url,
      package_size: productData.package_size,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();
  if (error) {
    console.error('Error creating product:', error)
    throw new Error(`Failed to create product: ${error.message}`)
  }
  if (!data || data.length === 0) {
    console.error('No data returned after creating product')
    throw new Error('No data returned after creating product')
  }
  console.log('Product created successfully:', data[0])
  return data[0]
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
export const createOrder = async (orderInput) => {
  console.log('Creating order with input:', orderInput);

  // Check if the customer already exists
  const { data: existingCustomer, error: customerCheckError } = await supabase
    .from('Customers')
    .select('id')
    .eq('email', orderInput.email)
    .maybeSingle();

  if (customerCheckError) {
    console.error('Error checking for existing customer:', customerCheckError);
    throw customerCheckError;
  }

  let customer_id;

  if (existingCustomer) {
    // If the customer exists, use their ID
    customer_id = existingCustomer.id;
  } else {
    // If the customer does not exist, create a new one
    const { data: customerData, error: customerError } = await supabase
      .from('Customers')
      .insert({
        name: orderInput.customer_name,
        company_name: orderInput.company_name,
        company_nui: orderInput.company_nui,
        email: orderInput.email,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (customerError) {
      console.error('Error creating new customer:', customerError);
      throw customerError;
    }
    customer_id = customerData.id;
  }

  // Create the order
  const { data: createdOrderData, error: orderError } = await supabase
    .from('Orders')
    .insert({
      customer_id: customer_id,
      total_price: orderInput.total_price,
      order_status: 'Submitted',
      created_at: new Date().toISOString(),
      products: orderInput.products.map(product => ({
        ...product,
        price: product.price || 0  // Ensure price is included
      }))
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  console.log('Order created successfully:', createdOrderData);
  return createdOrderData;
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('Orders')
    .select(`
      *,
      Customers (name, email, company_name)
    `)
    .order('created_at', { ascending: false });
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
  console.log('Uploading product image:', file.name)
  const fileName = `${uuidv4()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  if (error) {
    console.error('Error uploading image:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
  const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
  console.log('Image uploaded successfully:', publicUrlData.publicUrl)
  return publicUrlData.publicUrl
};

export const getProductImageUrl = (path) => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
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