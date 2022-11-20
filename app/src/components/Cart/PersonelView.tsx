import { Avatar, Menu, TouchableRipple } from "react-native-paper";
import React, { ScrollView, StyleSheet, View } from "react-native";
import { useContext, useState } from "react";

import AuthContext from "../../context/AuthContext";
import CartContext from "../../context/CartContext";
import Holder from "../../models/Holder";
import User from "../../models/Users";

type MenuVisibility = {
  [key: string]: boolean | undefined;
};
const PersonelView = () => {
  const { users, logoutFunc, baseUrl } = useContext(AuthContext);
  const { seller, setSeller,setBuyer, setCart } = useContext(CartContext);
  let avatarSize = 50;

  const [visible, setVisible] = useState<MenuVisibility>({});
  function _toggleMenu(name: string) {
    setVisible({ ...visible, [name]: !visible[name] });
  }
  const _getVisible = (name: string) => !!visible[name];

  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={true}>
      {users.map((user) => (
        <View
          key={user.user_id}
          style={[
            styles.item,
            seller.user_id === user.user_id
              ? { opacity: 1.0 }
              : { opacity: 0.5 },
          ]}
        >
          <Menu
            visible={_getVisible("user" + user.user_id)}
            onDismiss={() => _toggleMenu("user" + user.user_id)}
            anchor={
              <TouchableRipple
                onLongPress={() => {
                  _toggleMenu("user" + user.user_id);
                }}
                onPress={() => {
                  setSeller(user);
                }}
              >
                {!user?.image?.includes("default") ? (
                  <Avatar.Image
                    source={{ uri: baseUrl + user.image }}
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
                setSeller({} as User);
                setBuyer({} as Holder);
                setCart([]);
              }}
              title={"Cart Legmaken "}
            />
            <Menu.Item
              onPress={() => {
                setSeller({} as User);
              }}
              title={"Verkoper weghalen "}
            />
            <Menu.Item
              onPress={() => {
                setSeller(user);
              }}
              title={"Zet als Verkoper"}
            />
            <Menu.Item
              onPress={() => {
                logoutFunc(user);
              }}
              title={"Log out " + user.nickname}
            />
          </Menu>
        </View>
      ))}
    </ScrollView>
  );
};

export default PersonelView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 10,
  },
});
