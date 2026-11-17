
import { useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext";

function Checkout() {
  const { cartItems } = useContext(CartContext);

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

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-4">
          Thank you for shopping with ShopSphere.
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Customer Information */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md"
        >

          <h2 className="text-xl font-bold mb-6">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-3"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Enter a valid 10 digit phone number"
              className="border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              pattern="[0-9]{6}"
              title="Enter a valid 6 digit pincode"
              className="border rounded-lg px-4 py-3"
            />

          </div>

          <h2 className="text-xl font-bold mt-8 mb-6">
            Delivery Address
          </h2>

          <div className="space-y-5">

            <textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
              rows="3"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="border rounded-lg px-4 py-3"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={cartItems.length === 0}
            className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Place Order
          </button>

        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">

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
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-indigo-600">
              ₹{total}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;
