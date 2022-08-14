import { createDrawerNavigator } from "@react-navigation/drawer";
import { GlobalStyles } from "../constants/styles";
import ProductScreen from "../screens/ProductScreen";
import Cart from "./components/Cart";
import LogOutScreen from "./screens/LogOutScreen";
const Drawer = createDrawerNavigator();

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
        name="Producten"
        children={() => <ProductScreen sell={true} />}
        options={{
          title: "Bacchus 2.0",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="Log"
        children={() => <ProductScreen sell={false} />}
        options={{
          title: "Bacchus 2.0 (Log)",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen name="Cart" children={() => <Cart sell={true} />} />
      <Drawer.Screen name="LogCart" children={() => <Cart sell={false} />} />
      <Drawer.Screen name="LogOut" component={LogOutScreen} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator