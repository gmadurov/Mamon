import React, { createContext, useContext } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./AuthContext";
import { AuthToken } from "../models/AuthToken";
import User from "../models/Users";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import { showMessage } from "react-native-flash-message";

/**### use this instead of fetch
 * user: user, type
 * {"token_type": string,"exp": unix date,"iat": unix date,"jti": string,"user_id": Int,"name": string,"roles": [ ],"user_id": Int}
 *
 * ApiRequest: ApiRequest,
 * ### use this instead of fetch
 * @params {url: string , config : object}
 * @returns \{ res, data \}
 *
 * ApiFileRequest: ApiFileRequest,
 * ### use this instead of fetch for files
 * @params {url: string , config : object}
 * @returns \{ res, data \}
 *
 * refreshToken: refreshToken
 * use this to refresh tockens
 * */

// recreate file in typscript

export type ApiContextType = {
  user: User | null;
  users: User[];
  ApiRequest<TResponse>(
    url: string,
    config?: {
      headers?: { [key: string]: any; "Content-Type": string };
      [key: string]: any;
    }
  ): Promise<{ res: Response; data: TResponse }>;
  ApiFileRequest<TResponse>(
    url: string,
    config?: {
      headers?: { [key: string]: any; "Content-Type": string };
      [key: string]: any;
    }
  ): Promise<{ res: Response; data: TResponse }>;
  refreshToken: (authTokens: AuthToken) => Promise<boolean>;
  refreshTokenUsers(authTokens: AuthToken[]): Promise<void>;
  baseUrl: string;
};

const ApiContext = createContext<ApiContextType>({} as ApiContextType);

export default ApiContext;

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  // will work from AuthProvider downwards,
  const {
    user,
    users,
    setAuthTokens,
    setUser,
    setUsers,
    authTokens,
    logoutFunc,
    authTokenUsers,
    setAuthTokenUsers,
    originalRequest,
    baseUrl,
  } = useContext(AuthContext);

  /** makes the original request called but with the Bearer set and to the correct location */

  /** gets the refresh token and update the local state and local storage */
  async function refreshToken(authToken: AuthToken): Promise<boolean> {
    const controller = new AbortController();
    const { signal } = controller;
    const { res, data } = await originalRequest<AuthToken>(`/api/login/refresh/`, {
      signal,
      method: "POST",
      headers: { Accept: "*/*", "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh: authToken?.refresh,
      }),
    });
    // setTimeout(() => controller.abort(), 2000);
    if (res?.status === 200) {
      setAuthTokens(data); // if cycling refresh tokens
      setUser(jwt_decode(data?.access as string) as User);
      await AsyncStorage.setItem("authTokens", JSON.stringify(data)); // if cycling refresh tokens
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } else {
      // console.log(`Problem met de refresh token: ${res?.status}`);
      showMessage({
        message: "Refresh token expired",
        description: "Je hebt de app in te lang niet gebruikt, je woord uitgelogged",
        type: "info",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
      });
      await logoutFunc();
      return false;
    }
    // cancels the request if it taking too long
  }
  async function refreshTokenUsers(authTokens: AuthToken[]) {
    // console.log({ type1: typeof authTokens, authTokens });
    let usersLocal = [] as User[];
    let tokens = [] as AuthToken[];
    // console.log(await AsyncStorage.getAllKeys());
    // await AsyncStorage.clear()
    // console.log(await AsyncStorage.getAllKeys());
    authTokens.map(async (authToken, index) => {
      const currentUser = (authToken?.user);
      if (currentUser.id in usersLocal.map((u) => u.id)) {
        return;
      }
      // console.log({ index, currentUser, type: typeof authToken });
      const controller = new AbortController();
      const { signal } = controller;
      const { res, data } = await originalRequest<AuthToken>(`/api/login/refresh/`, {
        signal,
        method: "POST",
        headers: { Accept: "*/*", "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh: authToken?.refresh,
        }),
      });
      setTimeout(() => controller.abort(), 2000);
      let localUser = data?.user;
      if (res?.status === 200) {
        if (index === 0) {
          setAuthTokens(() => data);
          setUser(() => localUser);
        }
        await AsyncStorage.removeItem("authToken" + localUser.id);
        await AsyncStorage.setItem("authToken" + localUser.id, JSON.stringify(data));
        !usersLocal.some((u) => u.id === localUser.id) && tokens.push(data);
        !usersLocal.some((u) => u.id === localUser.id) && usersLocal.push(localUser);
        // console.log(usersLocal, tokens);
        // await AsyncStorage.setItem(
        //   "authToken" + localUser.user_id,
        //   JSON.stringify([...authTokenUsers, data])
        // );
        // await AsyncStorage.setItem("authToken", JSON.stringify(tokens));
        setAuthTokenUsers(() => [...tokens]);
        setUsers(() => [...usersLocal]);
        showMessage({
          message: `Authentication is refreshed`,
          description: ``,
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
      } else {
        // console.log(`Problem met de refresh token: ${res?.status}`);
        showMessage({
          message: "Refresh token expired",
          description: "Je hebt de app in te lang niet gebruikt, je woord uitgelogged",
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
        await logoutFunc(currentUser);
      }
    });

    // cancels the request if it taking too long
  }

  async function checkTokens() {
    const isExpired = user ? dayjs.unix(user.exp).diff(dayjs(), "minute") < 1 : false;
    const isExpiredRefresh = authTokens
      ? dayjs.unix((jwt_decode(authTokens.refresh as string) as User).exp).diff(dayjs(), "minute") < 1
      : true;
    if (isExpiredRefresh) {
      // Alert.alert("refresh token has expired, you were logged out");
      await logoutFunc();
      showMessage({
        message: "Refresh token has expired, you were logged out",
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
      });
    }
    if (isExpired && authTokens) {
      await refreshToken(authTokens);
    }
  }
  /** ## use this instead of fetch
   * @params {url: string , config : object}
   * @returns \{ res, data \}*/
  async function ApiRequest<TResponse>(
    url: string,
    config: {
      headers?: { [key: string]: any; "Content-Type": string };
      [key: string]: any;
    } = {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
          "Content-Type": "application/json",
        },
      }
  ) {
    await checkTokens();
    if (!config.headers?.["Content-Type"]) {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }
    if (config.headers?.Authorization === undefined) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authTokens?.access}`,
      };
    }

    if (users.length > 0) {
      const { res, data } = await originalRequest<TResponse>(url, config);
      // if (res?.status === 200) {
      // console.warn("request Failed", res?.status);
      return { res: res, data: data };
      // }
    }
    return { res: {} as Response, data: {} as TResponse };
  }
  // /** ## ust this instead of fetch for Files
  //  * @params {url: string , config : object}
  //  * @returns \{ res, data \}*/
  async function ApiFileRequest<TResponse>(
    url: string,
    config:
      | {
        headers?: { [key: string]: any; "Content-Type": "application/json" };

        [key: string]: any;
      }
      | undefined = {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
          "Content-Type": "application/json",
        },
      }
  ): Promise<{ res: Response; data: TResponse }> {
    await checkTokens();
    if (users.length > 0) {
      const { res, data } = await originalRequest<TResponse>(url, config);
      if (res?.status === 401) {
        // Alert.alert("", url, config);
        showMessage({
          message: `Unauthorized`,
          description: ``,
          type: "danger",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
      }
      if (res?.status === 403) {
        // Alert.alert("", url, config);
        showMessage({
          message: `Permision denied`,
          description: ``,
          type: "danger",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
      }
      return { res, data };
    }
    return { res: {} as Response, data: {} as TResponse };

    // console.log("input", url);
  }

  const value_dic = {
    user: user,
    users: users,
    ApiRequest: ApiRequest,
    ApiFileRequest: ApiFileRequest,
    refreshToken: refreshToken,
    refreshTokenUsers: refreshTokenUsers,
    baseUrl,
  };
  return <ApiContext.Provider value={value_dic}>{children}</ApiContext.Provider>;
};
