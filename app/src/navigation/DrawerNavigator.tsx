import { Appbar, Divider } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import React, { useContext } from "react";

import AuthContext from "../context/AuthContext";
import CategoryScreen from "../screens/CategoryScreen";
import FullContext from "../context/FullContext";
import LinkCardScreen from "../screens/LinkCardScreen";
import LoginScreen from "../screens/LoginScreen";
import NFCContext from "../context/NFCContext";
import ProductScreen from "../screens/ProductScreen";
import ReportScreen from "../screens/ReportScreen";
import SettingsContext from "../context/SettingsContext";
import WalletUpgrateScreen from "../screens/WalletUpgrateScreen";

const Drawer = createDrawerNavigator();

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  const { setEnableBottomSearch } = useContext(FullContext);
  const { setSideBySide } = useContext(SettingsContext);
  const { logoutFunc, users, baseUrl, setBaseUrl } = useContext(AuthContext);
  const { setEnabled, supported, NFCreading } = useContext(NFCContext);

  return (
    <Drawer.Navigator
      // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label={baseUrl}
              onPress={() => {
                if (baseUrl === "https://mamon.esrtheta.nl") {
                  setBaseUrl("https://staging-mamon.esrtheta.nl");
                } else if (baseUrl === "https://staging-mamon.esrtheta.nl") {
                  setBaseUrl("https://mamon.esrtheta.nl");
                }
              }}
            />
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
        children={() => <ProductScreen sell />}
        options={{
          title: "Mamon",
        }}
      />

      <Drawer.Screen
        name="Log"
        children={() => <ProductScreen />}
        options={{
          title: "Mamon (Cash/Pin)",
          // backgroundColor: GlobalStyles.colors.primary1,
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
          title: "Wallet opwaderen ",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      {users.some((user) => user?.roles.includes("Tapper") || user?.roles.includes("Linker")) && (
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
