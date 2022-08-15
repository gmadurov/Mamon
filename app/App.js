import { StatusBar } from "expo-status-bar";
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

const Stack = createNativeStackNavigator();

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

  const { refreshToken } = useContext(ApiContext);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = await AsyncStorage.getItem("authTokens");
      // const storedTokens = {refresh: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY2MDU5NDg0NCwiaWF0IjoxNjYwNTg5NDQ0LCJqdGkiOiJlMGY3YWZhODRkNzU0NGJjOWZlODgwZGNkNjhhMTRiMCIsInVzZXJfaWQiOjEsIm5hbWUiOiJHIE1hZHVybyIsInJvbGVzIjpbXSwiaG9sZGVyX2lkIjoxfQ.tsadTwKMDE9xGrGGFygUvfrz_hbT1f0JD3KOqEEGhkY"}
      if (storedTokens) {
        await refreshToken(storedTokens);
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

function Navigation() {
  const { user } = useContext(AuthContext);
  console.log({user});
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
