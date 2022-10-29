import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { GlobalStyles } from "../../constants/styles";
import React from "react";

function FlatButton({
  children,
  onPressFunction,
}: {
  children: React.ReactNode;
  onPressFunction: Function;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={(e) => onPressFunction(e)}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: GlobalStyles.colors.primary1,
    backgroundColor: GlobalStyles.colors.primary5,
  },
});
