import "react-native-gesture-handler";
import "./polyfills";

import * as SplashScreen from "expo-splash-screen";

import React, { useCallback, useContext, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import ApiContext from "./context/ApiContext";
import AuthContext from "./context/AuthContext";
import { FullProvider } from "./context/FullContext";
import { AuthToken } from "./models/AuthToken";
import { AuthenticatedStack } from "./navigation/AuthenticatedStack";
import { AuthStack } from "./navigation/AuthStack";

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
