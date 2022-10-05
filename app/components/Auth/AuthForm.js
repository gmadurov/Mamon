// import { useState } from "react";
// import { StyleSheet, View } from "react-native";
// import Input from "../../constants/Input";
// import Button from "../../constants/Button";

// function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
//   const [username, setUsername] = useState("");
//   // const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
//   const [password, setPassword] = useState("");
//   // const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

//   // const { email: emailIsInvalid, password: passwordIsInvalid } =
//   //   credentialsInvalid;

//   function updateInputValueHandler(enteredValue, inputType) {
//     switch (inputType) {
//       case "username":
//         setUsername(enteredValue);

//         break;
//       case "password":
//         setPassword(enteredValue);
//         break;
//     }
//   }

//   function submitHandler() {
//     onSubmit({
//       username: username,
//       password: password,
//     });
//   }

//   return (
//     <View style={styles.form}>
//       <View>
//         <Input
//           label="Username"
//           onUpdateValue={(text) => updateInputValueHandler(text, "username")}
//           value={username}
//           // isInvalid={emailIsInvalid}
//         />
//         {/* {!isLogin && (
//           <Input
//             label="Confirm Email Address"
//             onUpdateValue={(e) => updateInputValueHandler(e, "confirmEmail")}
//             value={enteredConfirmEmail}
//             keyboardType="email-address"
//             isInvalid={emailsDontMatch}
//           />
//         )} */}
//         <Input
//           label="Password"
//           onUpdateValue={(text) => updateInputValueHandler(text, "password")}
//           secure
//           value={password}
//           // isInvalid={passwordIsInvalid}
//         />
//         {/* {!isLogin && (
//           <Input
//             label="Confirm Password"
//             onUpdateValue={(e) => updateInputValueHandler(e, "confirmPassword")}
//             secure
//             value={enteredConfirmPassword}
//             isInvalid={passwordsDontMatch}
//           />
//         )} */}
//         <View style={styles.buttons}>
//           <Button onPress={submitHandler}>
//             {isLogin || true ? "Log In" : "Sign Up"}
//             {/* for if we ever want to expand*/}
//           </Button>
//         </View>
//       </View>
//     </View>
//   );
// }

// export default AuthForm;

// const styles = StyleSheet.create({
//   buttons: {
//     marginTop: 12,
//   },
// });
