import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import React, { useContext, useEffect } from "react";

import { Linking } from "react-native";
import ApiContext from "../context/ApiContext";
import AuthContext from "../context/AuthContext";
import FullContext from "../context/FullContext";
import NFCContext from "../context/NFCContext";
import SettingsContext from "../context/SettingsContext";
import CategoryScreen from "../screens/CategoryScreen";
import LinkCardScreen from "../screens/LinkCardScreen";
import LoginScreen from "../screens/LoginScreen";
import ProductScreen from "../screens/ProductScreen";
import ReportScreen from "../screens/ReportScreen";
import WalletUpgrateScreen from "../screens/WalletUpgrateScreen";
import { Drawer } from "./Navigators";


/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  const { setEnableBottomSearch } = useContext(FullContext);
  const { setSideBySide } = useContext(SettingsContext);
  const { ApiRequest } = useContext(ApiContext);
  const { logoutFunc, users, baseUrl, setBaseUrl } = useContext(AuthContext);
  const { setEnabled, supported, NFCreading } = useContext(NFCContext);
  let updateURL: string;
  // useEffect(() => {
  //   const getUpdateURL = async () => {
  //     const { data } = await ApiRequest<{ variable?: string }>("/api/environment/open_update_url/");
  //     updateURL = data.variable || "";
  //   };
  //   getUpdateURL();
  // }, []);
  return (
    <Drawer.Navigator
      // initialRouteName="WalletUpgrateScreen"
      // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            {supported && <DrawerItem label="_Disabled NFC" onPress={() => setEnabled((nu) => !nu)} />}
            <DrawerItem label="Toggle Side by Side" onPress={() => setSideBySide((nu) => !nu)} />
            <DrawerItem label="Toggle Bottom Search" onPress={() => setEnableBottomSearch((nu) => !nu)} />
            <DrawerItem label="Uitlogen" onPress={async () => await logoutFunc()} />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="Producten"
        children={() => <ProductScreen />}
        options={{
          title: "Mamon",
        }}
      />
      <Drawer.Screen
        name="Categorieën"
        children={() => <CategoryScreen />}
        options={{
          title: "Categorieën",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen name="Personeel" children={() => <LoginScreen extra />} options={{ title: "Personeel" }} />
      <Drawer.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          title: "Report",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="WalletUpgrateScreen"
        component={WalletUpgrateScreen}
        options={{
          title: "Wallet opwarderen",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      { (
        // supported &&
        <Drawer.Screen
          name="LinkCardScreen"
          component={LinkCardScreen}
          options={{
            title: "Link cards",
            // backgroundColor: GlobalStyles.colors.primary1,
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
