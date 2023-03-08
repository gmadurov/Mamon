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
  comment?: string;
  personel?: {
    username: string;
    password: string;
  };
  holder: Holder;
  refund: Refund;
  amount: number;
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
  const { setBottomSearch } = useContext(FullContext);


  const [wallet, setWallet] = useState<WalletUpgrade>({
    refund: Refund.notRefunc,
    amount: 0,
    comment: "",
  } as WalletUpgrade);
  useEffect(() => {
    setWallet({ ...wallet, personel: { password: wallet.personel?.password || '', username: seller.username } });
  }, [seller]);
  useEffect(() => {
    setWallet({ ...wallet, holder: buyer });
  }, [buyer]);
  async function SubmitWalletUpgrade(paymentMethod: string) {
    let config
    if (token) {
      delete wallet.personel
      config = {
        method: "POST",
        body: JSON.stringify({ ...wallet, [paymentMethod]: true }),
        headers: {
          "Content-Type": "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    } else {
      config = {
        method: "POST",
        body: JSON.stringify({ ...wallet, [paymentMethod]: true }),
      }
    }
    let { res, data } = await ApiRequest<WalletUpgrade>(`/api/walletupgrades/`, config);
    // console.log(data)
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
        personel: { password: "", username: "" },
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
        description: JSON.stringify(res?.status),
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
          {NfcProxy.enabled && NfcProxy.supported &&
            <>
              <Appbar.Action icon={!showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword((nu) => !nu)} />
              <Appbar.Action icon={"account-box"} onPress={() => setBottomSearch(nu => !nu)} />
            </>}

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
    // console.log(await AsyncStorage.getItem('0410308AC85E80'))
    setSearchHolder(false);
    setSearchTapper((nu) => !nu);
    let tag: TagEventLocal | null = null;
    if ((NfcProxy.enabled && NfcProxy.supported)) {
      try {
        tag = await NfcProxy.readTag();
        // tag = { id: "0410308AC85E80" }; //for testing locally
        const token_local: AuthToken = JSON.parse(await AsyncStorage.getItem(`${tag?.id as string}`) || '{}')
        setToken(token_local.access);
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
        // showMessage({
        //   message: `Card ${tag?.id} scanned`,
        //   type: "info",
        //   floating: true,
        //   hideStatusBar: true,
        //   autoHide: true,
        //   duration: 500,
        //   position: "bottom",
        // });
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
  function isDisabled() {
    if (!showPassword ? [undefined, null, "" as Refund].includes(wallet.refund) ||
      wallet.amount <= 0 || [undefined, null, NaN].includes(wallet.holder?.id) ||
      (![undefined, null, ""].includes(wallet.personel?.username) &&
        ![undefined, null, ""].includes(wallet.personel?.password)) || token === '' ||
      wallet.refund === Refund.refund && wallet.comment === '' : [undefined, null, "" as Refund].includes(wallet.refund) ||
      [undefined, null, NaN].includes(wallet.amount) ||
      [undefined, null, ""].includes(wallet.personel?.password) ||
      [undefined, null, ""].includes(wallet.personel?.username) ||
      [undefined, null, NaN].includes(wallet.holder?.id) ||
    wallet.refund === Refund.refund && wallet.comment === ''
    ) { return true }
    else { return false }
  }
  return (
    <>
      <ScrollView style={{ flex: 1 }}>
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
        {showPassword || !(NfcProxy.enabled && NfcProxy.supported) ? (
          <>
            <PersonelView />
            <TextInput
              label="Tapper Wachtwoord"
              secureTextEntry
              value={wallet.personel?.password ? wallet.personel?.password : ""}
              onChangeText={(text) => setWallet({ ...wallet, personel: { username: wallet.personel?.username || "", password: text } })}
            />
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
              {NfcProxy.enabled && NfcProxy.supported ? <Button
                onPress={searchHolderNFC}
                mode={"contained"}
                buttonColor={GlobalStyles.colors.thetaGeel}
                textColor={GlobalStyles.colors.thetaBrown}
              >
                {wallet.holder?.id ? wallet.holder.name : !searchHolder ? "Scan NFC voor Gebruiker" : 'Scanning...'}
              </Button> :
                <Button
                  onPress={() => setBottomSearch(nu => !nu)}
                  mode={"contained"}
                  buttonColor={GlobalStyles.colors.thetaGeel}
                  textColor={GlobalStyles.colors.thetaBrown}
                >
                  {wallet.holder?.id ? wallet.holder.name : 'Zoek Gebruiker'}
                </Button>}
            </View>
          </>
        ) : (
          <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
            <Button
              onPress={searchTapperNFC}
              textColor={GlobalStyles.colors.thetaGeel}
              buttonColor={GlobalStyles.colors.thetaBrown}
              mode={"contained"}
            >
              {token ? "Tapper Selected" : !searchTapper ? "Scan NFC voor Tapper" : "Scanning..."}
            </Button>
            <Button
              onPress={searchHolderNFC}
              mode={"contained"}
              buttonColor={GlobalStyles.colors.thetaGeel}
              textColor={GlobalStyles.colors.thetaBrown}
            >
              {wallet.holder?.id ? wallet.holder.name : !searchHolder ? "Scan NFC voor Gebruiker" : 'Scanning...'}
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
        <View style={{ justifyContent: "space-evenly", flex: 1, flexDirection: 'row' }}>

          <Button
            disabled={
              isDisabled()
            }
            onPress={() => SubmitWalletUpgrade('cash')}
            color="green"
            mode='contained'
          >
            Cash
          </Button>
          <Button
            disabled={
              isDisabled()
            }
            onPress={() => SubmitWalletUpgrade('pin')}
            color='black'
            mode='contained'
          >
            Pin
          </Button>
        </View>
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
