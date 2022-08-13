import { useContext, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductContext from "../context/ProductContext";
import ProductTile from "../components/ProductTile";
import PropTypes from "prop-types";
import Cart from "../components/Cart";
import { GlobalStyles } from "../constants/styles";

const ProductScreen = ({ sell }) => {
  const { GET, products } = useContext(ProductContext);
  const [refreshing, setRefreshing] = useState(false);
  function renderProducts(itemData) {
    return <ProductTile product={itemData.item} />;
  }

  async function getProducts() {
    setRefreshing(true);
    await GET();
    setRefreshing(false);
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => getProducts()}
        />
      }
    >
      <View style={styles.cartView}>
        <Cart sell={sell} />
      </View>
      <View style={styles.productView}>
        <Text style={styles.text}>Producten</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProducts}
          numColumns={2}
        />
      </View>
    </ScrollView>
  );
};
ProductScreen.propTypes = {
  sell: PropTypes.bool.isRequired,
};
export default ProductScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: GlobalStyles.colors.textColor,
    textAlign: "right",
  },
  cartView: { flex: 1 },
  productView: { flex: 1 },
});
