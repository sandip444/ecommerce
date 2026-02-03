import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductComponent = () => {
  const products = useSelector((state) => state.allProducts.products);

  if (!products.length) {
    return (
      <div className="empty-state">
        <h3>Inventory is syncing...</h3>
        <p>Hang tight while we load the latest sensor availability.</p>
      </div>
    );
  }

  const renderList = products.map((product) => {
    const { id, title, image, price, category, stock, status } = product;
    const availability = stock > 0 ? "Available" : "Backorder";

    return (
      <div className="product-card" key={id}>
        <Link to={`/product/${id}`}>
          <div className="product-card__image">
            <img src={image} alt={title} />
          </div>
        </Link>
        <div className="product-card__body">
          <div>
            <p className="product-card__category">{category}</p>
            <h3>{title}</h3>
          </div>
          <p className="product-card__price">$ {price}</p>
          <div className="product-card__meta">
            <span className="tag">{availability}</span>
            <span className="muted">Stock: {stock}</span>
            <span className="muted">{status}</span>
          </div>
          <Link className="primary-button product-card__cta" to={`/product/${id}`}>
            View &amp; Purchase
          </Link>
        </div>
      </div>
    );
  });
  return <>{renderList}</>;
};
export default ProductComponent;
