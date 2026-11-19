
import { useNavigate } from "react-router-dom";
import { getStoreProducts } from "../../../data/products";

function Home() {
  const navigate = useNavigate();
  const storeProducts = getStoreProducts();
  const categories = [
    ...new Set(storeProducts.map((product) => product.category)),
  ].slice(0, 4);
  const featuredProducts = storeProducts.slice(0, 4);

  return (
    <div className="bg-[#fffaf7]">

      <section className="px-6 py-16 md:px-12 lg:px-20">

        <div className="grid items-center gap-12 rounded-3xl bg-gradient-to-r from-rose-100 via-pink-50 to-orange-50 p-8 md:p-14 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <span className="inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm">
              ✨ New Collection 2026
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
              Discover Your
              <span className="block text-rose-700">
                Perfect Style
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 md:text-lg">
              Explore our exclusive collection of premium products.
              Find your favorites and enjoy shopping with ShopSphere.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/products")}
                className="rounded-xl bg-rose-700 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-rose-800"
              >
                Shop Now →
              </button>

              <button
                onClick={() => navigate("/products")}
                className="rounded-xl border border-rose-700 px-7 py-3.5 font-semibold text-rose-700 transition hover:bg-rose-700 hover:text-white"
              >
                Explore Collection
              </button>

            </div>

            <div className="mt-10 flex gap-8">

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  10K+
                </h3>
                <p className="text-sm text-gray-500">
                  Happy Customers
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  500+
                </h3>
                <p className="text-sm text-gray-500">
                  Premium Products
                </p>
              </div>

            </div>

          </div>

          {/* Right Image */}
          <div className="relative">

            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-rose-200 blur-2xl">
            </div>

            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
              alt="ShopSphere Shopping Collection"
              className="relative h-[350px] w-full rounded-3xl object-cover shadow-2xl md:h-[480px]"
            />

            <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-sm font-semibold text-gray-500">
                Your Style, Your Choice
              </p>
              <h3 className="mt-1 text-lg font-bold text-rose-700">
                Shop the Latest Trends
              </h3>
            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-10 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-700">
              Shop by category
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Explore popular collections
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                navigate(`/products?category=${encodeURIComponent(category)}`)
              }
              className="min-h-24 rounded-2xl border border-rose-100 bg-white p-5 text-left font-bold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-rose-300 hover:text-rose-800 hover:shadow-lg"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-10 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-700">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Customer favorites
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="rounded-lg text-sm font-bold text-rose-700 hover:underline"
          >
            View all products
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => navigate(`/products/${product.id}`)}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-44 w-full object-contain p-3"
                />
              ) : (
                <div className="grid h-44 place-items-center bg-slate-100 text-slate-400">
                  No image
                </div>
              )}
              <div className="p-4">
                <p className="font-bold text-slate-800">{product.name}</p>
                <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                <p className="mt-3 font-bold text-rose-800">₹{product.price}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-rose-900 px-5 py-8 text-white sm:px-8">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold">Secure demo checkout</p>
            <p className="mt-1 text-sm text-rose-100">No real payment required</p>
          </div>
          <div>
            <p className="text-lg font-bold">Easy returns</p>
            <p className="mt-1 text-sm text-rose-100">Simple shopping experience</p>
          </div>
          <div>
            <p className="text-lg font-bold">ShopSphere support</p>
            <p className="mt-1 text-sm text-rose-100">We are happy to help</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center text-sm text-slate-500">
        © 2026 ShopSphere. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;
