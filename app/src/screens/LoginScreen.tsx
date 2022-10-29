import React, { useContext, useState }  from "react";

import AuthContent from "../components/Auth/AuthContent";
import AuthContext from "../context/AuthContext.tsx";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const { loginFunc } = useContext(AuthContext);

  async function loginHandler(username: string, password: string) {
    setIsAuthenticating(true);
    try {
      await loginFunc(username, password, setIsAuthenticating);
    } catch (error) {
      // Alert.alert([
      //   "Authentication failed!",
      //   "Could not log you in. Please check your credentials or try again later!",
      //   error,
      // ]);
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

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
