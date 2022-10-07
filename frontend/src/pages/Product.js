import { useContext } from "react";
import Button from "../components/Button";
import CartContext from "../context/CartContext";
export const Product = ({ product }) => {
  const {add_to_cart, remove_from_cart} = useContext(CartContext)
  const onAdd = () => {
    add_to_cart(product);
  };
  const onRemove = () => {
    remove_from_cart(product);
  };
  return (
    <>
      <div>
        {product.name}, {product.price}
        <Button color='is-success' onClick={onAdd}> Add </Button>
        <Button color='is-danger' onClick={onRemove}> remove </Button>
      </div>
    </>
  );
};
export default Product;
