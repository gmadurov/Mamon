import Purchase, { Order } from "../models/Purchase";
import React, { createContext, useContext, useEffect, useState } from "react";

import Holder from "../models/Holder";
import ProductContext from "./ProductContext";
import PurchaseContext from "./PurchaseContext";
import User from "../models/Users";

export type PaymentType = "cash" | "pin" | "balance";
// createcontext
export type CartContextType = {
  cart: CartItems[];
  buyer: Holder;
  seller: User;
  setSeller: React.Dispatch<React.SetStateAction<User>>;
  buy_cart(buyer: Holder, payment: PaymentType): Promise<void>;
  setCart: React.Dispatch<React.SetStateAction<CartItems[]>>;
  add_to_cart: (item: CartItems) => void;
  remove_from_cart: (product: CartItems, quantity?: number) => void;
  setBuyer: React.Dispatch<React.SetStateAction<Holder>>;
};

export interface CartItems extends Order {
  name: string;
  price: number;
  image: null | string;
  id: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);
export default CartContext;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { POST } = useContext(PurchaseContext);
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
  const [seller, setSeller] = useState({} as User);
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
        if (cart.find((order) => order.id === product.id)?.quantity === quantity) {
          setCart(() => cart.filter((order) => order.id !== product.id));
        } else if (cart.find((order) => order.id === product.id)?.quantity !== quantity) {
          setCart(() =>
            cart.map((order) => (order.id === product.id ? { ...order, quantity: order.quantity - quantity } : order))
          );
        } else {
          setCart(() => cart.filter((order) => order.id !== product.id));
        }
      }
    }
  }
  async function buy_cart(buyer: Holder, payment: PaymentType) {
    let purchase = {
      orders: cart?.map((order) => ({
        quantity: order.quantity,
        product: order.id,
      })),
      seller: seller.user_id,
      balance: payment === "balance" ? true : false,
      cash: payment === "cash" ? true : false,
      pin: payment === "pin" ? true : false,
      buyer: buyer.id,
      remaining_after_purchase:
        buyer.stand -
        cart?.reduce(
          (partialSum, a) => partialSum + (products?.find((product) => product.id === a.product)?.price || 0) * a.quantity,
          0
        ),
    } as Purchase;

    await POST(purchase);
    setCart([] as CartItems[]);
    setSeller({} as User);
  }

  const data = {
    cart,
    setCart,
    add_to_cart,
    remove_from_cart,
    buy_cart,
    buyer,
    setBuyer,
    seller,
    setSeller,
  };
  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};
