import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import jwt_decode from "jwt-decode";

//  "https://stropdas.herokuapp.com";
//  "http://127.0.0.1:8000";
export const baseUrl = () => {
  let LOCAL = true;
  let url;
  if (LOCAL) {
    url = "http://10.0.2.2:8000"; // this is what works for local tests
  } else {
    url = "";
  }
  return url;
};

/** loginFunc: loginFunc,
 *
 * logoutFunc: logOutUser,
 *
 * setAuthTokens: setAuthTokens,
 *
 * setUser: setUser,
 *
 * user: user,
 * {
  "token_type": "access",
  "exp": unixdata,
  "iat": unix date,
  "jti": "",
  "user_id": Int,
  "name": "",
  "role": [],
  "lid_id": Int
} 
 *
 * authTokens: authTokens,
 */

const AuthContext = createContext({
  loginFunc: async (username, password) => {},
  logoutFunc: async () => {},
  setAuthTokens: () => {},
  setUser: () => {},
  user: {
    token_type: "access",
    exp: Date,
    iat: Date,
    jti: "",
    user_id: 0,
    name: "",
    role: [],
    lid_id: 0,
  },
  authTokens: { access: "", refresh: "" },
  start: async () => {},
});
export default AuthContext;
export const AuthProvider = ({ children }) => {
  // dont use useFetch here because it will not work
  const [authTokens, setAuthTokens] = useState();
  // () =>
  //   AsyncStorage.getItem("authTokens") &&
  //   JSON.parse(AsyncStorage.getItem("authTokens"))
  const [user, setUser] = useState();
  // () =>
  //   AsyncStorage.getItem("user") &&
  //   jwt_decode(JSON.parse(AsyncStorage.getItem("user")))
  const start = async () => {
    await fetch(`${baseUrl()}`);
  };
  const navigation = useNavigation();
  const loginFunc = async (username, password) => {
    let res = await fetch(`${baseUrl()}/api/users/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    let data = await res.json();
    if (res.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      await AsyncStorage.setItem("authTokens", JSON.stringify(data));
      await AsyncStorage.setItem("user", JSON.stringify(data.access));
      // navigation.replace("ProductsPage");
    } else {
      console.warn(`Error with ${data.detail}`);
    }
  };

  const logOutUser = () => {
    console.log(AsyncStorage);
    AsyncStorage.removeItem("authTokens");
    AsyncStorage.removeItem("user");
    setAuthTokens(null);
    setUser(null);
    navigation.replace("LoginPage");
  };
  const data = {
    loginFunc: loginFunc,
    logoutFunc: logOutUser,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    user: user,
    authTokens: authTokens,
    start: start,
  };
  // user && navigate("../login", { replace: true });
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
