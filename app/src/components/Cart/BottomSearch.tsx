import { Avatar, Divider, Text } from "react-native-paper";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import NFCContext, { TagEventLocal } from "../../context/NFCContext";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import ApiContext from "../../context/ApiContext";
import { Card } from "../../models/Card";
import CartContext from "../../context/CartContext";
import FullContext from "../../context/FullContext";
import { GlobalStyles } from "../../constants/styles";
import Holder from "../../models/Holder";
import HolderContext from "../../context/HolderContext";
import { baseUrl } from "../../context/AuthContext";
import { showMessage } from "react-native-flash-message";

export interface HolderChoice extends Holder {
  value: number;
  label: string;
  searchHelp: string;
}

export type BottomSearchProps = {
  style?: object | undefined;
  invalid?: boolean;
  textInputConfig?: { multiline: boolean | undefined; numberOfLines: number };
  placeholder: string | undefined;
};

const BottomSearch = ({
  style,
  invalid,
  textInputConfig,
  placeholder,
}: BottomSearchProps) => {
  const { BottomSearch, setBottomSearch } = useContext(FullContext);
  const { setBuyer } = useContext(CartContext);
  const NfcProxy = useContext(NFCContext);
  const { ApiRequest } = useContext(ApiContext);
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

  let optionsHolders: HolderChoice[] = holders.map(
    (holder) =>
      ({
        ...holder,
        value: holder.id,
        label: holder?.name,
        searchHelp: holder?.ledenbase_id.toString(),
      } as HolderChoice)
  );
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

  async function startNfc() {
    let tag: TagEventLocal | null = null;
    try {
      tag = await NfcProxy.readTag();
    } catch (e) {}
    // const tag = { id: "0410308AC85E80" }; //for testing locally
    if (![null, {} as TagEventLocal].includes(tag)) {
      // console.log(tag);
      showMessage({
        message: `card ${tag?.id} scanned`,
        type: "info",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 500,
        position: "bottom",
      });
      const { res, data } = await ApiRequest<Card>(`/api/cards/${tag?.id}`);
      if (res.status === 200) {
        // console.log(data);
        setBuyer({
          ...data.holder,
          value: data.holder.id,
          label: data.holder?.name,
        } as HolderChoice);
        setBottomSearch(false);
        setSearch("");
      } else {
        showMessage({
          message: `Card niet gevonden`,
          description: `is card gekopeld`,
          type: "danger",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
          position: "bottom",
        });
      }
    }
  }
  useEffect(() => {
    async function useNfc() {
      await startNfc();
    }
    if (BottomSearch) {
      useNfc();
    }
  }, [BottomSearch]);
  const renderItem = ({ item }: { item: HolderChoice }) => {
    let option = item;
    let avatarSize = 50;
    // console.log(option?.image, option?.id);
    return (
      <>
        <TouchableOpacity
          style={styles.item}
          key={"select " + option.value}
          onPress={() => {
            setBuyer(option);
            setBottomSearch(false);
            setSearch("");
          }}
        >
          {!option.image.includes("default") ? (
            <Avatar.Image source={{ uri: option?.image }} size={avatarSize} />
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
  if (BottomSearch) {
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
  } else {
    return <></>;
  }
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
