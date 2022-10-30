import { Pressable, StyleSheet, Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

function IconButton({ name, color, onPressFunction, style }) {
  //   name: string;
  //   color: string;
  //   onPressFunction: Function;
  //   style: any;}

  return (
    <Text style={style}>
      <Pressable
        onPress={(e) => onPressFunction(e)}
        // style={({ pressed }) => {
        //   pressed ? [styles.pressed] : {};
        // }}
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
