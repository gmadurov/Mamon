import { Button, Subheading, Text, TextInput } from "react-native-paper";
import NFCContext, { TagEventLocal } from "../context/NFCContext";
import React, { useContext, useEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import BottomSheetHolders from "../components/Cart/BottomSheetHolders";
import { Card } from "../models/Card";
import CartContext from "../context/CartContext";
import FullContext from "../context/FullContext";
import Holder from "../models/Holder";
import { View } from "react-native";
import { showMessage } from "react-native-flash-message";

function LinkCardScreen(props: { navigation: any }) {
  const [card, setCard] = useState<Card>({
    card_id: "",
    card_name: "",
    holder: {} as Holder,
  } as Card);
  const { setBottomSearch } = useContext(FullContext);
  const NfcProxy = useContext(NFCContext);
  const { buyer, setBuyer } = useContext(CartContext);
  const { ApiRequest } = useContext(ApiContext);

  const [scanning, setScanning] = useState<boolean>(false);

  useEffect(() => {
    setCard({ ...card, holder: buyer });
  }, [buyer]);
  useEffect(() => {
    async function useNfc() {
      let tag: TagEventLocal | null = null;
      try {
        tag = await NfcProxy.readTag();
      } catch (e) {
        console.log(e);
      } finally {
        setScanning(false);
        NfcProxy.stopReading();
      }
      if (![null, {} as TagEventLocal].includes(tag)) {
        setCard({ ...card, card_id: tag?.id });
      }
    }
    async function stopNfc() {
      await NfcProxy.stopReading();
    }

    if (scanning) {
      useNfc();
    } else {
      stopNfc();
    }
    return () => {
      NfcProxy.stopReading();
    };
  }, [scanning]);
  async function SubmitCard() {
    // console.log(card);
    let { res } = await ApiRequest<Card>(`/api/holder/${card.holder.id}/cards`, {
      method: "POST",
      body: JSON.stringify(card),
    });
    // console.log(res?.status);

    if (res?.status === 201 || res?.status === 200) {
      showMessage({
        message: `Card linked was successful`,
        description: ``,
        type: "success",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 2500,
        position: "bottom",
      });
      setCard({ card_id: "", card_name: "", holder: {} as Holder } as Card);
      setBuyer({} as Holder);
    } else {
      showMessage({
        message: `Card Link was Unsuccessful`,
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

  function renderNfcButtons() {
    return (
      <View
        style={{
          flex: 4,
          alignItems: "stretch",
          alignSelf: "center",
        }}
      >
        <Button
          onPress={async () => {
            setScanning(true);
            //  tag = { id: "0410308AC85E80" }; //for testing locally
          }}
          mode="contained"
        >
          {scanning ? "Scanning" : card.card_id ? "Card id:" + card.card_id : "Scan Card"}
        </Button>
        <View style={{ paddingTop: 5 }} />
        <Button onPress={() => setBottomSearch((nu: boolean) => !nu)} mode="contained">
          {buyer.name ? buyer.name : "Kies Lid Hier"}
        </Button>
        <View>
          <TextInput
            mode="outlined"
            style={{ height: 50 }}
            label="Card Name"
            value={card.card_name ? card.card_name : ""}
            onChangeText={(text) => setCard({ ...card, card_name: text })}
          />
          <Button
            disabled={
              [undefined, null, ""].includes(card.card_id) ||
              [undefined, null, ""].includes(card.holder?.name) ||
              [undefined, null, ""].includes(card.card_name)
                ? true
                : false
            }
            onPress={SubmitCard}
          >
            Submit
          </Button>
        </View>
      </View>
    );
  }

  function renderNfcNotEnabled() {
    return (
      <View
        style={{
          flex: 2,
          alignItems: "stretch",
          alignSelf: "center",
        }}
      >
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Your NFC is not enabled. Please first enable it and hit CHECK AGAIN button
        </Text>

        <Button mode="contained" onPress={() => NfcProxy.goToNfcSetting()} style={{ marginBottom: 10 }}>
          GO TO NFC SETTINGS
        </Button>

        <Button
          mode="outlined"
          onPress={async () => {
            NfcProxy.setEnabled(await NfcProxy.isEnabled());
          }}
        >
          CHECK AGAIN
        </Button>
      </View>
    );
  }

  return (
    <>
      {NfcProxy.supported && !NfcProxy.enabled && renderNfcNotEnabled()}

      {NfcProxy.supported && NfcProxy.enabled && renderNfcButtons()}

      {!NfcProxy.supported && (
        <View
          style={{
            //  center this view
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Subheading style={{ textAlign: "center", marginBottom: 10 }}>
            NFC is niet enabled op dit apparaat of is niet beschikbaar.
          </Subheading>
          <Subheading style={{ textAlign: "center", marginBottom: 10 }}>Card Linking is niet mogelijk.</Subheading>
        </View>
      )}
      <BottomSheetHolders placeholder={"Kies Gebruiker om te linken"} noNFC={true} />
    </>
  );
}

export default LinkCardScreen;
