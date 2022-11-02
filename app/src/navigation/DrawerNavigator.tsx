import CategoryScreen from "../screens/CategoryScreen";
import LogOutScreen from "../screens/LogOutScreen";
import LoginScreen from "../screens/LoginScreen";
import PersonelSreen from "../screens/PersonelSreen";
import ProductScreen from "../screens/ProductScreen";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
    >
      <Drawer.Screen
        name="Producten"
        children={() => <ProductScreen sell />}
        options={{
          title: "Mamon",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="Personeel"
        children={() => <LoginScreen extra />}
        options={{ title: "Personeel" }}
      />

      <Drawer.Screen
        name="Log"
        children={() => <ProductScreen />}
        options={{
          title: "Mamon Logging",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      {/* <Drawer.Screen
        name="PurchaseScreen"
        children={() => <PurchaseScreen />}
        options={{
          title: "My Purchases",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      /> */}
      {/* <Drawer.Screen
        name="AccountScreen"
        children={() => <AccountScreen />}
        options={{
          title: "My Account",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      /> */}
      {/* <Drawer.Screen 
        name="EditProduct"
        children={() => <ProductScreen edit />}
        options={{
          title: "Edit products",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      /> */}
      <Drawer.Screen
        name="Categorieën"
        children={() => <CategoryScreen />}
        options={{
          title: "Categorieën",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen name="Log Out Iedereen" component={LogOutScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
