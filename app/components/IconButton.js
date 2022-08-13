import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IconButton({ name, color, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed ? [styles.pressed, style] : style}
    >
      <Ionicons name={name} size={24} color={color} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
