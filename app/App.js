import { StatusBar } from "expo-status-bar";
import "./polyfills";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";

import ProductScreen from "./screens/ProductScreen";
import { FullProvider } from "./context/FullContext";
import LoginScreen from "./screens/LoginScreen";
import { GlobalStyles } from "./constants/styles";
import AuthContext from "./context/AuthContext";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import * as SplashScreen from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerNavigator from "./navigation/DrawerNavigator";
import ApiContext from "./context/ApiContext";
import HolderContext from "./context/HolderContext";
import PurchaseContext from "./context/PurchaseContext";
import ProductContext from "./context/ProductContext";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary2 },
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
          title: "Mamon",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Stack.Screen name="LoginPage" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const { user, refreshToken } = useContext(ApiContext);
  const Holder = useContext(HolderContext);
  const Purchase = useContext(PurchaseContext);
  const Product = useContext(ProductContext);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = await AsyncStorage.getItem("authTokens");
      if (storedTokens) {
        console.log("refresh app 1");
        await refreshToken(JSON.parse(storedTokens), true);
        console.log("refresh app 2");
      }
      setIsTryingLogin(false);
    }
    fetchToken();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    async function fetchToken() {
      if (!isTryingLogin) {
        await Purchase.GET();
        await Product.GET();
        await Holder.GET();
      }
    }
    fetchToken();
    // eslint-disable-next-line
  }, [isTryingLogin]);

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

const styles = StyleSheet.create({});
