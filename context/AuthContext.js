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
// import { AsyncStorage } from "@react-native-community/async-storage";

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

const AuthContext = createContext();
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
      // AsyncStorage.setItem("authTokens", JSON.stringify(data));
      // AsyncStorage.setItem("user", JSON.stringify(data.access));
      navigation.replace("ProductsPage");
    } else {
      console.log(`Error with ${data.detail}`);
    }
  };

  const logOutUser = () => {
    // AsyncStorage.removeItem("authTokens");
    // AsyncStorage.removeItem("user");
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
