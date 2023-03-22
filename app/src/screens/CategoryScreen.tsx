import React, { useContext, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { Divider, Switch } from "react-native-paper";
import { GlobalStyles } from "../constants/styles";
import SettingsContext from "../context/SettingsContext";
import Category from "../models/Category";

const CategoryItem = ({ category }: { category: Category }) => {
  const { selectedCategory, setSelectedCategory } = useContext(SettingsContext);
  function change() {
    if (selectedCategory.includes(category)) {
      setSelectedCategory((list) => list.filter((pr) => pr.id !== category.id));
    } else {
      setSelectedCategory(() => [...selectedCategory, category]);
    }
  }
  return (
    <View style={styles.row}>
      <Text>{category.name}</Text>
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
        }
      >
        {categories.map((category) => (
          <View key={category.id.toString() as string}>
            <CategoryItem category={category} />
            <Divider />
          </View>
        ))}
      </ScrollView>
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
