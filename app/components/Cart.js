import { Platform, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import { Button } from "@rneui/themed";
import CartContext from "../context/CartContext";
// import { FlatList } from "react-native-gesture-handler";
import CartItem from "./CartItem";
import { FlatList } from "react-native";
import { GlobalStyles } from "../constants/styles";
import HolderContext from "../context/HolderContext";
import ProductContext from "../context/ProductContext";
import Select from "./Select";

export const Cart = ({ sell }) => {
  const { cart, setCart, buy_cart, buyer, setBuyer } = useContext(CartContext);
  const { GET, holders, SEARCH } = useContext(HolderContext);
  const { products } = useContext(ProductContext);
  const [disabled, setDisabled] = useState(true);
  let total = 0;
  total = cart?.reduce(
    (partialSum, a) =>
      partialSum +
      products?.find((product) => product.id === a.product)?.price * a.quantity,
    0
  );
  let optionsHolders = holders?.map((holder) => ({
    value: holder.id,
    label: holder?.name,
    searchHelp: holder?.ledenbase_id.toString(),
  }));
  async function loadOptions(input = "") {
    let searchHolders = await SEARCH({ search: input });
    optionsHolders = searchHolders?.map((holder) => ({
      value: holder?.id,
      label: holder?.name,
      searchHelp: holder?.ledenbase_id.toString(),
    }));
  }
  function renderProducts(itemData) {
    return (
      <CartItem
        quantity={itemData.item.quantity}
        product={products?.find(
          (product) => product.id === itemData.item.product
        )}
      />
    );
  }
  async function buy() {
    await buy_cart(buyer, sell);
    setBuyer();
  }
  useEffect(() => {
    function checkStand() {
      // this has a change for double spending highly unlikely but still need to fix
      let holder = holders?.find((holder) => holder.id === buyer);
      if (sell) {
        if (holder?.stand > total && total > 0.5) {
          setDisabled(!true);
        } else {
          setDisabled(!false);
        }
      } else {
        setDisabled(false);
      }
    }
    checkStand();
    // eslint-disable-next-line
  }, [buyer, total]);

  return (
    <View style={styles.gridItem}>
      <View
        style={[
          styles.innerContainer,
          !cart.length > 0 && { alignItems: "center" },
        ]}
      >
        {!cart.length > 0 ? (
          <Text>Cart is empty</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => "cart product" + item.product}
            renderItem={renderProducts}
            numColumns={1}
          />
        )}
      </View>
      <View style={styles.view1}>
        <Select
          defaultValue={buyer}
          refreshFunction={GET}
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
            onPress={buy}
            title={
              disabled
                ? "Geen Saldo"
                : "Buy €" +
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
    // alignItems: "center",
    backgroundColor: GlobalStyles.colors.offwhite,
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
