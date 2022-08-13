import { useContext, useState } from "react";
import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AuthContext from "../context/AuthContext";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const { loginFunc } = useContext(AuthContext);

  async function loginHandler({ username, password }) {
    setIsAuthenticating(true);
    try {
      await loginFunc(username, password);
    } catch (error) {
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your credentials or try again later!",
        error
      );
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
