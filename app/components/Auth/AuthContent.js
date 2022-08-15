import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { GlobalStyles } from "../../constants/styles";
import Input from "../../constants/Input";
import Button from "../../constants/Button";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  // const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  // const { email: emailIsInvalid, password: passwordIsInvalid } =
  //   credentialsInvalid;

  function updateInputValueHandler(enteredValue, inputType) {
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

  function switchAuthModeHandler() {
    // if (isLogin) {
    //   navigation.replace("Signup");
    // } else {
    //   navigation.replace("Login");
    // }
  }

  function submitHandler(credentials) {
    // let { email, confirmEmail, password, confirmPassword } = credentials;

    // email = email.trim();
    // password = password.trim();

    // const emailIsValid = email.includes("@");
    // const passwordIsValid = password.length > 6;
    // const emailsAreEqual = email === confirmEmail;
    // const passwordsAreEqual = password === confirmPassword;

    // if (
    //   !emailIsValid ||
    //   !passwordIsValid ||
    //   (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    // ) {
    //   Alert.alert("Invalid input", "Please check your entered credentials.");
    //   setCredentialsInvalid({
    //     email: !emailIsValid,
    //     confirmEmail: !emailIsValid || !emailsAreEqual,
    //     password: !passwordIsValid,
    //     confirmPassword: !passwordIsValid || !passwordsAreEqual,
    //   });
    //   return;
    // }
    onAuthenticate(username, password);
  }

  return (
    <View style={styles.authContent}>
      <View style={styles.form}>
        <View>
          <Input
            label="Username"
            onUpdateValue={(text) => updateInputValueHandler(text, "username")}
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
            label="Password"
            onUpdateValue={(text) => updateInputValueHandler(text, "password")}
            secure
            value={password}
            // isInvalid={passwordIsInvalid}
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
            <Button onPress={submitHandler}>
              {isLogin | true ? "Log In" : "Sign Up"}
              {/* for if we ever want to expand*/}
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
  },
});
