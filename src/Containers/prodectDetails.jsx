import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedProduct,
  removeSelectedPrduct,
} from "../Redux/actions/productActions";
import { api } from "../api";
import { sampleProducts } from "../data/sampleProducts";

const ProdectDetails = () => {
  let { productId } = useParams();
  const product = useSelector((state) => state.product);
  const { title, image, price, category, description, stock, specs, status } =
    product;
  const dispatch = useDispatch();
  const [purchaseMessage, setPurchaseMessage] = useState("");

  useEffect(() => {
    const fetchDetaild = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        dispatch(selectedProduct(response.data));
      } catch (err) {
        console.log("Error", err);
        const fallbackProduct = sampleProducts.find(
          (item) => item.id === productId
        );
        if (fallbackProduct) {
          dispatch(selectedProduct(fallbackProduct));
        }
      }
    };

    if (productId && productId !== "") {
      fetchDetaild(productId);
    } else if (!productId) {
      console.log("page not found");
    }
    return () => {
      dispatch(removeSelectedPrduct());
    };
  }, [dispatch, productId]);

  return (
    <div className="page">
      {Object.keys(product).length === 0 ? (
        <div className="loading">Loading....</div>
      ) : (
        <div className="details">
          <div className="details__image">
            <img src={image} alt={title} />
          </div>
          <div className="details__content">
            <Link className="breadcrumb" to="/">
              ← Back to inventory
            </Link>
            <h1>{title}</h1>
            <div className="details__meta">
              <span className="tag">{category}</span>
              <span className="tag">Status: {status}</span>
              <span className="tag">Stock: {stock}</span>
            </div>
            <p className="details__price">$ {price}</p>
            <p className="details__description">{description}</p>
            <div className="details__specs">
              <h3>Specification highlights</h3>
              <ul>
                {(specs || []).map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </div>
            <div className="details__actions">
              <button
                className="primary-button"
                type="button"
                disabled={stock === 0}
                onClick={() =>
                  setPurchaseMessage(
                    stock === 0
                      ? "This sensor is currently on backorder."
                      : "Added to your purchase request. Our team will reach out!"
                  )
                }
              >
                {stock === 0 ? "Backorder" : "Purchase Sensor"}
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() =>
                  setPurchaseMessage(
                    "A solutions engineer will help with bulk pricing."
                  )
                }
              >
                Talk to Sales
              </button>
            </div>
            {purchaseMessage && (
              <p className="details__message">{purchaseMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdectDetails;
