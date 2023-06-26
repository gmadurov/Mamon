import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import AuthContext from "../context/AuthContext";

export default function PersonelSreen() {
  const { users } = useContext(AuthContext);
  return (
    <View style={styles.first}>
      {users.map((user) => (
        <Text key={user.id}>{user.id}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  first: {},
  second: { color: "blue" },
});
