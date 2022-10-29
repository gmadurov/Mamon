import "./src/polyfills";
import "react-native-gesture-handler";

import * as SplashScreen from "expo-splash-screen";

import FlashMessage, { showMessage } from "react-native-flash-message";
import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import ApiContext from "./src/context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./src/context/AuthContext";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { FullProvider } from "./src/context/FullContext";
import { GlobalStyles } from "./src/constants/styles";
import HolderContext from "./src/context/HolderContext";
import LoginScreen from "./src/screens/LoginScreen";
import { Provider as PaperProvider } from "react-native-paper";
import ProductContext from "./src/context/ProductContext";
import ProductScreen from "./src/screens/ProductScreen";
import PurchaseContext from "./src/context/PurchaseContext";
import SettingsContext from "./src/context/SettingsContext";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<ParamListBase>();

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

  const { user, refreshToken } = useContext(ApiContext);
  const Holder = useContext(HolderContext);
  const Purchase = useContext(PurchaseContext);
  const Product = useContext(ProductContext);
  const Settings = useContext(SettingsContext);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = await AsyncStorage.getItem("authTokens");
      if (storedTokens) {
        showMessage({
          message: `Authentication woord refreshed`,
          description: ``,
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
        const logedIn = await refreshToken(JSON.parse(storedTokens));
        if (logedIn) {
          showMessage({
            message: `Authentication is refreshed`,
            description: ``,
            type: "info",
            floating: true,
            hideStatusBar: true,
            autoHide: true,
            duration: 1500,
          });
        }
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
        await Settings.GET_categories();
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

function Navigation({ onLayout }: { onLayout: () => Promise<void> }) {
  const { user } = useContext(AuthContext);
  return (
    <>
      {!user && <AuthStack />}
      {user && (
        <>
          <AuthenticatedStack />
        </>
      )}
    </>
  );
}
const theme = {
  2: {
    light: GlobalStyles.colors.primary1,
    dark: GlobalStyles.colors.primary2,
  },
  3: {
    light: GlobalStyles.colors.primary3,
    dark: GlobalStyles.colors.primary4,
  },
};
// messages
// "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray)
export default function App() {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <NavigationContainer>
          <FullProvider>
            <PaperProvider>
              <Root />
            </PaperProvider>
          </FullProvider>
        </NavigationContainer>
        <FlashMessage position="top" />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({});
