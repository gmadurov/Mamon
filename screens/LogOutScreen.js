import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
const LogOutScreen = ({ navigation }) => {
  const { logoutFunc } = useContext(AuthContext);
  async function perform() {
    useEffect(() => {
      logoutFunc().then(() => navigation.navigate("LoginScreen"));
    }, []);
  }
  perform();
  return <></>;
};

export default LogOutScreen;
