import { FlatList, RefreshControl, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";

import Purchase from "../models/Purchase";
import PurchaseComponent from "../components/Purchase";
import PurchaseContext from "../context/PurchaseContext";

const PurchaseScreen = () => {
  const { GET, purchases } = useContext(PurchaseContext);
  const [refreshing, setRefreshing] = useState(false);

  function renderPurchase({ item }: { item: Purchase }) {
    return <PurchaseComponent purchase={item} />;
  }
  async function refresh() {
    setRefreshing(true);
    await GET();
    setRefreshing(false);
  }
  return (
    <FlatList
      data={purchases}
      keyExtractor={(item) => (item.id?.toString() as string) || "0"}
      renderItem={renderPurchase}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
      }
    />
  );
};

export default PurchaseScreen;

const styles = StyleSheet.create({ container: {} });
