import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import Category from "../models/Category";
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
      <Text>{category.name}</Text>
      <Switch
        color={GlobalStyles.colors.primary1}
        value={selectedCategory.includes(category)}
        onValueChange={change}
      />
    </View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
