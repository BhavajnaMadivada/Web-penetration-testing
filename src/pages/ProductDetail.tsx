
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minus, Plus, Check, ShoppingCart } from 'lucide-react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard, { Product } from '@/components/ProductCard';

// Sample products data - same as in Products.tsx
const allProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Minimalist Watch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=3180&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'accessories',
    description: 'Elegant timepiece with a clean, minimalist design perfect for any occasion. Features Japanese movement, sapphire crystal face, and a genuine leather strap. Water-resistant up to 30 meters.'
  },
  {
    id: '2',
    name: 'Premium Leather Backpack',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'bags',
    description: 'Handcrafted from genuine leather, this spacious backpack offers both style and functionality. Features multiple compartments, padded laptop sleeve, and adjustable shoulder straps for all-day comfort.'
  },
  {
    id: '3',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'electronics',
    description: 'Immerse yourself in your favorite music with these premium wireless headphones featuring active noise cancellation. Enjoy up to 30 hours of battery life, intuitive touch controls, and exceptional sound quality.'
  },
  {
    id: '4',
    name: 'Handcrafted Ceramic Mug Set',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'home',
    description: 'Set of four unique, handcrafted ceramic mugs, each with its own distinctive glaze pattern. Microwave and dishwasher safe, these 12oz mugs are perfect for your morning coffee or evening tea.'
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=3280&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'fashion',
    description: 'Soft, sustainable organic cotton t-shirt with a comfortable fit and casual style. Ethically made with eco-friendly dyes and fair labor practices. Available in multiple colors and sizes.'
  },
  {
    id: '6',
    name: 'Smart Home Speaker',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'electronics',
    description: 'Voice-controlled smart speaker with premium sound quality and intelligent assistant features. Control your smart home, play music, check the weather, and more with simple voice commands.'
  },
  {
    id: '7',
    name: 'Minimalist Wall Clock',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'home',
    description: 'Simple, elegant wall clock with a clean design that complements any interior style. Features silent quartz movement and is crafted from sustainable bamboo material.'
  },
  {
    id: '8',
    name: 'Leather Card Holder',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1607435097405-db48f377bff6?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'accessories',
    description: 'Slim, elegant card holder crafted from premium leather with multiple card slots. Perfect for minimalist everyday carry and available in various colors to match your style.'
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { increaseCartQuantity, getItemQuantity } = useShoppingCart();
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const foundProduct = allProducts.find(p => p.id === id) || null;
      setProduct(foundProduct);
      
      // Find related products (same category)
      if (foundProduct && foundProduct.category) {
        const productCategory = foundProduct.category.split(',')[0]; // Use primary category
        const related = allProducts
          .filter(p => p.id !== foundProduct.id && p.category?.includes(productCategory))
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  useEffect(() => {
    // Check if product is already in cart
    if (product) {
      setAddedToCart(getItemQuantity(product.id) > 0);
    }
  }, [product, getItemQuantity]);
  
  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      increaseCartQuantity({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    
    setAddedToCart(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Skeleton className="w-full aspect-square rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-3/4" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-medium mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">
              Continue Shopping
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-8">
          <ul className="flex items-center space-x-2">
            <li><Link to="/" className="text-gray-500 hover:text-primary">Home</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link to="/products" className="text-gray-500 hover:text-primary">Products</Link></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-serif">{product.name}</h1>
            
            <div className="text-2xl font-medium text-primary">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-gray-700">
              {product.description}
            </p>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  className="px-3 py-1 hover:bg-gray-100" 
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button 
                  className="px-3 py-1 hover:bg-gray-100" 
                  onClick={handleIncreaseQuantity}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleAddToCart}
              disabled={addedToCart}
            >
              {addedToCart ? (
                <>
                  <Check size={18} className="mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            
            {/* Product tabs */}
            <div className="pt-8">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="returns">Returns</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Product Details</h4>
                    <p className="text-gray-600">
                      {product.description}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>High-quality materials</li>
                      <li>Durable construction</li>
                      <li>Premium finish</li>
                      <li>Designed for everyday use</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Shipping Information</h4>
                    <p className="text-gray-600">
                      We ship worldwide with various delivery options:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Standard Shipping: 5-7 business days</li>
                      <li>Express Shipping: 2-3 business days</li>
                      <li>Free shipping on orders over $100</li>
                      <li>International shipping available</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="returns" className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Return Policy</h4>
                    <p className="text-gray-600">
                      We want you to be completely satisfied with your purchase:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>30-day return policy</li>
                      <li>Items must be unused and in original packaging</li>
                      <li>Return shipping covered for defective items</li>
                      <li>Exchanges available for wrong sizes</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-serif mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
