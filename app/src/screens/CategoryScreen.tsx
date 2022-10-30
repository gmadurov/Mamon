import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";

import Category from "../models/Category";
import { Divider } from "react-native-paper";
import { GlobalStyles } from "../constants/styles";
import SettingsContext from "../context/SettingsContext";
import { Switch } from "react-native-paper";

const CategoryItem = ({ category }: { category: Category }) => {
  const { selectedCategory, setSelectedCategory } = useContext(SettingsContext);
  function change() {
    if (selectedCategory.includes(category)) {
      setSelectedCategory((list) => list.filter((pr) => pr !== category && pr));
    } else {
      setSelectedCategory(() => [...selectedCategory, category]);
    }
  }

  return (
    <View style={styles.row}>
      <Text>{category.name} 12</Text>
      <Switch
        color={GlobalStyles.colors.primary1}
        value={selectedCategory.includes(category)}
        onValueChange={change}
      />
    </View>
  );
};

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

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
