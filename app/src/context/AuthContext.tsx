import React, { createContext, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthToken } from "../models/AuthToken";
import User from "../models/Users";
import jwt_decode from "jwt-decode";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";

//  "https://stropdas.herokuapp.com";
//  "http://127.0.0.1:8000";
export const baseUrl = () => {
  let url: string;
  // console.log("process.env.NODE_ENV", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    url = "https://mamon.esrtheta.nl";
    // url = "http://10.0.2.2:8000";
  } else if (process.env.NODE_ENV === "production") {
    url = "https://mamon.esrtheta.nl";
    // showMessage({
    //   message: "Production mode",
    //   type: "info",
    // });
  } else {
    url = "http://10.0.2.2:8000";
  }
  return url;
};

interface FailedData extends AuthToken {
  message: string;
  data: string;
}

export type AuthContextType = {
  user: User;
  users: User[];
  authTokens: AuthToken;
  authTokenUsers: AuthToken[];
  setAuthTokens: React.Dispatch<React.SetStateAction<AuthToken>>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  loginFunc: (
    username: string,
    password: string,
    setIsAuthenticating: any
  ) => Promise<void>;
  logoutFunc(user?: User): Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setAuthTokenUsers: React.Dispatch<React.SetStateAction<AuthToken[]>>;
  storeUsers(data: AuthToken): Promise<void>;
};
const AuthContext = createContext({} as AuthContextType);

export default AuthContext;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // dont use useFetch here because it will not work
  const navigation = useNavigation();
  const [authTokens, setAuthTokens] = useState<AuthToken>({} as AuthToken);
  const [authTokenUsers, setAuthTokenUsers] = useState<AuthToken[]>(
    [] as AuthToken[]
  );
  const [user, setUser] = useState<User>({} as User);
  const [users, setUsers] = useState<User[]>([] as User[]);
  /**this function is simply to wake up the backend when working with heroku */

  async function storeUsers(data: AuthToken) {
    let localUser = jwt_decode((data?.access as string) || "") as User;
    if (users.length < 1) {
      setAuthTokens(() => data);
      setUser(() => localUser);
    }
    setAuthTokenUsers(() => [...authTokenUsers, data]);
    setUsers(() => [...users, localUser]);
    await AsyncStorage.setItem(
      "authToken" + localUser.user_id,
      JSON.stringify([...authTokenUsers, data])
    );
  }

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
      storeUsers(data);
      // console.log(users);
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
      // navigation.navigate({"Producten"});
    }
    setIsAuthenticating(false);
  }

  async function logoutFunc(userOut?: User) {
    if (userOut) {
      // remove user from users
      setUsers(() => users.filter((u) => u.user_id !== userOut.user_id));
      setAuthTokenUsers(() =>
        authTokenUsers.filter(
          (u) =>
            (jwt_decode((u?.access as string) || "") as User).user_id !==
            userOut.user_id
        )
      );
      if (user.user_id === userOut?.user_id) {
        setUser(
          () => users.filter((u) => u.user_id !== userOut.user_id)[0] as User
        );
        setAuthTokens(
          () =>
            authTokenUsers.filter(
              (u) =>
                (jwt_decode((u?.access as string) || "") as User).user_id !==
                userOut.user_id
            )[0] as AuthToken
        );
      }
      await AsyncStorage.removeItem("authToken" + userOut.user_id);
    } else {
      setUser(() => ({} as User));
      setUsers(() => [] as User[]);
      await AsyncStorage.multiRemove(
        (
          await AsyncStorage.getAllKeys()
        ).filter((key) => key.includes("authToken"))
      );
      setAuthTokens(() => ({} as AuthToken));
      setAuthTokenUsers(() => [] as AuthToken[]);
    }
    // navigation.replace("LoginPage");
  }
  const data = {
    loginFunc: loginFunc,
    logoutFunc: logoutFunc,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    user: user,
    users: users,
    authTokens: authTokens,
    setUsers,
    setAuthTokenUsers,
    authTokenUsers,
    storeUsers,
  };
  // user && navigate("../login", { replace: true });
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
