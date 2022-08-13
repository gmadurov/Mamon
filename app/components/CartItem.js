import { useState, useContext } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../constants/styles";
import CartContext from "../context/CartContext";
import IconButton from "./IconButton";

const CartItem = ({ quantity, product }) => {
  const { remove_from_cart } = useContext(CartContext);
  const [deleted, setDeleted] = useState(false);
  const onRemove = () => {
    remove_from_cart(product);
  };
  return (
    <View
      style={[
        styles.gridItem,
        {
          backgroundColor: !deleted
            ? GlobalStyles.colors.primary1
            : GlobalStyles.colors.primary2,
        },
      ]}
    >
      <Pressable
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
      </Pressable>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
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
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
