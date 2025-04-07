
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { debugLog } from '@/utils/debug';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShoppingCartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (item: Omit<CartItem, 'quantity'>) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartItems: CartItem[];
  cartQuantity: number;
  cartTotal: number;
}

// Create a default context value to avoid the "must be used within Provider" error
// This also helps with testing and SSR scenarios
const defaultContextValue: ShoppingCartContextType = {
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  getItemQuantity: () => 0,
  increaseCartQuantity: () => {},
  decreaseCartQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartItems: [],
  cartQuantity: 0,
  cartTotal: 0
};

const ShoppingCartContext = createContext<ShoppingCartContextType>(defaultContextValue);

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    debugLog("ShoppingCartContext", "Context used outside provider!", new Error().stack);
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);

  // Log component mounting
  useEffect(() => {
    debugLog("ShoppingCartContext", "Provider mounted");
    // Mark context as initialized
    setIsInitialized(true);
    return () => {
      debugLog("ShoppingCartContext", "Provider unmounting");
    };
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    debugLog("ShoppingCartContext", "Loading cart from localStorage");
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        debugLog("ShoppingCartContext", "Cart loaded successfully", { itemCount: parsedCart.length });
      } catch (e) {
        debugLog("ShoppingCartContext", "Error parsing cart data from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      debugLog("ShoppingCartContext", "Saving cart to localStorage", { itemCount: cartItems.length });
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
  
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const openCart = () => {
    debugLog("ShoppingCartContext", "Opening cart...");
    // Force state update to happen in next tick to avoid React batching issues
    setTimeout(() => {
      setIsOpen(true);
      debugLog("ShoppingCartContext", "Cart opened, isOpen:", true);
    }, 0);
  };
  
  const closeCart = () => {
    debugLog("ShoppingCartContext", "Closing cart...");
    setIsOpen(false);
    debugLog("ShoppingCartContext", "Cart closed, isOpen:", false);
  };

  function getItemQuantity(id: string) {
    return cartItems.find(item => item.id === id)?.quantity || 0;
  }
  
  function increaseCartQuantity(item: Omit<CartItem, 'quantity'>) {
    debugLog("ShoppingCartContext", "Increasing quantity", item);
    setCartItems(currItems => {
      const existingItem = currItems.find(i => i.id === item.id);
      
      if (!existingItem) {
        toast({
          title: 'Added to cart',
          description: `${item.name} has been added to your cart.`
        });
        return [...currItems, { ...item, quantity: 1 }];
      } else {
        toast({
          description: `${item.name} quantity updated.`
        });
        return currItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
    });
  }
  
  function decreaseCartQuantity(id: string) {
    debugLog("ShoppingCartContext", "Decreasing quantity", { id });
    setCartItems(currItems => {
      const item = currItems.find(i => i.id === id);
      
      if (item?.quantity === 1) {
        return currItems.filter(i => i.id !== id);
      } else if (item) {
        return currItems.map(i => 
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      
      return currItems;
    });
  }
  
  function removeFromCart(id: string) {
    debugLog("ShoppingCartContext", "Removing from cart", { id });
    setCartItems(currItems => {
      const item = currItems.find(i => i.id === id);
      if (item) {
        toast({
          description: `${item.name} removed from your cart.`
        });
      }
      return currItems.filter(i => i.id !== id);
    });
  }
  
  function clearCart() {
    debugLog("ShoppingCartContext", "Clearing cart");
    setCartItems([]);
    toast({
      description: 'Your cart has been cleared.'
    });
  }

  const contextValue: ShoppingCartContextType = {
    isOpen,
    openCart,
    closeCart,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    clearCart,
    cartItems,
    cartQuantity,
    cartTotal
  };

  debugLog("ShoppingCartContext", "Rendering provider", { cartItems: cartItems.length, isOpen });

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
};
