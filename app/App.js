import "./polyfills";
import "react-native-gesture-handler";

import * as SplashScreen from "expo-splash-screen";

import FlashMessage, { showMessage } from "react-native-flash-message";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import ApiContext from "./context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./context/AuthContext";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { FullProvider } from "./context/FullContext";
import { GlobalStyles } from "./constants/styles";
import HolderContext from "./context/HolderContext";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import {
  Provider as PaperProvider,
} from "react-native-paper";
import ProductContext from "./context/ProductContext";
import ProductScreen from "./screens/ProductScreen";
import PurchaseContext from "./context/PurchaseContext";
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
            backgroundColor: GlobalStyles.colors.primary1,
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
        const user = await refreshToken(JSON.parse(storedTokens), true);
        if (user) {
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

function Navigation() {
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
    <><SafeAreaView style={{flex:1}}>
      <StatusBar style="light" />
      <NavigationContainer>
        <FullProvider>
          <PaperProvider>
            <Root />
          </PaperProvider>
        </FullProvider>
      </NavigationContainer>
      <FlashMessage position="top" /></SafeAreaView >
    </>
  );
}

const styles = StyleSheet.create({});
