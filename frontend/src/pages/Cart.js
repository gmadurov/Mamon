import { useState } from "react";
import { useContext } from "react";
import CartContext from "../context/CartContext";
import ProductContext from "../context/ProductContext";
import Button from "../components/Button";
import HolderContext from "../context/HolderContext";
import AsyncSelect from "react-select/async";

export const Cart = ({sell}) => {
  const { cart, buy_cart } = useContext(CartContext);
  const { holders, searchHolders, SEARCH } = useContext(HolderContext);
  const { products } = useContext(ProductContext);
  const [buyer, setBuyer] = useState(null);

  let total = 0;
  cart?.map(
    (order) =>
      (total +=
        products?.find((product) => product.id === order.product).price *
        order.quantity)
  );

  async function loadOptions(input) {
    await SEARCH({ search: input });
    return searchHolders;
  }

  const optionsHolders = holders?.map((holder) => ({
    value: holder.id,
    label:
      holder?.user.first_name +
      " " +
      holder?.user.last_name +
      " (" +
      holder?.user.username +
      ")",
  }));
  return (
    <>
      <div className="column card is-3">
        <form>
          <AsyncSelect
            id="id_buyer"
            name="buyer"
            value={optionsHolders?.find((x) => x.value === buyer?.id)}
            defaultOptions={optionsHolders}
            loadOptions={loadOptions}
            onChange={(e) => {
              setBuyer(e.value);
            }}
            noOptionsMessage={() => "No Accounts with that info!"}
            loadingMessage={() => "Loading"}
          />
        </form>
        Total:
        {cart?.map((order) => (
          <div key={"cart product" + order.product}>
            {order.quantity}{" "}
            {products?.find((product) => product.id === order.product).name}
          </div>
        ))}
        <Button
          onClick={() => {
            buy_cart(buyer, sell);
          }}
          color="is-success"
        >
          Pay €{total}
        </Button>
      </div>
    </>
  );
};
export default Cart;
