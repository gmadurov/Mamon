import { ScrollView, StyleSheet, Text, View } from "react-native";

import React from "react";

function TagDetailScreen(props) {
  const { tag } = props.route.params;

  return (
    <ScrollView style={[styles.wrapper, { padding: 10 }]}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>UID</Text>
        <Text>{tag.id || "---"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TAG OBJECT</Text>
        <Text>{JSON.stringify(tag, null, 2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "gray",
  },
});

export default TagDetailScreen;
