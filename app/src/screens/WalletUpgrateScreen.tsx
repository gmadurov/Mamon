import {
  Button,
  Divider,
  RadioButton,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ApiContext from "../context/ApiContext";
import BottomSearch from "../components/Cart/BottomSearch";
import CartContext from "../context/CartContext";
import FullContext from "../context/FullContext";
import Holder from "../models/Holder";
import HolderContext from "../context/HolderContext";
import PersonelView from "../components/Cart/PersonelView";
import User from "../models/Users";
import { log } from "react-native-reanimated";
import { showMessage } from "react-native-flash-message";

export enum Refund {
  refund = "true",
  notRefunc = "false",
}
export type WalletUpgrade = {
  seller?: User;
  holder?: Holder;
  refund?: Refund;
  amount?: number;
  password?: string;
};
const WalletUpgrateScreen = () => {
  const { seller, buyer, setSeller, setBuyer } = useContext(CartContext);
  const { ApiRequest } = useContext(ApiContext);
  const { setBottomSearch } = useContext(FullContext);
  const { holders, GET } = useContext(HolderContext);
  const [wallet, setWallet] = useState<WalletUpgrade>({
    seller: {} as User,
    holder: {} as Holder,
    refund: Refund.notRefunc,
    amount: 0,
    password: "",
  } as WalletUpgrade);
  useEffect(() => {
    setWallet({ ...wallet, seller: seller });
  }, [seller]);
  useEffect(() => {
    setWallet({ ...wallet, holder: buyer });
  }, [buyer]);

  async function SubmitWalletUpgrade() {
    console.log(wallet);

    let { res } = await ApiRequest<WalletUpgrade>("/api/walletupgrade/", {
      method: "POST",
      body: JSON.stringify(wallet),
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

  return (
    <>
      <ScrollView>
        <Button onPress={() => setBottomSearch((nu: boolean) => !nu)}>
          {buyer.name ? buyer.name : "Kies Lid Hier"}
        </Button>
        <TouchableRipple
          onPress={() => setWallet({ ...wallet, refund: Refund.refund })}
        >
          <View style={styles.row}>
            <Text>Dit is wel een terugbetaling</Text>
            <RadioButton
              value="first"
              status={wallet.refund === Refund.refund ? "checked" : "unchecked"}
              onPress={() => setWallet({ ...wallet, refund: Refund.refund })}
            />
          </View>
        </TouchableRipple>
        <Divider />
        <TouchableRipple
          onPress={() => setWallet({ ...wallet, refund: Refund.notRefunc })}
        >
          <View style={styles.row}>
            <Text>Dit is geen terugbetaling</Text>
            <RadioButton
              value="second"
              status={
                wallet.refund === Refund.notRefunc ? "checked" : "unchecked"
              }
              onPress={() => setWallet({ ...wallet, refund: Refund.notRefunc })}
            />
          </View>
        </TouchableRipple>
        <Divider />
        <PersonelView />
        <TextInput
          label="Hoeveelhieid"
          value={wallet.amount ? wallet.amount.toString() : ""}
          keyboardType="numeric"
          onChangeText={(text) =>
            setWallet({ ...wallet, amount: Number(text) })
          }
        />
        <TextInput
          label="Tapper Wachtwoord"
          secureTextEntry
          value={wallet.password ? wallet.password : ""}
          onChangeText={(text) => setWallet({ ...wallet, password: text })}
        />

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
      <BottomSearch placeholder="Kies Lid Hier" />
    </>
  );
};

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
