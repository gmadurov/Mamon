import React, { createContext, useEffect, useLayoutEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthToken } from "../models/AuthToken";
import User from "../models/Users";
import jwt_decode from "jwt-decode";
import { showMessage } from "react-native-flash-message";

//  "https://stropdas.herokuapp.com";
//  "http://127.0.0.1:8000";
// export const baseUrl = () => {
//   let url: string;
//   // console.log("process.env.NODE_ENV", process.env.NODE_ENV);

//   if (process.env.NODE_ENV === "development") {
//     url = "https://mamon.esrtheta.nl";
//     url = "http://10.0.2.2:8000";
//   } else if (process.env.NODE_ENV === "production") {
//     url = "https://mamon.esrtheta.nl";
//   } else {
//     url = "http://10.0.2.2:8000";
//   }
//   return url;
// };

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
  loginFunc: (username: string, password: string, setIsAuthenticating: any, card?: string) => Promise<void>;
  logoutFunc(user?: User): Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setAuthTokenUsers: React.Dispatch<React.SetStateAction<AuthToken[]>>;
  storeUsers(data: AuthToken, card?: string): Promise<void>;
  originalRequest<TResponse>(
    url: string,
    config: object
  ): Promise<{
    res: Response;
    data: TResponse;
  }>;
  baseUrl: string;
  setBaseUrl: React.Dispatch<React.SetStateAction<string>>;
};
const AuthContext = createContext({} as AuthContextType);

export default AuthContext;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // dont use useFetch here because it will not work
  const [authTokens, setAuthTokens] = useState<AuthToken>({} as AuthToken);
  const [authTokenUsers, setAuthTokenUsers] = useState<AuthToken[]>([] as AuthToken[]);
  const [user, setUser] = useState<User>({} as User);
  const [users, setUsers] = useState<User[]>([] as User[]);
  /**this function is simply to wake up the backend when working with heroku */
  const [baseUrl, setBaseUrl] = useState<string>("");
  // console.log("baseUrl", baseUrl);

  useLayoutEffect(() => {
    async () => {
      let url = await AsyncStorage.getItem("baseUrl");
      setBaseUrl(url || "");
    };
    return () => { };
  }, []);

  useEffect(() => {
    async function wakeUp() {
      if (baseUrl === "") {
        if (process.env.NODE_ENV === "development") {
          setBaseUrl("https://staging-mamon.esrtheta.nl");
          setBaseUrl("http://10.0.2.2:8000");
        } else if (process.env.NODE_ENV === "production") {
          setBaseUrl("https://mamon.esrtheta.nl");
        }
      }
      await AsyncStorage.setItem("baseUrl", baseUrl);
      await logoutFunc();
    }
    wakeUp();
  }, [baseUrl]);

  async function storeUsers(data: AuthToken, card?: string) {
    let localUser = data?.user
    if (users.length < 1) {
      setAuthTokens(() => data);
      setUser(() => localUser);
    }
    setAuthTokenUsers(() => [...authTokenUsers, data]);
    setUsers(() => [...users, localUser]);
    await AsyncStorage.setItem("authToken" + localUser.id, JSON.stringify(data));
    if (true) {
      await AsyncStorage.setItem('0410308AC85E80', JSON.stringify(data));
    }
  }

  async function loginFunc(username: string, password: string, setIsAuthenticating: any, card?: string) {
    let { res, data } = await originalRequest<AuthToken>(`/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (res?.status === 200) {
      await storeUsers(data, card);
      // console.log(users);
      // await AsyncStorage.setItem("user", JSON.stringify(data.access));
    } else {
      showMessage({
        message: "Account info klopt niet",
        description: data.message ? data?.message : data?.non_field_errors ? data?.non_field_errors : "",
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
    try {
      try {
        if (userOut) {
          // remove user from users
          setUsers(() => users.filter((u) => u.id !== userOut.id));
          setAuthTokenUsers(() =>
            authTokenUsers.filter((u) => (jwt_decode((u?.access as string) || "") as User).id !== userOut.id)
          );
          if (user.id === userOut?.id) {
            setUser(() => users.filter((u) => u.id !== userOut.id)[0] as User);
            setAuthTokens(
              () =>
                authTokenUsers.filter(
                  (u) => (jwt_decode((u?.access as string) || "") as User).id !== userOut.id
                )[0] as AuthToken
            );
          }
          await AsyncStorage.removeItem("authToken" + userOut.id);
        } else {
          setUser(() => ({} as User));
          setUsers(() => [] as User[]);
          await AsyncStorage.multiRemove((await AsyncStorage.getAllKeys()).filter((key) => key.includes("authToken")));
          setAuthTokens(() => ({} as AuthToken));
          setAuthTokenUsers(() => [] as AuthToken[]);
        }
      } catch (err) {
        // await AsyncStorage.multiRemove((await AsyncStorage.getAllKeys()).filter((key) => key.includes("auth")));
      }
    } catch (err) {
      console.log(`Logging out error ${err}`);
    }
    // navigation.replace("LoginPage");
  }
  async function originalRequest<TResponse>(url: string, config: object): Promise<{ res: Response; data: TResponse }> {
    let urlFetch;

    if (!["", null].includes(baseUrl)) {
      urlFetch = `${baseUrl}${url}`;
      // console.log("urlFetch 162", );
    } else {
      urlFetch = `${await AsyncStorage.getItem("baseUrl")}${url}`;
    }
    // console.log(urlFetch, config);
    const res = await fetch(urlFetch, config);
    const data = await res.json();
    // console.log("originalRequest", data, res?.status);
    if (res?.status === 401) {
      await logoutFunc();
    } else if (res?.status !== 200) {
      // Alert.alert(`Error ${res?.status} fetching ${url}`);
      showMessage({
        message: `Error ${res?.status}`,
        description: `fetching ${url}`,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
      });
    }
    return { res, data } as { res: Response; data: TResponse };
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
    originalRequest,
    baseUrl,
    setBaseUrl,
  };
  // user && navigate("../login", { replace: true });
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
