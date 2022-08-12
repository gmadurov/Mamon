import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { createContext, useContext } from "react";
import AuthContext, { baseUrl } from "./AuthContext";
// import { AsyncStorage } from "@react-native-community/async-storage";

// ("https://stropdas2.herokuapp.com/");
/**### use this instead of fetch
 * user: user, type
 * {"token_type": string,"exp": unix date,"iat": unix date,"jti": string,"user_id": Int,"name": string,"roles": [ ],"lid_id": Int}
 *
 * ApiRequest: ApiRequest,
 * ### use this instead of fetch
 * @params {url: string , config : object}
 * @returns \{ res, data \}
 *
 * ApiFileRequest: ApiFileRequest,
 * ### use this instead of fetch for files
 * @params {url: string , config : object}
 * @returns \{ res, data \} */
const ApiContext = createContext();
export default ApiContext;

export const ApiProvider = ({ children }) => {
  // will work from AuthProvider downwards,
  const { user, setAuthTokens, setUser, authTokens, logoutFunc } =
    useContext(AuthContext);
  /** makes the original request called but with the Bearer set and to the correct location */
  const originalRequest = async (url, config) => {
    let urlFetch = `${baseUrl()}${url}`;
    const res = await fetch(urlFetch, config);
    const data = await res.json();
    if (res.status !== 200) {
      console.log(`Error ${res.status} fetching ${url}`);
    }
    return [res, data];
  };
  /** gets the refresh token and update the local state and local storage */
  const refreshToken = async (authTokens) => {
    const res = await fetch(`${baseUrl()}/api/users/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh: authTokens?.refresh,
      }),
    });
    let data = await res.json();
    if (res.status === 200) {
      setAuthTokens(data); // if cycling refresh tokens
      setUser(() => jwt_decode(data.access));
      // AsyncStorage.setItem("authTokens", JSON.stringify(data)); // if cycling refresh tokens
      // AsyncStorage.setItem("user", JSON.stringify(data.access));
    } else {
      console.log(`Problem met de refresh token: ${res}`);
      logoutFunc();
    }
  };
  /** ## use this instead of fetch
   * @params {url: string , config : object}
   * @returns \{ res, data \}*/
  const ApiRequest = async (url, config = {}) => {
    // const isExpiredRefresh =
    //   dayjs.unix(authTokens?.refresh?.exp).diff(dayjs(), "minute") < 1;
    // const isExpired = dayjs.unix(user?.exp).diff(dayjs(), "minute") < 1;
    // if (isExpiredRefresh) {
    //   console.log("refresh token is expired, you were logged out");
    //   logoutFunc();
    // } else {
    //   // refreshToken(authTokens);
    // }
    // if (isExpired && authTokens) {
    //   refreshToken(authTokens);
    // }
    // config["headers"] = {
    //   Authorization: `Bearer ${authTokens?.access}`,
    // };
    // if (!config["headers"]["Content-type"]) {
    //   config["headers"]["Content-type"] = "application/json";
    // }
    // // if (user) {
    // //   const [res, data] = await originalRequest(url, config);
    // //   if (res !== 200) {
    // //     console.log("request Failed");
    // //   } else {
    // //     return { res, data };
    // //   }
    // // }
    const [res, data] = await originalRequest(url, config);
    return { res, data };
  };
  /** ## ust this instead of fetch for Files
   * @params {url: string , config : object}
   * @returns \{ res, data \}*/
  const ApiFileRequest = async (url, config = {}) => {
    const isExpired = dayjs.unix(user?.exp).diff(dayjs(), "minute") < 1;
    if (isExpired) {
      refreshToken(authTokens);
    }
    config["headers"] = {
      Authorization: `Authentication ${authTokens?.access}`,
    };
    if (user) {
      const [res, data] = await originalRequest(url, config);
      if (res.status === 401) {
        console.log("Unauthorized", url, config);
      }
      if (res.status === 403) {
        console.log("Permision denied", url, config);
      }
      return { res, data };
    }

    // console.log("input", url);
  };

  const value_dic = {
    user: user,
    ApiRequest: ApiRequest,
    ApiFileRequest: ApiFileRequest,
  };
  return (
    <ApiContext.Provider value={value_dic}>{children}</ApiContext.Provider>
  );
};
