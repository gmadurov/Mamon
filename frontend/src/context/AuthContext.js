import { createContext, useState }  from "react";

import { baseUrl } from "./ApiContext";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
  const [authTokens, setAuthTokens] = useState(
    () =>
      localStorage.getItem("authTokens") &&
      JSON.parse(localStorage.getItem("authTokens"))
  );
  const [user, setUser] = useState(
    () =>
      localStorage.getItem("user") &&
      jwt_decode(JSON.parse(localStorage.getItem("user")))
  );
  const start = async () => {
    await fetch(`${baseUrl()}`);
  };
  const navigate = useNavigate();
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
      localStorage.setItem("authTokens", JSON.stringify(data));
      localStorage.setItem("user", JSON.stringify(data.access));
      navigate("/", { replace: true });
    } else {
      console.log(`Error with ${data.detail}`);
    }
  };

  const logOutUser = () => {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    setAuthTokens(null);
    setUser(null);
    navigate("../login", { replace: true });
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
