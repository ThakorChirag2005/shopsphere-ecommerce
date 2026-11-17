
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { Link } from "react-router-dom";
function Cart() {
  const { cartItems, addToCart, removeFromCart } =
    useContext(CartContext);

  // Calculate Total Price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="px-8 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg">
          Your cart is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Products */}
          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-xl shadow-md"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                <div className="flex-1">

                  <h2 className="text-lg font-bold">
                    {item.name}
                  </h2>

                  <p className="text-indigo-600 font-semibold mt-2">
                    ₹{item.price}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => addToCart(item, -1)}
                      disabled={item.quantity === 1}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addToCart(item, 1)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-bold">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 mt-3 hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md h-fit">

            <h2 className="text-xl font-bold mb-5">
              Order Summary
            </h2>

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span className="text-indigo-600">
                ₹{totalPrice}
              </span>
            </div>

            <Link
                 to="/checkout"
                className="block text-center w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
             >
                 Proceed to Checkout
               </Link>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;
