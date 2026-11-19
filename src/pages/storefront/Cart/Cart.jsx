
import { useContext } from "react";
import { CartContext } from "../../../context/CartContextValue";
import { Link } from "react-router-dom";

const SHIPPING_CHARGE = 50;
const TAX_RATE = 0.05;

function Cart() {
  const { cartItems, addToCart, removeFromCart } =
    useContext(CartContext);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? SHIPPING_CHARGE : 0;
  const tax = subtotal * TAX_RATE;
  const orderTotal = subtotal + shipping + tax;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-9 sm:px-8 sm:py-12">

      <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-lg text-slate-500">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-rose-900 px-6 py-3 font-semibold text-white transition hover:bg-rose-950"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">

          {/* Cart Products */}
          <div className="space-y-4 lg:col-span-2">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 flex-col items-center gap-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:p-5"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="size-28 shrink-0 rounded-xl bg-slate-100 object-cover"
                />

                <div className="flex-1">

                  <h2 className="text-lg font-bold text-slate-900">
                    {item.name}
                  </h2>

                  <p className="mt-2 font-semibold text-rose-800">
                    ₹{item.price}
                  </p>

                  {/* Quantity */}
                  <div className="mt-3 flex items-center gap-3">

                    <button
                      type="button"
                      onClick={() => addToCart(item, -1)}
                      disabled={item.quantity === 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="grid size-9 min-h-0 place-items-center rounded-lg bg-slate-100 px-2 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => addToCart(item, 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="grid size-9 min-h-0 place-items-center rounded-lg bg-slate-100 px-2 text-slate-700 transition hover:bg-slate-200"
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="shrink-0 text-right">

                  <p className="font-bold">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="mt-3 font-medium text-red-600 transition hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold mb-5">
              Order Summary
            </h2>

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Estimated shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Estimated tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <hr className="my-4 border-slate-200" />

            <div className="flex justify-between text-lg font-bold">
              <span>Order total</span>

              <span className="text-rose-800">
                ₹{orderTotal.toFixed(2)}
              </span>
            </div>

            <Link
                 to="/checkout"
                className="mt-6 block min-h-12 w-full rounded-xl bg-rose-900 py-3 text-center font-semibold text-white transition hover:bg-rose-950"
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
