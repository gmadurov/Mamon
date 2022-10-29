import { Avatar, Divider, Text } from "react-native-paper";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
}  from "react";
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import CartContext from "../context/CartContext";
import FullContext from "../context/FullContext";
import { GlobalStyles } from "../constants/styles";
import Holder from "../models/Holder";
import HolderContext from "../context/HolderContext";
import { baseUrl } from "../context/AuthContext.tsx";

type HolderChoice = {
  value: number;
  label: string;
  searchHelp: string;
  image_ledenbase: string | null;
  image: string | null;
};

export type BottomSearchProps = {
  style?: object | undefined;
  invalid?: boolean;
  textInputConfig?: { multiline: boolean | undefined; numberOfLines: number };
  placeholder: string | undefined;
};

const BottomSearch = ({ style, invalid, textInputConfig, placeholder }: BottomSearchProps ) => {
  const { BottomSearch, setBottomSearch } = useContext(FullContext);
  const { buyer, setBuyer } = useContext(CartContext);
  const { GET, holders, SEARCH } = useContext(HolderContext);

  const inputStyles = [styles.input, style];
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }

  let optionsHolders = holders?.map((holder) => ({
    value: holder.id,
    label: holder?.name,
    searchHelp: holder?.ledenbase_id.toString(),
    image_ledenbase: holder?.image_ledenbase,
    image: holder?.image,
  }));
  optionsHolders = optionsHolders?.filter((option) => {
    if (
      option.searchHelp?.toLowerCase().includes(search.toLowerCase()) ||
      option?.label?.toLowerCase().includes(search.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  });
  async function getHolders() {
    setRefreshing(true);
    await GET();
    setRefreshing(false);
  }
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], ["50%"]);
  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setBottomSearch(false);
      setSearch("");
    }
  }, []);

  const renderItem = ({ item }: { item: HolderChoice }) => {
    let option = item;
    let avatarSize = 50;
    return (
      <>
        <TouchableOpacity
          style={styles.item}
          key={"select " + option.value}
          onPress={() => {
            setBuyer(option.value);
            setBottomSearch(false);
            setSearch("");
          }}
        >
          {option?.image !== "/mediafiles/holder/user-default.jpg" ? (
            <Avatar.Image
              source={{ uri: baseUrl() + option?.image }}
              size={avatarSize}
            />
          ) : option?.image_ledenbase ? (
            <Avatar.Image
              source={{ uri: option?.image_ledenbase }}
              size={avatarSize}
            />
          ) : (
            <Avatar.Text size={avatarSize} label={option?.label.charAt(0)} />
          )}
          <Text style={styles.textStyle}>
            {"     "}
            {option?.label}{" "}
          </Text>
          <Divider />
        </TouchableOpacity>
      </>
    );
  };
  // if (BottomSearch) {
  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose
      ref={sheetRef}
      index={0}
      onChange={handleSheetChange}
      // keyboardDismissMode="on-drag"
    >
      <View style={styles.contentContainer}>
        <BottomSheetTextInput
          value={search}
          placeholder={placeholder}
          onChangeText={(text) => setSearch(text)}
          style={styles.textInput}
        />
        <BottomSheetFlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getHolders()}
            />
          }
          style={{ flex: 1 }}
          data={optionsHolders}
          keyExtractor={(item) => item.value.toString() as string}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
          // renderItem={({ item }) => showHolder(item)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BottomSheet>
  );
  // }
};

export default BottomSearch;

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
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: GlobalStyles.colors.primary2,
  },

  textStyle: {
    color: GlobalStyles.colors.textColorDark,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
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
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: GlobalStyles.colors.primary1,
    color: GlobalStyles.colors.textColorDark,
    fontSize: 18,
    textAlign: "left",
  },
  contentContainer: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "flex-start",
  },
});
