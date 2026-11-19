
export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Men's T-Shirt",
    price: 799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    rating: 4.0,
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 2999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Backpack",
    price: 1499,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    rating: 4.3,
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    rating: 4.1,
  },
];

export function getStoreProducts() {
  try {
    const savedProducts = localStorage.getItem("adminProducts");
    if (!savedProducts) {
      return products.map((product) => ({
        ...product,
        stock: 25,
      }));
    }

    const parsedProducts = JSON.parse(savedProducts);
    if (!Array.isArray(parsedProducts)) {
      return products;
    }

    return parsedProducts.map((product) => ({
      ...product,
      id: Number(product.id),
      price: Number(product.price),
      stock: Number(product.stock || 0),
      rating: Number(product.rating || 4),
      image: product.image || "",
    }));
  } catch (error) {
    console.error("Unable to load storefront products:", error);
    return products;
  }
}
