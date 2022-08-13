import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";

import ProductScreen from "./screens/ProductScreen";
import { FullProvider } from "./context/FullContext";
import LoginScreen from "./screens/LoginScreen";
import Cart from "./components/Cart";
import { GlobalStyles } from "./constants/styles";
import AuthContext from "./context/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import LogOutScreen from "./screens/LogOutScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary5 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary1 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
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
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const { refreshTokens } = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedTokens = await AsyncStorage.getItem("authTokens");
      if (storedTokens) {
        refreshTokens(storedTokens);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isTryingLogin) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  if (isTryingLogin) {
    return null;
  }
  return <Navigation onLayout={onLayoutRootView} />;
}

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
      <Drawer.Screen name="LogOut" component={LogOutScreen} />
    </Drawer.Navigator>
  );
}
function Navigation() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {!user && <AuthStack />}
      {user && <AuthenticatedStack />}
    </>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <FullProvider>
          <Root />
        </FullProvider>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
