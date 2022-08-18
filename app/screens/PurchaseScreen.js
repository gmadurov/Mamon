import { useContext, useState } from "react";
import PurchaseContext from "../context/PurchaseContext";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Purchase from "../components/Purchase";

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
