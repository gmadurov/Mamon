import { createDrawerNavigator } from "@react-navigation/drawer";
import { GlobalStyles } from "../constants/styles";
import ProductScreen from "../screens/ProductScreen";
import LogOutScreen from "../screens/LogOutScreen";
import PurchaseScreen from "../screens/PurchaseScreen";
const Drawer = createDrawerNavigator();

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
    >
      {/* <Drawer.Screen
        name="ProductsPage"
        component={ProductScreen}
        options={{
          title: 'Alle Producten',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="PurchaseScreen"
        children={() => <PurchaseScreen />}
        options={{
          title: "My Purchases",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="Producten"
        children={() => <ProductScreen sell />}
        options={{
          title: "Bacchus 2.0",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />

      <Drawer.Screen
        name="Log"
        children={() => <ProductScreen />}
        options={{
          title: "Bacchus 2.0 (Log)",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />

      <Drawer.Screen
        name="EditProduct"
        children={() => <ProductScreen edit />}
        options={{
          title: "Edit products",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen name="LogOut" component={LogOutScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
