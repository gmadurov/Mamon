import { Pressable, StyleSheet, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

function IconButton({ name, color, onPress, style }) {
  return (
    <Text style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => {
          pressed ? [styles.pressed] : {};
        }}
      >
        <Ionicons name={name} size={24} color={color} />
      </Pressable>
    </Text>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
