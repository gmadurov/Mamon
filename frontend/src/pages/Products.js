import Product from "./Product";
import ProductContext from "../context/ProductContext";
import { useContext }  from "react";

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
