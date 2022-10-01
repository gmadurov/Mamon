import { useContext, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductContext from "../context/ProductContext";
import ProductTile from "../components/ProductTile";
import Cart from "../components/Cart";
import { GlobalStyles } from "../constants/styles";
import ProductForm from "../components/ProductForm";
import NfcManager, {NfcTech} from 'react-native-nfc-manager';



const { width } = Dimensions.get("screen");
const ProductScreen = ({ edit, sell }) => {
  const { GET, products } = useContext(ProductContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(0);

  function renderProducts(itemData) {
    return (
      <ProductTile
        product={itemData.item}
        edit={edit}
        selected={selected}
        setSelected={setSelected}
      />
    );
  }
  async function getProducts() {
    setRefreshing(true);
    await GET();
    setRefreshing(false);
  }
  return (
    <>
      <View style={styles.cartView}>
        {edit ? (
          <KeyboardAvoidingView style={styles.cartView}>
            <ProductForm create selected={selected} setSelected={setSelected} />
          </KeyboardAvoidingView>
        ) : (
          <Cart sell={sell} />
        )}
      </View>
      <View style={styles.productView}>
        <Text style={styles.text}>Producten</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProducts}
          numColumns={Math.floor(width / 196)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getProducts()}
            />
          }
        />
      </View>
    </>
  );
};
export default ProductScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: GlobalStyles.colors.textColor,
    textAlign: "right",
  },
  cartView: { flex: 1 },
  productView: { flex: 2 },
});
