import React, { useContext, useState } from "react";

import AuthContent from "../components/Auth/AuthContent";
import PersonelView from "../components/Cart/PersonelView";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AuthContext from "../context/AuthContext";

function LoginScreen({ extra }: { extra?: boolean }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const { loginFunc } = useContext(AuthContext);

  async function loginHandler(username: string, password: string, card?: string) {
    setIsAuthenticating(true);
    try {
      await loginFunc(username, password, setIsAuthenticating, card);
    } catch (error) {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return (
      <LoadingOverlay
        message="Logging you in..."
        show={isAuthenticating}
        onCancel={setIsAuthenticating}
      />
    );
  }

  if (extra) {
    return (
      <>
        <AuthContent isLogin onAuthenticate={loginHandler} />
        <PersonelView />
      </>
    );
  } else {
    return <AuthContent isLogin onAuthenticate={loginHandler} />;
  }
}

export default LoginScreen;
