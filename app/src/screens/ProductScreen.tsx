import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";

import BottomSearch from "../components/Cart/BottomSearch";
import Cart from "../components/Cart/Cart";
import { GlobalStyles } from "../constants/styles";
import HolderContext from "../context/HolderContext";
import ProductContext from "../context/ProductContext";
import ProductTile from "../components/Product/ProductTile";

const { width } = Dimensions.get("screen");

const ProductScreen = ({ sell }: { sell?: boolean }) => {
  const { GET, selectedProducts } = useContext(ProductContext);
  const { GET: GET_HOLDER } = useContext(HolderContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(0);
  function renderProducts(itemData: { item: any }) {
    return (
      <ProductTile
        product={itemData.item}
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
      <View
        style={[
          { flex: 1 },
          width >= 200 && {
            paddingBottom: 50,
            // flexDirection: "row-reverse",
          },
        ]}
      >
        <View style={styles.cartView}>
          <Cart sell={sell ? true : false} />
        </View>
        <View style={styles.productView}>
          <Text style={styles.text}>Producten</Text>
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.id.toString() as string}
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
      </View>
      <BottomSearch placeholder="Kies Lid Hier" />
    </>
  );
};
export default ProductScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: GlobalStyles.colors.textColorDark,
    textAlign: "right",
  },
  cartView: { flex: 1 },
  productView: { flex: 2 },
});
