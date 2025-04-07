
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Sample products data
const allProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Minimalist Watch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=3180&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'accessories',
    description: 'Elegant timepiece with a clean, minimalist design perfect for any occasion.'
  },
  {
    id: '2',
    name: 'Premium Leather Backpack',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'bags',
    description: 'Handcrafted from genuine leather, this spacious backpack offers both style and functionality.'
  },
  {
    id: '3',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'electronics',
    description: 'Immerse yourself in your favorite music with these premium wireless headphones featuring active noise cancellation.'
  },
  {
    id: '4',
    name: 'Handcrafted Ceramic Mug Set',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'home',
    description: 'Set of four unique, handcrafted ceramic mugs, each with its own distinctive glaze pattern.'
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=3280&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'fashion',
    description: 'Soft, sustainable organic cotton t-shirt with a comfortable fit and casual style.'
  },
  {
    id: '6',
    name: 'Smart Home Speaker',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'electronics',
    description: 'Voice-controlled smart speaker with premium sound quality and intelligent assistant features.'
  },
  {
    id: '7',
    name: 'Minimalist Wall Clock',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'home',
    description: 'Simple, elegant wall clock with a clean design that complements any interior style.'
  },
  {
    id: '8',
    name: 'Leather Card Holder',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1607435097405-db48f377bff6?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'accessories',
    description: 'Slim, elegant card holder crafted from premium leather with multiple card slots.'
  },
];

// Add "new" and "sale" categories to some products
const productsWithSpecialCategories = allProducts.map((product, index) => {
  if (index < 3) {
    return { ...product, category: product.category + ',new' };
  }
  if (index >= 3 && index < 5) {
    return { ...product, category: product.category + ',sale' };
  }
  return product;
});

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home Goods' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'bags', name: 'Bags' },
  { id: 'new', name: 'New Arrivals' },
  { id: 'sale', name: 'Sale' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState<Product[]>(productsWithSpecialCategories);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([categoryParam]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    // Reset selected categories if URL param changes
    const categoryParam = searchParams.get('category') || 'all';
    setSelectedCategories([categoryParam]);
  }, [searchParams]);

  useEffect(() => {
    const filtered = products.filter(product => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      // Filter by price range
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Filter by selected categories
      let matchesCategory = selectedCategories.includes('all');
      if (!matchesCategory && product.category) {
        const productCategories = product.category.split(',');
        matchesCategory = productCategories.some(cat => selectedCategories.includes(cat));
      }
      
      return matchesSearch && matchesPrice && matchesCategory;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, selectedCategories, products]);
  
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
      setSearchParams({});
    } else {
      setSelectedCategories(prev => 
        prev.includes('all') ? [categoryId] : 
        prev.includes(categoryId) ? 
          prev.filter(c => c !== categoryId) : 
          [...prev.filter(c => c !== 'all'), categoryId]
      );
      
      if (categoryId !== 'all') {
        setSearchParams({ category: categoryId });
      }
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 500]);
    setSelectedCategories(['all']);
    setSearchParams({});
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-4">
            {selectedCategories.includes('all') 
              ? 'All Products' 
              : categories.find(c => selectedCategories.includes(c.id))?.name}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="flex md:hidden">
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal size={16} className="mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="py-6 h-full overflow-auto">
                    <h3 className="font-medium text-lg mb-4">Filters</h3>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryChange(category.id)}
                            />
                            <Label htmlFor={`mobile-category-${category.id}`}>{category.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Price Range: ${priceRange[0]} - ${priceRange[1]}</h4>
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-6"
                      />
                    </div>
                    
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium text-lg mb-4">Filters</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range: ${priceRange[0]} - ${priceRange[1]}</h4>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-6"
                  />
                </div>
                
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
