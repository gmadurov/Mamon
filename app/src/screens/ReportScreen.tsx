import {
  Button,
  Divider,
  RadioButton,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import React, { ScrollView, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import CartContext from "../context/CartContext";
import PersonelView from "../components/Cart/PersonelView";
import User from "../models/Users";
import { showMessage } from "react-native-flash-message";

export type Report = {
  personel?: User;
  action?: Action;
  total_cash?: number;
  flow_meter1?: number;
  flow_meter2?: number;
  comment?: string;
  password?: string;
};
export enum Action {
  Open = "Open",
  Close = "Close",
  Middle = "Middle",
}
const ReportScreen = () => {
  //  create state for all properties of Report
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
  useEffect(() => {
    setReport({ ...report, personel: seller });
  }, [seller]);

  async function SubmitReport() {
    let { res } = await ApiRequest<Report>("/api/report/", {
      method: "POST",
      body: JSON.stringify(report),
    });
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
  return (
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
      <PersonelView />
      <TextInput
        label="Tapper Wachtwoord"
        secureTextEntry
        value={report.password ? report.password : ""}
        onChangeText={(text) => setReport({ ...report, password: text })}
      />
      <TextInput
        label="Total Cash"
        value={report.total_cash ? report.total_cash.toString() : ""}
        keyboardType="numeric"
        onChangeText={(text) =>
          setReport({ ...report, total_cash: Number(text) })
        }
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
          [undefined, {} as User].includes(report.personel)
            ? true
            : false
        }
        onPress={SubmitReport}
      >
        Submit
      </Button>
    </ScrollView>
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
