import React, { createContext, useState } from "react";
import { hideMessage, showMessage } from "react-native-flash-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthToken } from "../models/AuthToken";
import User from "../models/Users";
import jwt_decode from "jwt-decode";
import { useNavigation } from "@react-navigation/native";

//  "https://stropdas.herokuapp.com";
//  "http://127.0.0.1:8000";
export const baseUrl = () => {
  let url: string;
  if (process.env.NODE_ENV === "development") {
    url = "https://mamon.esrtheta.nl";
  } else if (process.env.NODE_ENV === "production") {
    url = "https://mamon.esrtheta.nl";
  } else {
    url = "http://10.0.2.2:8000";
  }
  return url;
};

export type AuthContextType = {
  user: User | undefined;
  authTokens: AuthToken | undefined;
  setAuthTokens: (authTokens: AuthToken) => void;
  setUser: (user: User) => void;
  loginFunc: (
    username: string,
    password: string,
    setIsAuthenticating: any
  ) => Promise<void>;
  logoutFunc: () => Promise<void>;
};
const AuthContext = createContext({} as AuthContextType);

export default AuthContext;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // dont use useFetch here because it will not work

  const [authTokens, setAuthTokens] = useState<AuthToken>();
  const [user, setUser] = useState<User>();
  /**this function is simply to wake up the backend when working with heroku */
  const start = async () => {
    await fetch(`${baseUrl()}`);
  };
  const navigation = useNavigation();

  async function loginFunc(
    username: string,
    password: string,
    setIsAuthenticating: any
  ) {
    let res: Response = await fetch(`${baseUrl()}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    let data: AuthToken = await res.json();
    if (res?.status === 200) {
      setAuthTokens(() => data);
      setUser(() => jwt_decode(data.access));
      await AsyncStorage.setItem("authTokens", JSON.stringify(data));
      // await AsyncStorage.setItem("user", JSON.stringify(data.access));
      // navigation.replace("ProductsPage");
    } else {
      showMessage({
        message: "Account info klopt niet",
        description: data.message
          ? data?.message
          : data?.non_field_errors
          ? data?.non_field_errors
          : "",
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 3500,
      });
      setIsAuthenticating(false);
      // navigation.navigate(-1);
    }
  }

  async function logoutFunc() {
    // console.log("loged Out", AsyncStorage.getAllKeys());"user"
    await AsyncStorage.multiRemove(["authTokens"]);
    setAuthTokens(undefined);
    setUser(undefined);
    // navigation.replace("LoginPage");
  }
  const data = {
    loginFunc: loginFunc,
    logoutFunc: logoutFunc,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    user: user,
    authTokens: authTokens
  };
  // user && navigate("../login", { replace: true });
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
