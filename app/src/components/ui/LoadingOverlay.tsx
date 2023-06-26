import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Button } from "react-native-paper";
import React from "react";

function LoadingOverlay({
  message,
  show,
  onCancel,
}: {
  message: string;
  show: boolean;
  onCancel: Function;
}) {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" />
      <Button
        // style={({ pressed }: { pressed: boolean }) => [
        //   styles.button,
        //   pressed && {
        //     opacity: 0.7,
        //   },
        // ]}
        mode={"outlined"}
        onPress={() => {
          onCancel(!show);
        }}
      >
        Cancel
      </Button>
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  // buttonText: {
  //   textAlign: "center",
  //   color: GlobalStyles.colors.primary1,
  //   backgroundColor: GlobalStyles.colors.primary5,
  // },
});
