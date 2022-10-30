import React, { useContext, useEffect }  from "react";

import AuthContext from "../context/AuthContext.tsx";

const LogOutScreen = () => {
  const { logoutFunc } = useContext(AuthContext);

  useEffect(() => {
    async function logout() {
      await logoutFunc();
    }
    logout();
    // eslint-disable-next-line
  }, []);
  return <></>;
};

export default LogOutScreen;
