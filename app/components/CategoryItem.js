import { Switch } from "@rneui/base";
import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SettingsContext from "../context/SettingsContext";

const CategoryItem = ({ item }) => {
  const { selectedCategory, setSelectedCategory } = useContext(SettingsContext);
  let category = item.item;
  const [isSelected, setIsSelected] = useState(false);
  //   setSelectedCategory((prev) => [...prev, category.id]);
  function change() {
    if (selectedCategory.includes(category.id)) {
      setSelectedCategory(() =>
        selectedCategory.map((pr) => pr !== category.id && pr)
      );
    } else {
      setSelectedCategory(() => [...selectedCategory, category.id]);
    }
  }
  return (
    <View>
      <Text>{category.name}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={
          selectedCategory.includes(category.id) ? "#f5dd4b" : "#f4f3f4"
        }
        ios_backgroundColor="#3e3e3e"
        onValueChange={change}
        value={selectedCategory.includes(category.id)}
      />
    </View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({ container: {} });
