import { useState, useContext } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/styles";
import CartContext from "../context/CartContext";
import ProductContext from "../context/ProductContext";
import IconButton from "./IconButton";

const CartItem = ({ quantity, product }) => {
  const { products } = useContext(ProductContext);
  const { remove_from_cart } = useContext(CartContext);
  const [deleted, setDeleted] = useState(false);
  const onRemove = () => {
    remove_from_cart(product, quantity);
  };
  return (
    <View style={styles.modalView}>
      <Text style={styles.input}>
        {quantity}{" "}
        {
          products?.find(
            (product_from_find) => product_from_find.id === product.id
          ).name
        }
        {quantity > 1 && "s"}
      </Text>
      <IconButton
        name={"close-circle-outline"}
        size={24}
        style={styles.input}
        color={GlobalStyles.colors.textColorDark}
        onPress={onRemove}
      />
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  gridItem: {},
  modalView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 5,
    elevation: 4,
    borderRadius: 20,
    maxHeight: 50,
    backgroundColor: GlobalStyles.colors.white,
    shadowColor: GlobalStyles.colors.shadowColor,
    shadowOpacity: 0.25,
    shadowOffset: { width: 10, height: 12 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    marginBottom: 5,
  },
  button: {
    flex: 1,
    backgroundColor: "blue",
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
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: GlobalStyles.colors.textColorDark,
  },
  input: {
    padding: 6,
    fontSize: 18,
    height: 35,
    color: GlobalStyles.colors.textColorDark,
  },
});

{
  /* <Pressable
        android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onRemove}
      >
        {!quantity && (
          <Text
            style={{
              textAlign: "right",
              backgroundColor: !deleted
                ? GlobalStyles.colors.primary1
                : GlobalStyles.colors.primary2,
            }}
          >
            Delete
            <IconButton
              name="trash-outline"
              onPress={() => setDeleted(!deleted)}
              color={
                deleted
                  ? GlobalStyles.colors.primary1
                  : GlobalStyles.colors.primary2
              }
              style={{
                textAlign: "right",
                color: deleted
                  ? GlobalStyles.colors.primary1
                  : GlobalStyles.colors.primary2,
              }}
            />
          </Text>
        )}

        <View
          style={[
            styles.innerContainer,
            {
              backgroundColor: !deleted
                ? GlobalStyles.colors.primary1
                : GlobalStyles.colors.primary2,
            },
          ]}
        >
          <Text style={styles.title}>
            {quantity && quantity} {product?.name}
          </Text>
          <Text style={styles.title}>
            {!quantity && "€" + product?.price} (Delete 1){" "}
          </Text>
        </View>
      </Pressable> */
}
