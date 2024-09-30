import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, isAdmin, signOut } from '@/lib/auth';
import { getProducts, getCustomers, getOrders, updateOrderStatus, createProduct, updateProduct } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, image_url: '' });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      const adminStatus = await isAdmin();
      if (!user || !adminStatus) {
        router.push('/login');
      } else {
        setLoading(false);
        fetchData();
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = async () => {
    const [productsData, customersData, ordersData] = await Promise.all([
      getProducts(),
      getCustomers(),
      getOrders()
    ]);
    setProducts(productsData);
    setCustomers(customersData);
    setOrders(ordersData);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchData();
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    await createProduct(newProduct);
    setNewProduct({ name: '', description: '', price: 0, image_url: '' });
    fetchData();
  };

  const handleUpdateProduct = async (id, updatedData) => {
    await updateProduct(id, updatedData);
    fetchData();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProduct} className="space-y-4 mb-8">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
                <Input
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                />
                <Input
                  placeholder="Image URL"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                />
                <Button type="submit">Add Product</Button>
              </form>
              <ul>
                {products.map((product) => (
                  <li key={product.id} className="mb-4">
                    <strong>{product.name}</strong> - ${product.price}
                    <Button
                      onClick={() => handleUpdateProduct(product.id, { ...product, price: product.price + 1 })}
                      className="ml-2"
                    >
                      Increase Price
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>View customer information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {customers.map((customer) => (
                  <li key={customer.id} className="mb-2">
                    {customer.name} - {customer.email}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {orders.map((order) => (
                  <li key={order.id} className="mb-4">
                    Order #{order.id} - Status: {order.order_status}
                    <Button
                      onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                      className="ml-2"
                    >
                      Mark as Processing
                    </Button>
                    <Button
                      onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                      className="ml-2"
                    >
                      Mark as Shipped
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}