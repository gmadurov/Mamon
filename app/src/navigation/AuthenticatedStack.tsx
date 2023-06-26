import React, { useContext, useEffect } from "react";
import { GlobalStyles } from "../constants/styles";
import HolderContext from "../context/HolderContext";
import ProductContext from "../context/ProductContext";
import SettingsContext from "../context/SettingsContext";
import ProductScreen from "../screens/ProductScreen";
import DrawerNavigator from "./DrawerNavigator";
import { Stack } from "./Navigators";

export function AuthenticatedStack({ isTryingLogin }: { isTryingLogin: boolean }) {
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
          initialRouteName="Drawer"
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
        </Stack.Navigator>
      </>
    );
  }
  