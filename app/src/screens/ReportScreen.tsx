import {
  Appbar,
  Button,
  Divider,
  RadioButton,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import React, { ScrollView, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import CartContext from "../context/CartContext";
import PersonelView from "../components/Cart/PersonelView";
import User from "../models/Users";
import { showMessage } from "react-native-flash-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerParamList } from "../navigation/Navigators";
import { GlobalStyles } from "../constants/styles";
import FullContext from "../context/FullContext";
import NFCContext, { TagEventLocal } from "../context/NFCContext";
import { AuthToken } from "../models/AuthToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CashBottomSheet from "../components/Product/CashBottomSheet";

export type Report = {
  personel?: {
    username: string;
    password: string
  };
  action?: Action;
  total_cash?: number;
  flow_meter1?: number;
  flow_meter2?: number;
  comment?: string;
};
export enum Action {
  Open = "Open",
  Close = "Close",
  Middle = "Middle",
}

type Props = NativeStackScreenProps<DrawerParamList, "ReportScreen">;

const ReportScreen = ({ navigation }: Props) => {
  //  create state for all properties of Report
  const { setCashBottomSheet } = useContext(FullContext)
  const { seller, setSeller } = useContext(CartContext);
  const { ApiRequest } = useContext(ApiContext);
  const [report, setReport] = useState<Report>({
    personel: undefined,
    action: undefined,
    total_cash: 0,
    flow_meter1: 0,
    flow_meter2: 0,
    comment: "",
  } as Report);

  const [searchTapper, setSearchTapper] = useState(false);
  const [token, setToken] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const { setBottomSearch } = useContext(FullContext)
  const NfcProxy = useContext(NFCContext)
  useEffect(() => {
    setReport({ ...report, personel: { username: seller.username, password: '' } });
  }, [seller]);

  async function SubmitReport() {
    let config
    if (token) {
      delete report.personel
      config = {
        method: "POST",
        body: JSON.stringify(report),
        headers: {
          "Content-Type": "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    } else {
      config = {
        method: "POST",
        body: JSON.stringify(report),
      }
    }


    let { res } = await ApiRequest<Report>("/api/reports/", config);
    setToken("")
    if (res?.status === 201 || res?.status === 200) {
      showMessage({
        message: `Report was successful`,
        description: ``,
        type: "success",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 2500,
        position: "bottom",
      });
      setReport({
        personel: undefined,
        action: undefined,
        total_cash: 0,
        flow_meter1: 0,
        flow_meter2: 0,
        comment: "",
      } as Report);
      setSeller({} as User);
    } else if (res?.status === 501) {
      showMessage({
        message: `Cannot close Barcycle`,
        description: `There are no barcycles open to close please start a new barcycle before closing one.`,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 3500,
        position: "bottom",
      });
    } else {
      showMessage({
        message: `Report was Unsuccessful`,
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

  async function searchTapperNFC() {
    // console.log(await AsyncStorage.getItem('0410308AC85E80'))
    setSearchTapper((nu) => !nu);
    let tag: TagEventLocal | null = null;
    if ((NfcProxy.enabled && NfcProxy.supported)) {
      try {
        tag = await NfcProxy.readTag();
        let token_local: AuthToken = JSON.parse(await AsyncStorage.getItem(tag?.id as string) || '{}')
        if (typeof token_local === 'string') {
          token_local = JSON.parse(token_local)
        }
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
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header style={{ backgroundColor: GlobalStyles.colors.primary1 }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Report maken" style={{ alignItems: "center" }} />
          {NfcProxy.enabled && NfcProxy.supported &&
            <>
              <Appbar.Action icon={!showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword((nu) => !nu)} />
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
  return (
    <>
      <ScrollView>
        <TouchableRipple
          onPress={() => setReport({ ...report, action: Action.Open })}
        >
          <View style={styles.row}>
            <Text>Niewe Bar Cycle openen</Text>
            <RadioButton
              value="first"
              status={report.action === Action.Open ? "checked" : "unchecked"}
              onPress={() => setReport({ ...report, action: Action.Open })}
            />
          </View>
        </TouchableRipple>
        <Divider />
        <TouchableRipple
          onPress={() => setReport({ ...report, action: Action.Middle })}
        >
          <View style={styles.row}>
            <Text>Middle report aanmaken</Text>
            <RadioButton
              value="first"
              status={report.action === Action.Middle ? "checked" : "unchecked"}
              onPress={() => setReport({ ...report, action: Action.Middle })}
            />
          </View>
        </TouchableRipple>
        <Divider />
        <TouchableRipple
          onPress={() => setReport({ ...report, action: Action.Close })}
        >
          <View style={styles.row}>
            <Text>Laaste Bar Cycle sluiten</Text>
            <RadioButton
              value="closed"
              status={report.action === Action.Close ? "checked" : "unchecked"}
              onPress={() => setReport({ ...report, action: Action.Close })}
            />
          </View>
        </TouchableRipple>
        <Divider />
        {showPassword || !(NfcProxy.enabled && NfcProxy.supported) ?
          <>
            <PersonelView />
            <TextInput
              label="Tapper Wachtwoord"
              secureTextEntry
              value={report.personel?.password ? report.personel?.password : ""}
              onChangeText={(text) => setReport({ ...report, personel: { username: report.personel?.username || '', password: text } })}
            />
          </>
          : (
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
              <Button
                onPress={searchTapperNFC}
                textColor={GlobalStyles.colors.thetaGeel}
                buttonColor={GlobalStyles.colors.thetaBrown}
                mode={"contained"}
              >
                {token ? "Tapper Selected" : !searchTapper ? "Scan NFC voor Tapper" : "Scanning..."}
              </Button>
            </View>
          )}
        <TextInput
          label="Total Cash"
          value={report.total_cash ? report.total_cash.toString() : ""}
          keyboardType="numeric"
          onChangeText={(text) =>
            setReport({ ...report, total_cash: parseFloat(text) })
          }
          right={<TextInput.Icon icon="cash" onPress={() => {
            setCashBottomSheet(nu => !nu)
          }} />}
        />
        <TextInput
          label="Flow Meter 1"
          value={report.flow_meter1 ? report.flow_meter1.toString() : ""}
          keyboardType="numeric"
          onChangeText={(text) =>
            setReport({ ...report, flow_meter1: Number(text) })
          }
        />
        <TextInput
          label="Flow Meter 2"
          value={report.flow_meter2 ? report.flow_meter2.toString() : ""}
          keyboardType="numeric"
          onChangeText={(text) =>
            setReport({ ...report, flow_meter2: Number(text) })
          }
        />
        <TextInput
          label="Comment"
          value={report.comment ? report.comment : undefined}
          onChangeText={(text) => setReport({ ...report, comment: text })}
        />
        <Button
          disabled={
            [undefined, null, "" as Action].includes(report.action) ||
              [undefined, null, NaN].includes(report.flow_meter1) ||
              [undefined, null, NaN].includes(report.flow_meter2) ||
              [undefined, null, NaN].includes(report.total_cash) ||
              [undefined, {}].includes(report.personel)
              ? true
              : false
          }
          onPress={SubmitReport}
        >
          Submit
        </Button>
      </ScrollView>
      <CashBottomSheet setReport={setReport} report={report} />
    </>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
