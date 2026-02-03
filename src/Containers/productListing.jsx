import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "../Redux/actions/productActions";
import ProductComponent from "./productComponent";
import { api } from "../api";
import { sampleProducts } from "../data/sampleProducts";

const ProductPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get("/products");
        dispatch(setProducts(response.data));
      } catch (err) {
        console.log("Err", err);
        dispatch(setProducts(sampleProducts));
      }
    };
    fetchProduct();
  }, [dispatch]);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero__content">
          <p className="pill">Industrial Sensor Marketplace</p>
          <h1>Deploy smarter monitoring with ready-to-ship sensors.</h1>
          <p className="hero__subtitle">
            Shop certified sensor hardware, compare specs, and purchase with
            confidence. Built for factories, utilities, and smart buildings.
          </p>
          <div className="hero__actions">
            <button className="primary-button" type="button">
              Browse Inventory
            </button>
            <button className="ghost-button" type="button">
              Request a Quote
            </button>
          </div>
          <div className="hero__stats">
            <div>
              <h3>48-hour</h3>
              <p>Fulfillment turnaround</p>
            </div>
            <div>
              <h3>ISO 9001</h3>
              <p>Compliance-ready catalog</p>
            </div>
            <div>
              <h3>Global</h3>
              <p>Delivery network</p>
            </div>
          </div>
        </div>
        <div className="hero__card">
          <h2>Sensor Starter Kits</h2>
          <p>
            Bundled starter kits include calibration certificates and
            integration guides.
          </p>
          <ul>
            <li>5G gateway ready</li>
            <li>On-site installation support</li>
            <li>Warranty up to 36 months</li>
          </ul>
          <button className="secondary-button" type="button">
            Explore Kits
          </button>
        </div>
      </section>

      <section className="inventory">
        <div className="inventory__header">
          <div>
            <p className="section-label">Available Sensors</p>
            <h2>Purchase-ready inventory</h2>
          </div>
          <div className="inventory__note">
            <span>Need help?</span> Our engineers can match sensors to your
            deployment goals.
          </div>
        </div>
        <div className="inventory__grid">
          <ProductComponent />
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
