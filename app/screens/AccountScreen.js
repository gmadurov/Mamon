import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AuthContext from "../context/AuthContext";
import { GlobalStyles } from "../constants/styles";

const AccountScreen = () => {
  const { user, authTokens } = useContext(AuthContext);
  useEffect(() => {
    async function get() {
      const authTokens = await AsyncStorage.getItem("authTokens");
      console.log(authTokens);
    }

    get();
    // eslint-disable-next-line
  }, []);

  return (
    <View style={styles.container}>
      <Text>Access: {authTokens?.access}</Text>
      <Text>Refresh: {authTokens?.refresh}</Text>
      <Text>name: {user?.name}</Text>
      <Text>user_id: {user?.user_id}</Text>
      <Text>lid_id: {user?.lid_id}</Text>
      <Text>exp: {user?.exp}</Text>
      <Text>
        role:{" "}
        {user?.role?.map((role) => (
          <Text>{role}</Text>
        ))}
      </Text>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: GlobalStyles.colors.textColorDark,
    borderColor: GlobalStyles.colors.primary2,
    backgroundColor: GlobalStyles.colors.primary1,
  },
});
