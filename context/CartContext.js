import { createContext, useContext, useState } from "react";
import PurchaseContext from "../context/PurchaseContext";
import AuthContext from "./AuthContext";

/**cart: cart,
 * 
 * setCart: setCart, 
 * 
    add_to_cart: add_to_cart,

    remove_from_cart: remove_from_cart,

    buy_cart: buy_cart,
     */
const CartContext = createContext();
export default CartContext;

export const CartProvider = ({ children }) => {
  const { POST } = useContext(PurchaseContext);
  const { user } = useContext(AuthContext);
  /**withing a cart there are orders
   * orders consist of an object in the following form
   * {quantity: int,
   *  product: product.id<int>}
   * when adding or removing from the cart you are
   * looking up the oder by product key and then ajusting the quantity
   * if the quantity is 0 then you can remove the order from the cart
   */
  const [cart, setCart] = useState([]);
  function add_to_cart(product) {
    cart.some((order) => order.product === product.id)
      ? setCart(() =>
          cart.map((order) =>
            order.product === product.id
              ? { ...order, quantity: order.quantity + 1 }
              : order
          )
        )
      : setCart(() => [...cart, { quantity: 1, product: product.id }]);
  }
  function remove_from_cart(product) {
    cart.some((order) => order.product === product.id) &&
    cart.find((order) => order.product === product.id).quantity > 1
      ? setCart(() =>
          cart.map((order) =>
            order.product === product.id
              ? { ...order, quantity: order.quantity - 1 }
              : order
          )
        )
      : setCart(() => cart.filter((order) => order.product !== product.id));
  }
  async function buy_cart(buyer, sell) {
    await POST({
      orders: cart,
      seller: user?.holder_id ? user?.holder_id : 0,
      payed: sell,
      buyer: buyer ? buyer : 0,
    });
    setCart([]);
  }

  const data = {
    cart: cart,
    setCart: setCart,
    add_to_cart: add_to_cart,
    remove_from_cart: remove_from_cart,
    buy_cart: buy_cart,
  };
  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};
