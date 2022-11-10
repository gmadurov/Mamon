import "./polyfills";
import "react-native-gesture-handler";

import * as SplashScreen from "expo-splash-screen";

import FlashMessage, { showMessage } from "react-native-flash-message";
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import ApiContext from "./context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./context/AuthContext";
import { AuthToken } from "./models/AuthToken";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { FullProvider } from "./context/FullContext";
import { GlobalStyles } from "./constants/styles";
import HolderContext from "./context/HolderContext";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import ProductContext from "./context/ProductContext";
import ProductScreen from "./screens/ProductScreen";
import SettingsContext from "./context/SettingsContext";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

function AuthenticatedStack({ isTryingLogin }: { isTryingLogin: boolean }) {
  const Holder = useContext(HolderContext);
  const Product = useContext(ProductContext);
  const Settings = useContext(SettingsContext);
  useEffect(() => {
    async function fetchToken() {
      if (!isTryingLogin) {
        // await Purchase.GET();
        await Settings.GET_categories();
        await Product.GET();
        await Holder.GET();
      }
    }
    fetchToken();
    // eslint-disable-next-line
  }, [isTryingLogin]);
  return (
    <>
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
            // backgroundColor: GlobalStyles.colors.primary1,
          }}
        />
        <Stack.Screen name="LoginPage" component={LoginScreen} />
      </Stack.Navigator>
    </>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const { refreshTokenUsers } = useContext(ApiContext);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokensUsers = (
        await AsyncStorage.multiGet((await AsyncStorage.getAllKeys()).filter((key) => key.includes("authToken")))
      )
        .map((key: any) => JSON.parse(key[1]) as AuthToken)
        .flat();
      // await AsyncStorage.clear()
      // get all the keys that include authToken from AsycnStorage
      // const storedTokensUsers = await AsyncStorage.getItem("authTokenUsers");
      // console.log("data App", typeof storedTokensUsers, storedTokensUsers);
      if (storedTokensUsers) {
        showMessage({
          message: `Authentication woord refreshed`,
          description: ``,
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
        await refreshTokenUsers(storedTokensUsers as AuthToken[]);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
    // eslint-disable-next-line
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isTryingLogin) {
      // This tells the splash screen to hide immediately! If we call this after `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead, we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  if (isTryingLogin) {
    return null;
  }
  return <Navigation onLayout={onLayoutRootView} isTryingLogin={isTryingLogin} />;
}

function Navigation({ onLayout, isTryingLogin }: { onLayout: () => Promise<void>; isTryingLogin: boolean }) {
  const { users } = useContext(AuthContext);
  return <>{users.length < 1 ? <AuthStack /> : <AuthenticatedStack isTryingLogin={isTryingLogin} />}</>;
}
// messages
// "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray)
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar />
          <FullProvider>
            <Root />
          </FullProvider>
          <FlashMessage position="top" />
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
}
