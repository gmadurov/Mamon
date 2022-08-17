import { useContext } from "react";
import PurchaseContext from "../context/PurchaseContext";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Purchase from "../components/Purchase";

const PurchaseScreen = () => {
  const { purchases } = useContext(PurchaseContext);

  function renderItem(itemData) {
    return <Purchase purchase={itemData.item} />
  }
  return <FlatList data={purchases} keyExtractor={(item) => item.id} renderItem={renderItem} />;
};

export default PurchaseScreen;

const styles = StyleSheet.create({ container: {} });
