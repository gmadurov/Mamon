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
import { useContext, useState } from "react";

import BottomSearch from "../navigation/BottomSearch";
import Cart from "../components/Cart";
import { GlobalStyles } from "../constants/styles";
import HolderContext from "../context/HolderContext";
import ProductContext from "../context/ProductContext";
import ProductForm from "../components/ProductForm";
import ProductTile from "../components/ProductTile";

const { width } = Dimensions.get("screen");

const ProductScreen = ({ edit, sell }) => {
  const { GET, selectedProducts } = useContext(ProductContext);
  const { GET: GET_HOLDER } = useContext(HolderContext);
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
    await GET_HOLDER();
    setRefreshing(false);
  }
  return (
    <>
      <View style={edit ? { flex: 2 } : styles.cartView}>
        {edit ? (
          <KeyboardAvoidingView style={[styles.cartView]}>
            <ProductForm create selected={selected} setSelected={setSelected} />
          </KeyboardAvoidingView>
        ) : (
          <Cart sell={sell} />
        )}
      </View>
      <View style={styles.productView}>
        <Text style={styles.text}>Producten</Text>
        <FlatList
          data={selectedProducts}
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
      <BottomSearch
        label="Kies Lid Hier"
        placeholder="Kies Lid Hier"
      />
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
