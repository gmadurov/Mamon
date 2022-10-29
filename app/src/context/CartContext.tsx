import React, { createContext, useContext, useState } from "react";

import AuthContext from "./AuthContext";
import Holder from "../models/Holder";
import { Order } from "../models/Purchase";
import ProductContext from "./ProductContext";
import PurchaseContext from "./PurchaseContext";

// createcontext
export type CartContextType = {
  cart: CartItems[];
  buyer: Holder;
  buy_cart(buyer: Holder, sell: boolean): Promise<void>;
  setCart: React.Dispatch<React.SetStateAction<CartItems[]>>;
  add_to_cart: (item: CartItems) => void;
  remove_from_cart: (product: CartItems, quantity?: number) => void;
  setBuyer: React.Dispatch<React.SetStateAction<Holder>>;
};

export interface CartItems extends Order {
  name: string;
  price: number;
  image: null | string;
}

const CartContext = createContext<CartContextType>({} as CartContextType);
export default CartContext;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { POST } = useContext(PurchaseContext);
  const { user } = useContext(AuthContext);
  const { products } = useContext(ProductContext);

  /**withing a cart there are orders
   * orders consist of an object in the following form
   * {quantity: int,
   *  product: product.id<int>}
   * when adding or removing from the cart you are
   * looking up the oder by product key and then ajusting the quantity
   * if the quantity is 0 then you can remove the order from the cart
   */

  const [buyer, setBuyer] = useState<Holder>({} as Holder);
  const [cart, setCart] = useState<CartItems[]>([] as CartItems[]);

  // function add_to_cart(product) {
  //   cart.some((order) => order.product === product.id)
  //     ? setCart(() =>
  //         cart.map((order) =>
  //           order.product === product.id
  //             ? { ...order, quantity: order.quantity + 1 }
  //             : order
  //         )
  //       )
  //     : setCart(() => [...cart, { quantity: 1, product: product.id }]);
  // }

  // copilot option 1
  const add_to_cart = (item: CartItems) => {
    const cartCopy = cart ? [...cart] : [];
    const cartItem = cartCopy.find((cartItem) => cartItem.id === item.id);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cartCopy.push({ ...item, quantity: 1 });
    }
    setCart(cartCopy);
  };
  function remove_from_cart(product: CartItems, quantity: number = 1) {
    if (cart) {
      if (cart.some((order) => order.id === product.id)) {
        if (
          cart.find((order) => order.product === product.id)?.quantity ===
          quantity
        ) {
          setCart(() => cart.filter((order) => order.product !== product.id));
        } else if (
          cart.find((order) => order.product === product.id)?.quantity !==
          quantity
        ) {
          setCart(() =>
            cart.map((order) =>
              order.product === product.id
                ? { ...order, quantity: order.quantity - quantity }
                : order
            )
          );
        } else {
          setCart(() => cart.filter((order) => order.product !== product.id));
        }
      }
    }
  }
  async function buy_cart(buyer: Holder, sell: boolean) {
    await POST({
      orders: cart,
      seller: user?.lid_id,
      payed: sell === true ? true : false,
      buyer: buyer.id,
      remaining_after_purchase:
        buyer.stand -
        cart?.reduce(
          (partialSum, a) =>
            partialSum +
            (products?.find((product) => product.id === a.product)?.price ||
              0) *
              a.quantity,
          0
        ),
    });
    setCart([]);
  }

  const data = {
    cart,
    setCart,
    add_to_cart,
    remove_from_cart,
    buy_cart,
    buyer,
    setBuyer,
  };
  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};
