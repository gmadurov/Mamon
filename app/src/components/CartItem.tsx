import CartContext, { CartItems } from "../context/CartContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";

import { GlobalStyles } from "../constants/styles";
import IconButton from "./IconButton";

const CartItem = ({
  quantity,
  product,
}: {
  quantity: number;
  product: CartItems;
}) => {
  const { remove_from_cart } = useContext(CartContext);
  const onRemove = (amount: number) => {
    // console.log("removing");
    remove_from_cart(product, amount);
  };

  return (
    <View style={styles.modalView}>
      <Pressable onPress={() => onRemove(1)}>
        <Text style={styles.input}>
          {quantity} {product?.name}
          {quantity > 1 && "s"}
        </Text>
      </Pressable>
      <IconButton
        name={"close-circle-outline"}
        style={styles.input}
        color={GlobalStyles.colors.textColorDark}
        onPressFunction={() => onRemove(quantity)}
      />
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 10,
  },

  input: {
    padding: 6,
    fontSize: 18,
    height: 35,
    color: GlobalStyles.colors.textColorDark,
  },
});
