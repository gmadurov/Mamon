import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { useContext, useState } from "react";

import Purchase from "../components/Purchase";
import PurchaseContext from "../context/PurchaseContext";

const PurchaseScreen = () => {
  const { GET, purchases } = useContext(PurchaseContext);
  const [refreshing, setRefreshing] = useState(false);
  function renderItem(itemData) {
    return <Purchase purchase={itemData.item} />;
  }
  async function refresh() {
    setRefreshing(true);
    await GET();
    setRefreshing(false);
  } 
  return (
    <FlatList
      data={purchases}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
      }
    />
  );
};

export default PurchaseScreen;

const styles = StyleSheet.create({ container: {} });
