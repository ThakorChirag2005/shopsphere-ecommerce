
import { useState, useEffect } from "react";
import { WishlistContext } from "./WishlistContextValue";

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlistItems");

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save Wishlist in LocalStorage
  useEffect(() => {
    localStorage.setItem(
      "wishlistItems",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);

  // Add Product to Wishlist
  const addToWishlist = (product) => {
    setWishlistItems((previousItems) => {
      const alreadyExists = previousItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return previousItems;
      }

      return [...previousItems, product];
    });
  };

  // Remove Product from Wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems((previousItems) =>
      previousItems.filter((item) => item.id !== productId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
