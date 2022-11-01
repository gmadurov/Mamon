import AuthContext, { baseUrl } from "../../context/AuthContext";
import { Avatar, Button, Menu, TouchableRipple } from "react-native-paper";
import React, {
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useContext, useState } from "react";

import CartContext from "../../context/CartContext";

type MenuVisibility = {
  [key: string]: boolean | undefined;
};
type ContextualMenuCoord = { x: number; y: number };
const PersonelView = () => {
  const { users, logoutFunc } = useContext(AuthContext);
  const { seller, setSeller } = useContext(CartContext);
  let avatarSize = 50;

  const [visible, setVisible] = useState<MenuVisibility>({});
  const [contextualMenuCoord, setContextualMenuCoor] =
    useState<ContextualMenuCoord>({ x: 0, y: 0 });
  function _toggleMenu(name: string) {
    setVisible({ ...visible, [name]: !visible[name] });
  }
  const _getVisible = (name: string) => !!visible[name];

  return (
    <ScrollView style={styles.container} horizontal={true}>
      {users.map((user) => (
        <View key={user.user_id}>
          <Menu
            visible={_getVisible("user" + user.user_id)}
            onDismiss={() => _toggleMenu("user" + user.user_id)}
            anchor={
              <TouchableRipple
                onLongPress={() => {
                  _toggleMenu("user" + user.user_id);
                  console.log("long press");
                }}
                onPress={() => {
                  setSeller(user);
                }}
              >
                {!user?.image?.includes("default") ? (
                  <Avatar.Image
                    source={{ uri: baseUrl() + user.image }}
                    size={avatarSize}
                  />
                ) : (
                  <Avatar.Text
                    size={avatarSize}
                    label={user?.name?.charAt(0)}
                  />
                )}
              </TouchableRipple>
            }
          >
            <Menu.Item
              onPress={() => {
                logoutFunc(user);
              }}
              title={"Log out " + user.name}
            />
          </Menu>
        </View>
      ))}
    </ScrollView>
  );
};

export default PersonelView;

const styles = StyleSheet.create({ container: {} });
