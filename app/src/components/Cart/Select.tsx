import { Button, TouchableRipple } from "react-native-paper";
import { Pressable, StyleSheet, View } from "react-native";
import React, { useContext, useState } from "react";

import CartContext from "../../context/CartContext";
import FullContext from "../../context/FullContext";
import { GlobalStyles } from "../../constants/styles";
import Holder from "../../models/Holder";

// import IconButton from "./IconButton";
// import { Ionicons } from "@expo/vector-icons";

/**
 *
 * This is a modal selection button with the ability to search for things in based on label and search you pass in the options
 */
function Select({
  defaultValue,
  options,
  wallet,
  label,
  invalid,
  style,
  textInputConfig,
  refreshFunction,
}: {
  options: { label: string; value: any; searchHelp: string }[];
  label: string;
  wallet: boolean;
  refreshFunction: () => Promise<void>;
  textInputConfig?: { multiline?: boolean; numberOfLines?: number };
  invalid?: boolean;
  style?: object;
  defaultValue?: any;
}): JSX.Element {
  const { BottomSearch, setBottomSearch } = useContext(FullContext);
  const { setBuyer } = useContext(CartContext);
  const inputStyles = [styles.input, style];
  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }
  // let options;
  // search options based on label and search parameters
  // search param might not work yet
  options = options?.filter(
    (option: { label: string; value: any; searchHelp: string }) => {
      if (
        option.searchHelp?.toLowerCase().includes(search.toLowerCase()) ||
        option.label?.toLowerCase().includes(search.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    }
  );

  // useEffect(() => {
  //   async function get() {
  //     options = await optionFunction(search);
  //     // console.log(options);
  //   }
  //   get();
  // }, [search]);

  async function getHolders() {
    setRefreshing(true);
    await refreshFunction();
    setRefreshing(false);
  }

  return (
    <TouchableRipple // was View
      style={[styles.inputContainer, style]}
      // onPress={() => {setModalVisible(false)}}
    >
      <Button
        // android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
        onPress={() => setBottomSearch((nu) => !nu)}
        onLongPress={() => setBuyer({} as Holder)}
        color={GlobalStyles.colors.thetaBrown}
      >
        {defaultValue?.label ? defaultValue.label : label}
      </Button>
    </TouchableRipple>
  );
}

export default Select;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalCard: {
    flex: 1,
    margin: 20,
    width: 100,
    backgroundColor: GlobalStyles.colors.primary3,
    borderRadius: 40,
    alignSelf: "stretch",
    padding: 35,
    alignItems: "center",
    shadowColor: GlobalStyles.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    borderRadius: 20,
    maxHeight: 50,
    backgroundColor: GlobalStyles.colors.primary1,
    color: GlobalStyles.colors.primary2,
  },
  rightView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  ScrollView: {
    flex: 20,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: GlobalStyles.colors.primary5,
  },
  seletionCard: { flex: 1, backgroundColor: GlobalStyles.colors.primary1 },

  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    color: GlobalStyles.colors.textColorLight,
    marginBottom: 4,
  },
  invalidLabel: {
    color: GlobalStyles.colors.errorMessage,
  },
  input: {
    padding: 6,
    fontSize: 18,
    height: 35,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  invalidInput: {
    backgroundColor: GlobalStyles.colors.errorMessage,
  },
});
