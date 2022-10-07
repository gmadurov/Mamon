import { useContext } from "react";
import { StyleSheet } from "react-native";
import SettingsContext from "../context/SettingsContext";
import { Switch, Text } from "react-native-paper";
import { GlobalStyles } from "../constants/styles";

const CategoryItem = ({ item }) => {
  const { selectedCategory, setSelectedCategory } = useContext(SettingsContext);
  let category = item.item;
  function change(base) {
    if (selectedCategory.includes(category.id)) {
      setSelectedCategory(() =>
        selectedCategory.map((pr) => pr !== category.id && pr)
      );
    } else {
      setSelectedCategory(() => [...selectedCategory, category.id]);
    }
  }

  return (
    <>
      <Text variant="titleMedium">{category.name}</Text>
      <Switch
        color={GlobalStyles.colors.primary1}
        value={selectedCategory.includes(category.id)}
        onValueChange={change}
      />
    </>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({ container: {} });
