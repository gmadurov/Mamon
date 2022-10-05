import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card } from "@rneui/themed";
import { GlobalStyles } from "../constants/styles";
import IconButton from "./IconButton";
/**
 *
 * This is a modal selection button with the ability to search for things in based on label and search you pass in the options
 */
function Select({
  defaultValue,
  options = { value: "", lable: "", searchHelp: "" },
  loadOptions,
  label,
  onSelect,
  placeholder,
  invalid,
  style,
  textInputConfig,
  refreshFunction,
}) {
  const inputStyles = [styles.input, style];
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }
  // let options;
  // search options based on label and search parameters
  // search param might not work yet
  options = options?.filter((option) => {
    if (
      option.searchHelp?.toLowerCase().includes(search.toLowerCase()) |
      option.label?.toLowerCase().includes(search.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  });

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
    <View
      style={[styles.inputContainer, style]}
      onPress={() => setModalVisible(false)}
    >
      <Button
        android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
        activeOpacity={0.6}
        underlayColor={GlobalStyles.colors.primary3}
        onPress={() => setModalVisible(!modalVisible)}
        title={
          defaultValue
            ? options?.find((option) => option.value === defaultValue).label
            : label
        }
      />
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Card style={styles.modalCard}>
            <View style={styles.rightView}>
              <TouchableHighlight
                activeOpacity={0.2}
                onPress={() => {
                  // optionFunction("");
                  setModalVisible(!modalVisible);
                }}
                underlayColor={GlobalStyles.colors.androidRippleColor}
              >
                <Ionicons
                  name={"close"}
                  size={24}
                  color={GlobalStyles.colors.iconColor}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.modalView}>
              <Ionicons
                style={inputStyles}
                name={"search"}
                size={24}
                color={GlobalStyles.colors.iconColor}
              />
              <TextInput
                style={inputStyles}
                placeholder={placeholder}
                {...textInputConfig}
                onChangeText={(text) => {
                  setSearch(text);
                  // optionFunction(search);
                }}
              >
                {defaultValue
                  ? options?.find((option) => option.value === defaultValue)
                      .label
                  : search}
              </TextInput>
              <IconButton
                name={"close-circle-outline"}
                size={24}
                style={inputStyles}
                color={GlobalStyles.colors.iconColor}
                onPress={() => {
                  setSearch("");
                  onSelect(null);
                }}
              />
            </View>
            <ScrollView
              style={styles.ScrollView}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => getHolders()}
                />
              }
            >
              <Card style={styles.seletionCard}>
                {options?.map((option) => (
                  <TouchableOpacity
                    key={"select " + option.value}
                    onPress={() => {
                      onSelect(option.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>{option?.label}</Text>
                    <Card.Divider />
                  </TouchableOpacity>
                ))}
              </Card>
            </ScrollView>
          </Card>
        </View>
      </Modal>
    </View>
  );
}

export default Select;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
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
