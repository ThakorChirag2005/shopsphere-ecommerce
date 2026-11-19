
import { useContext, useState } from "react";
import { CartContext } from "../../../context/CartContextValue";
import { Link, useNavigate } from "react-router-dom";

const TAX_RATE = 0.05;
const SHIPPING_RATES = {
  standard: 50,
  express: 100,
};

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Delivery Option
  const [deliveryOption, setDeliveryOption] = useState("standard");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping =
    cartItems.length > 0 ? SHIPPING_RATES[deliveryOption] : 0;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  // Handle Form Changes
  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Order Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Add products before checking out.");
      return;
    }

    const newOrder = {
      id: Date.now(),
      customer: formData,
      items: cartItems,
      subtotal: subtotal,
      deliveryOption: deliveryOption,
      shipping: shipping,
      tax: tax,
      total: total,
      date: new Date().toLocaleDateString(),
      status: "Processing",
    };

    try {
      const savedOrders = localStorage.getItem("orders");
      const previousOrders = savedOrders ? JSON.parse(savedOrders) : [];

      if (!Array.isArray(previousOrders)) {
        throw new Error("Saved orders must be an array.");
      }

      localStorage.setItem(
        "orders",
        JSON.stringify([...previousOrders, newOrder])
      );

      const savedProducts = localStorage.getItem("adminProducts");
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        if (Array.isArray(products)) {
          const purchasedQuantities = new Map();
          cartItems.forEach((item) => {
            purchasedQuantities.set(
              Number(item.id),
              (purchasedQuantities.get(Number(item.id)) || 0) +
                Number(item.quantity || 1)
            );
          });

          localStorage.setItem(
            "adminProducts",
            JSON.stringify(
              products.map((product) => {
                const purchased =
                  purchasedQuantities.get(Number(product.id)) || 0;
                return {
                  ...product,
                  stock: Math.max(
                    0,
                    Number(product.stock || 0) - purchased
                  ),
                };
              })
            )
          );

          const savedInventory = localStorage.getItem("adminInventory");
          if (savedInventory) {
            const inventory = JSON.parse(savedInventory);
            if (Array.isArray(inventory)) {
              localStorage.setItem(
                "adminInventory",
                JSON.stringify(
                  inventory.map((item) => {
                    const purchased =
                      purchasedQuantities.get(Number(item.id)) || 0;
                    return {
                      ...item,
                      stock: Math.max(
                        0,
                        Number(item.stock || 0) - purchased
                      ),
                    };
                  })
                )
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Unable to save the order.", error);
      setErrorMessage(
        "We could not save your order. Your cart has not been cleared. Please try again."
      );
      return;
    }

    clearCart();
    setOrderId(newOrder.id);
    setOrderPlaced(true);
  };

  // Order Confirmation
  if (orderPlaced) {
    return (
      <div className="mx-auto min-h-[60vh] w-full max-w-[1280px] px-5 py-20 text-center sm:px-8">
        <h1 className="text-3xl font-bold text-emerald-700">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-slate-600">
          Thank you for shopping with ShopSphere.
        </p>

        <p className="mt-2 text-slate-500">
          Order reference: #{orderId}
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-6 min-h-11 rounded-xl bg-rose-900 px-6 py-3 font-semibold text-white transition hover:bg-rose-950"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto min-h-[60vh] w-full max-w-[1280px] px-5 py-10 text-center sm:px-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <p className="text-slate-600">Your cart is empty.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-rose-900 px-6 py-3 font-semibold text-white transition hover:bg-rose-950"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-9 sm:px-8 sm:py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">

        {/* Checkout Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7 lg:col-span-2"
        >
          <h2 className="text-xl font-bold mb-6">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
            />

            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
            />

            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Enter a valid 10 digit phone number"
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
            />

            <input
              type="text"
              name="pincode"
              autoComplete="postal-code"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              pattern="[0-9]{6}"
              title="Enter a valid 6 digit pincode"
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
            />
          </div>

          {/* Delivery Address */}
          <h2 className="text-xl font-bold mt-8 mb-6">
            Delivery Address
          </h2>

          <div className="space-y-5">
            <textarea
              name="address"
              autoComplete="street-address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
              rows="3"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
              />

              <input
                type="text"
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
              />
            </div>
          </div>

          {/* Delivery Option */}
          <h2 className="text-xl font-bold mt-8 mb-6">
            Delivery Option
          </h2>

          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-rose-800">
              <input
                type="radio"
                name="delivery"
                value="standard"
                checked={deliveryOption === "standard"}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="size-4 accent-rose-800"
              />

              <span>Standard Delivery - ₹{SHIPPING_RATES.standard}</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-rose-800">
              <input
                type="radio"
                name="delivery"
                value="express"
                checked={deliveryOption === "express"}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="size-4 accent-rose-800"
              />

              <span>Express Delivery - ₹{SHIPPING_RATES.express}</span>
            </label>
          </div>

          {errorMessage && (
            <p role="alert" className="mt-5 text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={cartItems.length === 0}
            className="mt-8 min-h-12 w-full rounded-xl bg-rose-900 py-3 font-semibold text-white transition hover:bg-rose-950 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-3 mb-4"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span className="font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr className="my-4 border-slate-200" />

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Shipping</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Estimated tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <hr className="my-4 border-slate-200" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-rose-800">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
