import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
const LogOutScreen = ({ navigation }) => {
  const { logoutFunc } = useContext(AuthContext);

  useEffect(() => {
    async function logout() {
      await logoutFunc();
    }
    logout();
  }, []);
  return <></>;
};

export default LogOutScreen;
