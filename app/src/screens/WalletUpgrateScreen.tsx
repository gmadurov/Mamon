import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, Button, Divider, RadioButton, TextInput, TouchableRipple } from "react-native-paper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { showMessage } from "react-native-flash-message";
import BottomSheetHolders, { HolderChoice } from "../components/Cart/BottomSheetHolders";
import PersonelView from "../components/Cart/PersonelView";
import ApiContext from "../context/ApiContext";
import CartContext from "../context/CartContext";
import FullContext from "../context/FullContext";
import HolderContext from "../context/HolderContext";
import Holder from "../models/Holder";
import User from "../models/Users";
import { DrawerParamList } from "../navigation/Navigators";
import { GlobalStyles } from "../constants/styles";
import NFCContext, { TagEventLocal } from "../context/NFCContext";
import { Card } from "../models/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthToken } from "../models/AuthToken";

export enum Refund {
  refund = "true",
  notRefunc = "false",
}
export type WalletUpgrade = {
  comment: string;
  seller?: User;
  holder?: Holder;
  refund?: Refund;
  amount?: number;
  password?: string;
};

type Props = NativeStackScreenProps<DrawerParamList, "WalletUpgrateScreen">;

function WalletUpgrateScreen({ route, navigation }: Props) {
  const { seller, buyer, setSeller, setBuyer } = useContext(CartContext);
  const { ApiRequest } = useContext(ApiContext);
  const NfcProxy = useContext(NFCContext);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTapper, setSearchTapper] = useState(false);
  const [searchHolder, setSearchHolder] = useState(false);
  const [token, setToken] = useState('')

  const [wallet, setWallet] = useState<WalletUpgrade>({
    seller: {} as User,
    holder: {} as Holder,
    refund: Refund.notRefunc,
    amount: 0,
    password: "",
    comment: "",
  } as WalletUpgrade);
  useEffect(() => {
    setWallet({ ...wallet, seller: seller });
  }, [seller]);
  useEffect(() => {
    setWallet({ ...wallet, holder: buyer });
  }, [buyer]);

  async function SubmitWalletUpgrade() {
    let { res } = await ApiRequest<WalletUpgrade>("/api/walletupgrade/", {
      method: "POST",
      body: JSON.stringify(wallet),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res?.status === 201 || res?.status === 200) {
      showMessage({
        message: `Wallet Upgrade was successful`,
        description: ``,
        type: "success",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 2500,
        position: "bottom",
      });
      setWallet({
        refund: Refund.notRefunc,
        amount: 0,
        password: "",
      } as WalletUpgrade);
      setSeller({} as User);
      setBuyer({} as Holder);
    } else if (res?.status === 501) {
      showMessage({
        message: `Failed to authenticate the seller`,
        description: `The seller and password combination is not correct`,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 4500,
        position: "bottom",
      });
    } else {
      showMessage({
        message: `Wallet Upgrade was Unsuccessful`,
        description: ``,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
        position: "bottom",
      });
    }
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header style={{ backgroundColor: GlobalStyles.colors.primary1 }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Wallet Upgrade" style={{ alignItems: "center" }} />
          <Appbar.Action icon={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword((nu) => !nu)} />
        </Appbar.Header>
      ),
    });

    return () => {
      navigation.setOptions({
        header: () => null,
      });
    };
  }, [navigation, showPassword]);
  async function searchTapperNFC() {
    setSearchHolder(false);
    setSearchTapper((nu) => !nu);
    let tag: TagEventLocal | null = null;
    if (NfcProxy.enabled && NfcProxy.supported) {
      try {
        tag = await NfcProxy.readTag();
        showMessage({
          message: `Card ${tag?.id} scanned`,
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 500,
          position: "bottom",
        });
        const token_local = (JSON.parse(await AsyncStorage.getItem(tag.id as string) as string) as AuthToken).access as string
        setToken(token_local);
        return true
      } catch (e) {
        await NfcProxy.stopReading();
      } finally {
        await NfcProxy.stopReading();
      }
    } else {
      showMessage({
        message: `NFC not supported`,
        description: `NFC is not supported on this device`,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
        position: "bottom",
      });
    }
    setSearchTapper(false)
  }
  async function searchHolderNFC() {
    setWallet({ ...wallet, holder: {} as Holder });
    setSearchTapper(false);
    setSearchHolder((nu) => !nu);
    let tag: TagEventLocal | null = null;
    if ((NfcProxy.enabled && NfcProxy.supported)) {
      try {
        tag = await NfcProxy.readTag();
        showMessage({
          message: `Card ${tag?.id} scanned`,
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 500,
          position: "bottom",
        });
        // tag = { id: "0410308AC85E80" }; //for testing locally
        const { res, data } = await ApiRequest<Card>(`/api/cards/${tag?.id}`);
        if (res.status === 200) {
          setWallet({ ...wallet, holder: data.holder });
        } else {
          showMessage({
            message: `Card niet gevonden`,
            description: `is card gekopeld aan een account?`,
            type: "danger",
            floating: true,
            hideStatusBar: true,
            autoHide: true,
            duration: 1500,
            position: "bottom",
          });
        }
      } catch (e) {
        await NfcProxy.stopReading();
      } finally {
        await NfcProxy.stopReading();
        // showMessage({
        //   message: "NFC scan stopped",
        //   type: "info",
        //   hideStatusBar: true,
        //   autoHide: true,
        //   position: "bottom",
        //   duration: 500,
        // });
      }
    } else {
      showMessage({
        message: `NFC not supported`,
        description: `NFC is not supported on this device, You will have to put in your password manually, please press the eye icon to show the password feild`,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
        position: "bottom",
      });
    }
    setSearchHolder(false)
  }
  return (
    <>
      <ScrollView>
        <TouchableRipple onPress={() => setWallet({ ...wallet, refund: Refund.refund })}>
          <View style={styles.row}>
            <Text>Refund</Text>
            <RadioButton
              value="first"
              status={wallet.refund === Refund.refund ? "checked" : "unchecked"}
              onPress={() => setWallet({ ...wallet, refund: Refund.refund })}
            />
          </View>
        </TouchableRipple>
        <Divider />
        <TouchableRipple onPress={() => setWallet({ ...wallet, refund: Refund.notRefunc })}>
          <View style={styles.row}>
            <Text>Wallet Upgrade</Text>
            <RadioButton
              value="second"
              status={wallet.refund === Refund.notRefunc ? "checked" : "unchecked"}
              onPress={() => setWallet({ ...wallet, refund: Refund.notRefunc })}
            />
          </View>
        </TouchableRipple>
        <Divider />
        {showPassword ? (
          <>
            <PersonelView />
            <TextInput
              label="Tapper Wachtwoord"
              secureTextEntry
              value={wallet.password ? wallet.password : ""}
              onChangeText={(text) => setWallet({ ...wallet, password: text })}
            />
          </>
        ) : (
          <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
            <Button
              onPress={searchTapperNFC}
              style={{
                backgroundColor: GlobalStyles.colors.thetaBrown,
              }}
              mode={"contained"}
            >
              {token ? "Tapper Selected" : !searchTapper ? "Scan NFC en Zoek op Tapper" : "Scanning..."}
            </Button>
            <Button
              onPress={searchHolderNFC}
              mode={"contained"}
              style={{
                backgroundColor: GlobalStyles.colors.thetaGeel,
              }}
            >
              {wallet.holder?.id ? wallet.holder.name : !searchHolder ? "Scan NFC en Zoek op Gebruiker" : 'Scanning...'}
            </Button>
          </View>
        )}
        <TextInput
          label="Hoeveelheid"
          value={wallet.amount ? wallet.amount.toString() : ""}
          keyboardType="numeric"
          onChangeText={(text) => setWallet({ ...wallet, amount: Number(text) })}
        />
        {/* TODO: add comment if it is a refund */}
        {wallet.refund == Refund.refund && <TextInput
          label="Refund Comment"
          value={wallet.comment || ""}
          onChangeText={(text) => setWallet({ ...wallet, comment: (text) })}
        />}
        <Button
          disabled={
            [undefined, null, "" as Refund].includes(wallet.refund) ||
              [undefined, null, NaN].includes(wallet.amount) ||
              [undefined, null, ""].includes(wallet.password) ||
              [undefined, {} as User].includes(wallet.seller) ||
              [undefined, null, ""].includes(wallet.holder?.name)
              ? true
              : false
          }
          onPress={SubmitWalletUpgrade}
        >
          Submit
        </Button>
      </ScrollView>
      <BottomSheetHolders placeholder="Kies Lid Hier" />
    </>
  );
}

export default WalletUpgrateScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
