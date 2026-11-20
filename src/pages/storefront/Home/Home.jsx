import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoreProducts } from "../../../data/products";
import sageGreenBanner from "../../../assets/sage-green-home-banner.png";

function Home() {
  const navigate = useNavigate();
  const storeProducts = getStoreProducts();
  const categories = [
    ...new Set(storeProducts.map((product) => product.category)),
  ].slice(0, 4);
  const featuredProducts = storeProducts.slice(0, 4);

  return (
    <main className="home-page">
      <section className="editorial-hero">
        <div className="editorial-hero__copy">
          <p className="editorial-eyebrow">
            <span />
            The art of everyday living
          </p>
          <h1>
            Made for the
            <br />
            <em>way you live.</em>
          </h1>
          <p className="editorial-hero__description">
            Thoughtful finds, timeless essentials, and little things that make
            every day feel a little more considered.
          </p>
          <button
            type="button"
            className="editorial-button"
            onClick={() => navigate("/products")}
          >
            Discover the collection <ArrowRight size={17} aria-hidden="true" />
          </button>
          <div className="editorial-hero__note">
            <span>01</span>
            <span>Curated with intention</span>
          </div>
        </div>

        <div className="editorial-hero__visual">
          <img
            className="editorial-hero__banner"
            src={sageGreenBanner}
            alt="Curated shopping still life in sage green"
          />
          <div className="editorial-hero__image-caption">
            <span>THE NEW SEASON</span>
            <strong>Quietly, beautifully you.</strong>
          </div>
          <div className="editorial-hero__seal" aria-hidden="true">
            <span>SHOPSPHERE</span>
            <ArrowDownRight size={18} />
          </div>
        </div>
      </section>

      <section className="home-categories">
        <div className="section-heading">
          <div>
            <p className="editorial-eyebrow">
              <span />
              A world of good things
            </p>
            <h2>Find your next favorite.</h2>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => navigate("/products")}
          >
            View all categories <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => {
            const image = storeProducts.find(
              (product) => product.category === category
            )?.image;

            return (
              <button
                key={category}
                type="button"
                className="category-tile"
                onClick={() =>
                  navigate(`/products?category=${encodeURIComponent(category)}`)
                }
              >
                {image && <img src={image} alt="" />}
                <span className="category-tile__number">
                  0{index + 1}
                </span>
                <span className="category-tile__name">{category}</span>
                <ArrowRight
                  className="category-tile__arrow"
                  size={18}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="home-featured">
        <div className="section-heading">
          <div>
            <p className="editorial-eyebrow">
              <span />
              Chosen for you
            </p>
            <h2>The pieces we keep close.</h2>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => navigate("/products")}
          >
            Explore all pieces <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => navigate(`/products/${product.id}`)}
              className="featured-card"
            >
              <span className="featured-card__image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span className="featured-card__no-image">No image</span>
                )}
              </span>
              <span className="featured-card__meta">
                <span>{product.category}</span>
                <span>₹{product.price}</span>
              </span>
              <span className="featured-card__name">{product.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-promise">
        <p className="editorial-eyebrow">
          <span />
          A little more considered
        </p>
        <h2>Good things, made easy.</h2>
        <div className="promise-grid">
          <div>
            <span>01</span>
            <h3>Thoughtful selection</h3>
            <p>Everyday favorites chosen with care, all in one place.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Easy by design</h3>
            <p>A simple, secure checkout and a smoother way to shop.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Here to help</h3>
            <p>Questions along the way? Our team is always happy to help.</p>
          </div>
        </div>
      </section>

      <footer className="storefront-footer">
        <span className="storefront-footer__brand">ShopSphere</span>
        <span>Considered finds for everyday living.</span>
        <span>© 2026 ShopSphere. All rights reserved.</span>
      </footer>
    </main>
  );
}

export default Home;
