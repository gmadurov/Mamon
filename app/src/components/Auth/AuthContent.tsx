import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../ui/Button";
import { GlobalStyles } from "../../constants/styles";
import Input from "../ui/Input";
import NFCContext, { TagEventLocal } from "../../context/NFCContext";
import { showMessage } from "react-native-flash-message";
import ApiContext from "../../context/ApiContext";
import { Card } from "../../models/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../../context/AuthContext";
import { AuthToken } from "../../models/AuthToken";

function AuthContent({ isLogin, onAuthenticate }: { isLogin: boolean; onAuthenticate: Function }) {
  const [username, setUsername] = useState<string>("");
  // const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const NfcProxy = useContext(NFCContext);
  const { ApiRequest, refreshToken } = useContext(ApiContext);
  // const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  // const { email: emailIsInvalid, password: passwordIsInvalid } =
  //   credentialsInvalid;

  function updateInputValueHandler(enteredValue: string, inputType: string) {
    switch (inputType) {
      case "username":
        setUsername(enteredValue);

        break;
      case "password":
        setPassword(enteredValue);
        break;
    }
  }
  // const [credentialsInvalid, setCredentialsInvalid] = useState({
  //   email: false,
  //   password: false,
  //   confirmEmail: false,
  //   confirmPassword: false,
  // });

  // function switchAuthModeHandler() {
  // if (isLogin) {
  //   navigation.replace("Signup");
  // } else {
  //   navigation.replace("Login");
  // }
  // }

  function submitHandler() {
    onAuthenticate(username, password);
  }

  async function submitHandlerWithCard() {
    let tag: TagEventLocal | null = null;
    if (NfcProxy.enabled && NfcProxy.supported) {
      try {
        tag = await NfcProxy.readTag();
        if (tag?.id) {
          const cardToken = (await AsyncStorage.getItem(tag?.id));
          showMessage({
            message: `Card ${tag?.id} scanned`,
            type: "info",
            floating: true,
            hideStatusBar: true,
            autoHide: true,
            duration: 500,
            position: "bottom",
          });
          if (cardToken) {
            await AsyncStorage.removeItem(tag?.id)
            await refreshToken((JSON.parse(cardToken)) as AuthToken, tag?.id)
          }
        }
      } catch (e) {
        await NfcProxy.stopReading();
      } finally {
        await NfcProxy.stopReading();
      }
    }
  }

  return (
    <View style={styles.authContent}>
      <View style={styles.form}>
        <View>
          <Input
            label="Gebruikers naam"
            onUpdateValue={(text: string) => updateInputValueHandler(text, "username")}
            value={username}
          // isInvalid={emailIsInvalid}
          />
          {/* {!isLogin && (
          <Input
            label="Confirm Email Address"
            onUpdateValue={(e) => updateInputValueHandler(e, "confirmEmail")}
            value={enteredConfirmEmail}
            keyboardType="email-address"
            isInvalid={emailsDontMatch}
          />
        )} */}
          <Input
            label="Wachtwoord"
            onUpdateValue={(text: string) => updateInputValueHandler(text, "password")}
            secure
            value={password}
            keyboardType={undefined}
            isInvalid={undefined} // isInvalid={passwordIsInvalid}
          />
          {/* {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={(e) => updateInputValueHandler(e, "confirmPassword")}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )} */}
          <View style={styles.buttons}>
            <Button onPressFunction={submitHandler}>
              Log In
              {/* {isLogin || true ? "Log In" : "Sign Up"} */}
              {/* for if we ever want to expand*/}
            </Button>
            <Button onPressFunction={submitHandlerWithCard}>
              Log In Met Card
            </Button>
          </View>
        </View>
      </View>
      {/* <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? "Create a new user" : "Log in instead"}
        </FlatButton>
      </View> */}
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: GlobalStyles.colors.primary2,
    elevation: 2,
    shadowColor: GlobalStyles.colors.shadowColor,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  form: { marginBottom: 16 },
});
