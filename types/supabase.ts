// types/supabase.ts

// Customer Interface
export interface Customer {
    id: string;
    name?: string;
    email?: string;
    company_name?: string;
    company_nui?: string;
    phone?: string;
    city?: string;
    created_at: string;
  }
  
  // Order Interface
  export interface Order {
    id: string;
    customer_id?: string;
    product_id?: string;
    quantity?: number;
    package_size?: number;
    order_status?: 'Submitted' | 'Processing' | 'Paid' | 'Shipped';
    created_at: string;
    updated_at?: string;
    products?: any; // jsonb field, define a suitable type if possible
  }
  
  // Product Interface
  export interface Product {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    package_size?: number;
    created_at: string;
    updated_at?: string;
  }