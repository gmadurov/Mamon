import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import React, { useContext, useState } from "react";

import CategoryItem from "../components/CategoryItem";
import { Divider } from "react-native-paper";
import SettingsContext from "../context/SettingsContext";

const CategoryScreen = () => {
  const { categories, GET_categories } = useContext(SettingsContext);
  const [refreshing] = useState(false);
  async function refresh() {
    await GET_categories();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString() as string}
        renderItem={({ item }) => <CategoryItem category={item} />}
        ItemSeparatorComponent={Divider}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
        }
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({ container: {} });
