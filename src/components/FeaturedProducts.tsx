
import React from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

// Sample products data
const featuredProducts = [
  {
    id: '1',
    name: 'Modern Minimalist Watch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=3180&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'accessories'
  },
  {
    id: '2',
    name: 'Premium Leather Backpack',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'bags'
  },
  {
    id: '3',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'electronics'
  },
  {
    id: '4',
    name: 'Handcrafted Ceramic Mug Set',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'home'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif">Featured Products</h2>
          <Link to="/products" className="text-primary hover:underline">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
