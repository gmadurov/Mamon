import { useContext, useEffect, useState } from "react";
import { Platform, Alert, StyleSheet, Text, View } from "react-native";
import ProductContext from "../context/ProductContext";
import Input from "../constants/Input";
import { GlobalStyles } from "../constants/styles";
import { Button } from "@rneui/base";

const ProductForm = ({ style, create, selected, setSelected }) => {
  const [disabled, setDisabled] = useState(true);
  const { products, POST, PUT } = useContext(ProductContext);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    setProductName(
      selected !== 0
        ? products?.find((product) => product.id === selected)?.name
        : ""
    );
    setProductPrice(
      selected !== 0
        ? parseFloat(
            products?.find((product) => product.id === selected)?.price
          ).toString()
        : ""
    );
    setDisabled();
     // eslint-disable-next-line
  }, [selected]);

  function handleSubmit() {
    if (productName === "") {
      Alert.alert("Please Fill in a Name for product");
    }
    if (productPrice === "") {
      Alert.alert("Please Fill in a Price for product");
    }
    if (selected === 0) {
      POST({ name: productName, price: productPrice });
    } else {
      PUT({ id: selected, name: productName, price: productPrice });
    }
    setProductName("");
    setProductPrice(null);
    setSelected(0);
  }
  return (
    <View style={[styles.gridItem, style]}>
      <View style={[styles.innerContainer, {}]}>
        <Input
          label="Product Name"
          onUpdateValue={setProductName}
          value={productName}
        />
        <Input
          label="Product Price"
          onUpdateValue={setProductPrice}
          value={productPrice}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.view1}>
        {/* <View style={styles.view2}> */}
        <Button
          android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : styles.button,
          ]}
          color={"red"}
          onPress={() => {
            setProductName("");
            setProductPrice(null);
          }}
          title={"Cancel"}
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
            handleSubmit();
          }}
          title={selected !== 0 ? "Edit Product" : "Create Product"}
        />
        <Button
          android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : styles.button,
          ]}
          color="black"
          disabled={selected === 0}
          onPress={() => {
            setSelected(0);
            setProductName("");
            setProductPrice(null);
          }}
          title={"Unselect product"}
        />
      </View>
      {/* </View> */}
    </View>
  );
};
export default ProductForm;

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
    flexDirection: "row-reverse",
    backgroundColor: GlobalStyles.colors.primary2,
  },
  view2: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: GlobalStyles.colors.primary2,
  },
});
