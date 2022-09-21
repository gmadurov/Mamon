import { useState, useContext } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { GlobalStyles } from "../constants/styles";
import CartContext from "../context/CartContext";
import ProductContext from "../context/ProductContext";
import IconButton from "./IconButton";

const ProductTile = ({ selected, setSelected, quantity, product, edit }) => {
  const { add_to_cart, remove_from_cart } = useContext(CartContext);
  const { DELETE } = useContext(ProductContext);
  const [deleted, setDeleted] = useState(false);
  const onAdd = () => {
    if (edit) {
      setSelected(product.id);
    } else {
      add_to_cart(product);
    }
  };
  const onRemove = async () => {
    if (edit) {
      await DELETE(product);
    } else {
      remove_from_cart(product);
    }
  };

  let [BGC, iBGC] = deleted
    ? [GlobalStyles.colors.primary4, GlobalStyles.colors.primary1]
    : ([GlobalStyles.colors.primary1, GlobalStyles.colors.primary4][
        (BGC, iBGC)
      ] =
        product.id === selected
          ? [GlobalStyles.colors.primary2, GlobalStyles.colors.primary4]
          : [GlobalStyles.colors.primary1, GlobalStyles.colors.primary4]);

  return (
    <View
      style={[
        styles.gridItem,
        {
          backgroundColor: BGC,
        },
      ]}
    >
      <Pressable
        android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : { flex: 1 },
        ]}
        onPress={deleted ? onRemove : onAdd}
      >
        <IconButton
          name="trash-outline"
          onPress={() => setDeleted(!deleted)}
          color={iBGC}
          style={{
            flex: 1,
            textAlign: "right",
            color: iBGC,
          }}
        />
        <View
          style={[
            styles.innerContainer,
            {
              backgroundColor: BGC,
            },
          ]}
        >
          <Image
            source={require("../assets/user-default.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.title}>
            {edit === true && !quantity && deleted && "Delete"}
            {quantity && quantity} {product?.name}
            {edit === true && !quantity && deleted && " from database "}
          </Text>

          {!(edit === true && !quantity && deleted) && (
            <Text style={styles.title}>€ {product?.price}</Text>
          )}
        </View>
      </Pressable>
    </View>
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
