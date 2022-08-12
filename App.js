import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";

import ProductScreen from "./screens/ProductScreen";
import { FullProvider } from "./context/FullContext";
import LoginScreen from "./screens/LoginScreen";
import Cart from "./components/Cart";
import { GlobalStyles } from "./constants/styles";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
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
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <FullProvider>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: GlobalStyles.colors.primary3 },
              headerTintColor: "white",
              contentStyle: { backgroundColor: GlobalStyles.colors.primary1 },
            }}
          >
            <Stack.Screen
              name="Drawer"
              component={DrawerNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProductsPage"
              component={ProductScreen}
              options={{
                title: "Bacchus 2.0",
                backgroundColor: GlobalStyles.colors.primary1,
              }}
            />
            <Stack.Screen name="LoginPage" component={LoginScreen} />
          </Stack.Navigator>
        </FullProvider>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
