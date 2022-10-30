import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";

import CartContext from "../context/CartContext";
import { GlobalStyles } from "../constants/styles";
import ProductContext from "../context/ProductContext";
import { Surface } from "react-native-paper";
import { baseUrl } from "../context/AuthContext";

const ProductTile = ({
  selected,
  product,
}: {
  selected: number;
  setSelected: any;
  quantity?: number;
  product: any;
}) => {
  const { add_to_cart, remove_from_cart } = useContext(CartContext);
  const onAdd = () => {
    add_to_cart(product);
  };
  let BGC: string;
  let iBGC: string;

  [BGC, iBGC] =
    product.id === selected
      ? [GlobalStyles.colors.primary2, GlobalStyles.colors.primary4]
      : [product?.color, GlobalStyles.colors.primary4];

  return (
    <Surface style={[styles.gridItem, { elevation: 2 }]}>
      <Pressable
        android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : { flex: 1 },
        ]}
        onPress={onAdd}
      >
        <View
          style={[
            styles.innerContainer,
            {
              backgroundColor: BGC,
            },
          ]}
        >
          {product?.image ? (
            <Image
              source={{ uri: baseUrl() + product?.image }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={require("../assets/default-product.png")}
              style={styles.avatar}
            />
          )}
          <Text style={styles.title}>{product?.name}</Text>

          <Text style={styles.title}>€ {product?.price}</Text>
        </View>
      </Pressable>
    </Surface>
  );
};

export default ProductTile;

const styles = StyleSheet.create({
  gridItem: {
    flex: 2,
    margin: 16,
    height: 150,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: GlobalStyles.colors.primary1,
    shadowColor: GlobalStyles.colors.shadowColor,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    flex: 4,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    zIndex: 1,
    // position: 'absolute',
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
    opacity: 0.9,
    position: "absolute",
    marginBottom: 10,
  },
});
