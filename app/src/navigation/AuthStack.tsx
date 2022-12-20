import React from "react";
import { GlobalStyles } from "../constants/styles";
import LoginScreen from "../screens/LoginScreen";

import { Stack } from "./Navigators";


export function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: GlobalStyles.colors.primary2 },
                headerTintColor: "white",
                contentStyle: { backgroundColor: GlobalStyles.colors.primary1 },
            }}
        >
            <Stack.Screen name="LoginPage" component={LoginScreen} />
            {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
        </Stack.Navigator>
    );
}