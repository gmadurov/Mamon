import AuthContext, { baseUrl } from "../../context/AuthContext";
import { Avatar, Divider } from "react-native-paper";
import CartContext, { CartItems } from "../../context/CartContext";
import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "@rneui/themed";
import CartItem from "./CartItem";
import { FlatList } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import Holder from "../../models/Holder";
import HolderContext from "../../context/HolderContext";
import PersonelView from "./PersonelView";
import ProductContext from "../../context/ProductContext";
import Select from "./Select";

export const Cart = ({ sell }: { sell: boolean }) => {
  const { cart, setCart, buy_cart, buyer, setBuyer, seller } = useContext(CartContext);
  const { GET, holders, SEARCH } = useContext(HolderContext);
  const { users } = useContext(AuthContext);
  const [disabled, setDisabled] = useState<boolean>(true);
  // let total equal the sum of the products in the cart multiplied by the quantity
  let total = cart?.reduce(
    (partialSum, a) => partialSum + a.price * a.quantity,
    0
  );
  let optionsHolders =
    holders &&
    holders.map((holder) => ({
      value: holder.id,
      label: holder.name,
      searchHelp: holder.ledenbase_id.toString(),
    }));
  async function loadOptions(input: string = "") {
    let searchHolders = await SEARCH(input);
    optionsHolders = searchHolders?.map((holder) => ({
      value: holder?.id,
      label: holder?.name,
      searchHelp: holder?.ledenbase_id.toString(),
    }));
  }
  // console.log(users);
  function renderProducts(cartItem: CartItems) {
    return (
      <CartItem
        quantity={cartItem.quantity}
        product={
          ({
            price: cartItem.price,
            name: cartItem.name,
            quantity: cartItem.quantity,
            product: cartItem,
            id: cartItem.id,
          } as unknown as CartItems) || ({} as CartItems)
        }
      />
    );
  }
  async function buy() {
    await buy_cart(buyer, sell);
    setBuyer({} as Holder);
  }
  useEffect(() => {
    function checkStand() {
      // this has a change for double spending highly unlikely but still need to fix
      if (sell) {
        if (buyer?.stand > total && total > 0.5 && seller.user_id) {
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
  }, [buyer, total, seller]);
  return (
    <View style={[styles.gridItem]}>
      <View
        style={[
          styles.innerContainer,
          !(cart.length > 0) && { alignItems: "center" },
        ]}
      >
        {!(cart.length > 0) ? (
          <Text>Cart is empty</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => "cart product" + item.id}
            renderItem={({ item }) => renderProducts(item)}
            ItemSeparatorComponent={Divider}
            numColumns={1}
          />
        )}
      </View>
      <View style={styles.view}>
        <Select
          defaultValue={buyer}
          refreshFunction={GET}
          options={optionsHolders}
          // optionFunction={loadOptions}
          // onSelect={(e) => setBuyer(e)}
          label="Kies Lid Hier"
        />
        <View style={styles.view}>
          <Button
            // android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
            // style={({ pressed }) => [
            //   styles.button,
            //   pressed ? styles.buttonPressed : styles.button,
            // ]}
            color={"red"}
            onPress={() => {
              setCart([] as CartItems[]);
              setBuyer({} as Holder);
            }}
            title={"Empty Cart"}
          />
          <Button
            // android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
            // style={({ pressed }) => [
            //   styles.button,
            //   pressed ? styles.buttonPressed : styles.button,
            // ]}
            color="green"
            disabled={disabled}
            onPress={buy}
            title={
              disabled
                ? "Geen Saldo"
                : "Buy €" +
                  // convert total to string and add 2 decimals
                  total?.toFixed(2).toString() +
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
    backgroundColor: GlobalStyles.colors.offwhite,
  },
  view: {
    flexDirection: "row",
    backgroundColor: GlobalStyles.colors.primary2,
  },
});