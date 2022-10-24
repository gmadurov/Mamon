import { StyleSheet, Text, View } from "react-native";

import { GlobalStyles } from "../constants/styles";
import SettingsContext from "../context/SettingsContext";
import { Switch } from "react-native-paper";
import { useContext } from "react";

const CategoryItem = ({ item }) => {
  const { selectedCategory, setSelectedCategory } = useContext(SettingsContext);
  let category = item.item;
  function change(base) {
    if (selectedCategory.includes(category.id)) {
      setSelectedCategory((list) =>
        list.filter((pr) => pr !== category.id && pr)
      );
    } else {
      setSelectedCategory(() => [...selectedCategory, category.id]);
    }
  }

  return (
    <View style={styles.row}>
      <Text>{category.name}</Text>
      <Switch
        color={GlobalStyles.colors.primary1}
        value={selectedCategory.includes(category.id)}
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
