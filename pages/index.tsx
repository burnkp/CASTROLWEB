'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase, getProducts, createOrder, getProductImageUrl } from '@/lib/supabaseClient'

export default function Page() {
  const [products, setProducts] = useState<{ id: number, name: string, description: string, price: number, image_url?: string, package_size?: number }[]>([])
  const [cart, setCart] = useState<{ id: number, quantity: number, package_size?: number }[]>([])
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [orderConfirmation, setOrderConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    companyNUI: '',
    email: '',
  })
  const [imageError, setImageError] = useState<{[key: number]: boolean}>({})

  useEffect(() => {
    fetchProducts();
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      console.log('Fetched products:', JSON.stringify(data, null, 2));
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set to empty array in case of error
    }
  }

  const addToCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        const product = products.find(p => p.id === productId)
        return [...prevCart, { id: productId, quantity: 1, package_size: product?.package_size }]
      }
    })
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0)

  const getTotalPrice = () =>
    cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        customer_name: formData.name,
        company_name: formData.companyName,
        company_nui: formData.companyNUI,
        email: formData.email,
        total_price: getTotalPrice(),
        products: cart.map(item => {
          const product = products.find(p => p.id === item.id);
          return {
            product_id: item.id,
            quantity: item.quantity,
            package_size: item.package_size,
            subtotal: product ? product.price * item.quantity : 0
          };
        })
      };
      console.log('Submitting order data:', orderData);
      const data = await createOrder(orderData);
      console.log('Order submitted successfully:', data);
      setOrderConfirmation(true);
      setShowCheckoutForm(false);
      setShowOrderSummary(false);
      setCart([]);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred while submitting the order. Please try again.');
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <div className="w-full h-40 bg-gray-300">
        {/* Placeholder for banner image */}
      </div>

      {/* Header (Navbar) */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/placeholder.svg" alt="Logo" width={50} height={50} />
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:text-primary">Home</a></li>
              <li><a href="/products" className="hover:text-primary">Products</a></li>
              <li><a href="/contact" className="hover:text-primary">Contact</a></li>
            </ul>
          </nav>
          <div className="flex items-center">
            <div className="relative mr-4">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <Button>Order Now</Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Product Grid */}
        {!showOrderSummary && !showCheckoutForm && !orderConfirmation && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Image 
                    src={getProductImageUrl(product.image_url)}
                    alt={product.name} 
                    width={200} 
                    height={200} 
                    className="mx-auto" 
                    onError={(e) => {
                      console.error('Image load error for product:', product.name, product.image_url);
                      setImageError({...imageError, [product.id]: true});
                    }}
                    style={{display: imageError[product.id] ? 'none' : 'block'}}
                  />
                  {imageError[product.id] && (
                    <div className="w-[200px] h-[200px] bg-gray-200 flex items-center justify-center mx-auto">
                      <span>Image not available</span>
                    </div>
                  )}
                  <p className="mt-2 text-lg font-bold">${product.price.toFixed(2)}</p>
                  {product.package_size && <p>Package Size: {product.package_size}</p>}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => addToCart(product.id)} className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Proceed to Order Button */}
        {getTotalItems() > 0 && !showOrderSummary && !showCheckoutForm && !orderConfirmation && (
          <div className="mt-8 text-center">
            <Button onClick={() => setShowOrderSummary(true)}>Proceed to Order</Button>
          </div>
        )}

        {/* Interactive Order Summary */}
        {showOrderSummary && !showCheckoutForm && !orderConfirmation && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {cart.map(item => {
              const product = products.find(p => p.id === item.id)
              return product ? (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{product.name}</span>
                  <div>
                    <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    <span className="ml-4">${(product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ) : null
            })}
            <div className="mt-4 text-xl font-bold">Total: ${getTotalPrice().toFixed(2)}</div>
            <Button onClick={() => setShowCheckoutForm(true)} className="mt-4">Proceed to Checkout</Button>
          </div>
        )}

        {/* Interactive Checkout Form */}
        {showCheckoutForm && !orderConfirmation && (
          <form onSubmit={handleSubmitOrder} className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyNUI">Company NUI</Label>
              <Input
                id="companyNUI"
                value={formData.companyNUI}
                onChange={(e) => setFormData({ ...formData, companyNUI: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Submit Order</Button>
          </form>
        )}

        {/* Order Confirmation */}
        {orderConfirmation && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
            <p>Your order has been successfully placed.</p>
            <p className="mt-4">We will contact you shortly at {formData.email} with further instructions.</p>
            <Button onClick={() => {
              setOrderConfirmation(false);
              setFormData({ name: '', companyName: '', companyNUI: '', email: '' });
            }} className="mt-4">
              Place Another Order
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/">Home</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/admin">Admin Panel</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Info</h3>
              <p>123 Lubricant Street, Oil City, LB 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@lubricantoils.com</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 Castrol Lubricants. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}