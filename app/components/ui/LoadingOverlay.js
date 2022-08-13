import { Button } from "@rneui/themed";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
function LoadingOverlay({ message, show, onCancel }) {

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" />
      <Button
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => {
          onCancel(!show)
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
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: GlobalStyles.colors.primary1,
    backgroundColor: GlobalStyles.colors.primary5,
  },
});
