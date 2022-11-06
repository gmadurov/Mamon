import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React, { useContext } from "react";

import AuthContext from "../context/AuthContext";
import CategoryScreen from "../screens/CategoryScreen";
import LoginScreen from "../screens/LoginScreen";
import ProductScreen from "../screens/ProductScreen";
import ReportScreen from "../screens/ReportScreen";
import ScanCard from "../screens/ScanCard";
import SettingsContext from "../context/SettingsContext";
import TagDetailScreen from "../screens/ScanCard_tagDetail";
import WalletUpgrateScreen from "../screens/WalletUpgrateScreen";

const Drawer = createDrawerNavigator();

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  const { setSideBySide } = useContext(SettingsContext);
  const { logoutFunc } = useContext(AuthContext);
  return (
    <Drawer.Navigator
      // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="_Set Side by Side view"
              onPress={() => setSideBySide((nu) => !nu)}
            />
            <DrawerItem
              label="Uitlogen"
              onPress={async () => await logoutFunc()}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="ScanCard"
        component={ScanCard}
        options={{
          title: "Scan Card",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="Producten"
        children={() => <ProductScreen sell />}
        options={{
          title: "Mamon",
          // backgroundColor: GlobalStyles.colors.primary1,
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
      <Drawer.Screen
        name="Personeel"
        children={() => <LoginScreen extra />}
        options={{ title: "Personeel" }}
      />
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
      <Drawer.Screen
        name="TagDetail"
        component={TagDetailScreen}
        options={{
          title: "Tag Detail",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      
      
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
