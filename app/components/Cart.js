import { useState, useContext, useEffect } from "react";
import CartContext from "../context/CartContext";
import ProductContext from "../context/ProductContext";
import HolderContext from "../context/HolderContext";
import { Platform, StyleSheet, Text, View } from "react-native";
import Select from "./Select";
import { Button } from "@rneui/themed";
// import { FlatList } from "react-native-gesture-handler";
import PropTypes from "prop-types";
import CartItem from "./CartItem";
import { GlobalStyles } from "../constants/styles";
export const Cart = ({ sell }) => {
  const { cart, setCart, buy_cart } = useContext(CartContext);
  const { holders, SEARCH } = useContext(HolderContext);
  const { products } = useContext(ProductContext);
  const [buyer, setBuyer] = useState(0);
  const [disabled, setDisabled] = useState(true);
  let total = 0;
  cart?.map(
    (order) =>
      (total +=
        products?.find((product) => product.id === order.product).price *
        order.quantity)
  );
  let optionsHolders = holders?.map((holder) => ({
    value: holder.id,
    label: holder?.name,
  }));
  async function loadOptions(input = "") {
    let searchHolders = await SEARCH({ search: input });
    optionsHolders = searchHolders?.map((holder) => ({
      value: holder?.id,
      label: holder?.name,
    }));
  }
  function renderProducts(itemData) {
    return (
      <CartItem
        quantity={itemData.item.order}
        product={products.find(
          (product) => product.id === itemData.item.product
        )}
      />
    );
  }

  useEffect(() => {
    function checkStand() {
      // this has a change for double spending highly unlikely but still need to fix
      let holder = holders?.find((holder) => holder.id === buyer);
      if (sell) {
        if (holder?.stand > total && total > 0.5) {
          setDisabled(true);
        } else {
          setDisabled(false);
        }
      }
    }
    checkStand();
  }, [buyer, total]);

  return (
    <View style={styles.gridItem}>
      <View style={[styles.innerContainer, {}]}>
        {!cart.length > 0 ? (
          <Text>Cart is empty</Text>
        ) : (
          cart?.map((order) => (
            <View key={"cart product" + order.product}>
              <Text>
                {order.quantity}{" "}
                {products?.find((product) => product.id === order.product).name}
                {order.quantity > 1 && "s"}
              </Text>
            </View>
          ))
          // <FlatList
          //   data={cart}
          //   keyExtractor={(order) => "cart product" + order.product}
          //   renderItem={renderProducts}
          //   numColumns={5}
          // />
        )}
      </View>
      <View style={styles.view1}>
        <Select
          defaultValue={buyer}
          options={optionsHolders}
          optionFunction={loadOptions}
          onSelect={(e) => setBuyer(e)}
          label="Kies Lid Hier"
          placeholder="         Kies Lid Hier         "
        />
        <View style={styles.view2}>
          <Button
            android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : styles.button,
            ]}
            color={"red"}
            onPress={() => {
              setCart([]);
              setBuyer(null);
            }}
            title={"Empty Cart"}
          />
          <Button
            android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : styles.button,
            ]}
            color="green"
            disabled={disabled}
            onPress={() => {
              buy_cart(buyer, sell);
              setBuyer();
            }}
            title={
              "Buy €" +
              parseFloat(total).toPrecision(
                total <= 10 ? 3 : total <= 100 ? 4 : 5
              ) +
              " "
            }
          />
        </View>
      </View>
    </View>
  );
};
Cart.propTypes = {
  sell: PropTypes.bool,
};
export default Cart;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 16,
    // height: 150,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: GlobalStyles.colors.primary3,
    shadowColor: GlobalStyles.colors.shadowColor,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  button: {
    maxWidth: 4,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary4,
  },
  // title: {
  //   fontWeight: "bold",
  //   fontSize: 18,
  // },
  view1: {
    flexDirection: "row",
    backgroundColor: GlobalStyles.colors.primary2,
  },
  view2: {
    flexDirection: "row",
    backgroundColor: GlobalStyles.colors.primary2,
  },
});
