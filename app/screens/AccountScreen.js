import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AuthContext from "../context/AuthContext";
import { GlobalStyles } from "../constants/styles";
import HolderContext from "../context/HolderContext";
import { useNavigation } from "@react-navigation/native";
const AccountScreen = () => {
  const { user, authTokens } = useContext(AuthContext);
  const { holders } = useContext(HolderContext);
  const navigation = useNavigation();
  const holder = holders?.find((holder) => holder.id === user?.user_id);
  useLayoutEffect(() => {
    navigation.setOptions({ title: "My Account €" + holder.stand });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>Name: {user?.name}</Text>
      <Text>User_id: {user?.user_id}</Text>
      <Text>Lid_id: {user?.lid_id}</Text>
      <Text>
        role:
        {user?.role?.map((role) => (
          <Text>{role}</Text>
        ))}
      </Text>
      <Text>Holder info</Text>
      <Text>{holder.stand}</Text>
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
    padding: 10,
  },
});
