import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import Product from "./Product";

export const Products = ({}) => {
  const { products } = useContext(ProductContext);
  return (
    <>
      {products?.map((product) => (
        <div className="card column is-2" key={"product" + product.id}>
          <div className="card-content">
            <Product
              product={product}
            />
          </div>
        </div>
      ))}
    </>
  );
};
export default Products;
