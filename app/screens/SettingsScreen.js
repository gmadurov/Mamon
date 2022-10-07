import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import SettingsContext from "../context/SettingsContext";
import CategoryItem from "../components/CategoryItem";
import { Divider } from "react-native-paper";

const SettingsScreen = () => {
  const { categories, selectedCategory, setSelectedCategory, GET_categories } =
    useContext(SettingsContext);
  const [refreshing, setRefreshing] = useState(false);
  async function refresh() {
    await GET_categories();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <CategoryItem item={item} />}
        ItemSeparatorComponent={Divider}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
        }
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({ container: {} });
