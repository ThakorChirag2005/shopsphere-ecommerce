
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Get Cart Data from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save Cart Data in LocalStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Product to Cart
  const addToCart = (product, quantity = 1) => {
    if (quantity <= 0 && !cartItems.some((item) => item.id === product.id)) {
      return;
    }

    setCartItems((previousItems) => {
      const existingProduct = previousItems.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + quantity),
              }
            : item
        );
      }

      return [...previousItems, { ...product, quantity }];
    });
  };

  // Remove Product from Cart
  const removeFromCart = (productId) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => item.id !== productId)
    );
  };

  // Clear Entire Cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
