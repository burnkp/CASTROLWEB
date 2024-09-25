import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with your project URL and public API key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions
export const getProducts = async () => {
  const { data, error } = await supabase.from('Products').select('*');
  if (error) throw error;
  return data;
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase.from('Orders').insert([orderData]);
  if (error) throw error;
  return data;
};

export const uploadProductImage = async (file, fileName) => {
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);
  if (error) throw error;
  return data;
};

export const getProductImageUrl = (path?: string) => {
  if (!path) return '/placeholder.svg';
  // If the path is already a full URL, return it as is
  if (path.startsWith('http')) {
    console.log('Generated image URL:', path);
    return path;
  }
  // Otherwise, construct the URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl;
  console.log('Generated image URL:', url);
  return url;
};