import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import BottomSheetHolders, { HolderChoice } from "../components/Cart/BottomSheetHolders";
import NFCContext, { TagEventLocal } from "../context/NFCContext";

import { DrawerActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { showMessage } from "react-native-flash-message";
import { Appbar } from "react-native-paper";
import Cart from "../components/Cart/Cart";
import PersonelView from "../components/Cart/PersonelView";
import ProductTile from "../components/Product/ProductTile";
import { GlobalStyles } from "../constants/styles";
import ApiContext from "../context/ApiContext";
import CartContext from "../context/CartContext";
import FullContext from "../context/FullContext";
import HolderContext from "../context/HolderContext";
import ProductContext from "../context/ProductContext";
import SettingsContext from "../context/SettingsContext";
import { Card } from "../models/Card";
import Holder from "../models/Holder";
import User from "../models/Users";

const { width } = Dimensions.get("screen");
type RootStackParamList = {
  props: { sell?: boolean };
  ProductScreen: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, "ProductScreen">;

const ProductScreen = () => {
  const { GET, selectedProducts } = useContext(ProductContext);
  const { GET: GET_HOLDER, holders } = useContext(HolderContext);
  const { GET_categories, sideBySide } = useContext(SettingsContext);
  const { ApiRequest } = useContext(ApiContext);
  const { cart, setBuyer, setSeller } = useContext(CartContext);
  const [refreshing, setRefreshing] = useState(false);
  const NfcProxy = useContext(NFCContext);
  const { setBottomSearch } = useContext(FullContext);
  const [selected, setSelected] = useState(0);
  const navigation = useNavigation();
  function renderProducts(itemData: { item: any }) {
    return <ProductTile product={itemData.item} selected={selected} setSelected={setSelected} />;
  }
  async function startNfc() {
    let tag: TagEventLocal | null = null;
    if (NfcProxy.enabled && NfcProxy.supported) {
      // console.log("start nfc");
      try {
        tag = await NfcProxy.readTag();
        setBuyer({} as Holder);
      } catch (e) {
        await NfcProxy.stopReading();
      } finally {
        await NfcProxy.stopReading();
        showMessage({
          message: "NFC scan stopped",
          type: "info",
          hideStatusBar: true,
          autoHide: true,
          position: "bottom",
          duration: 500,
        });
      }

      // const tag = { id: "0410308AC85E80" }; //for testing locally
      if (tag?.id) {
        // console.log(tag);
        showMessage({
          message: `Card ${tag?.id} scanned`,
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 500,
          position: "bottom",
        });
        const { res, data } = await ApiRequest<Card>(`/api/cards/${tag?.id}/`);
        if (res.status === 200) {
          // console.log(data);
          setBuyer({
            ...holders.find(hol=> hol.id === data.user.holder),
            value: data.user.id,
            label: data.user?.name,
          } as HolderChoice);
          setBottomSearch(false);
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
      }
    }
  }
  useEffect(() => {
    async function useNfc() {
      await startNfc();
    }
    async function stopNfc() {
      await NfcProxy.stopReading();
    }

    if (cart.length > 0) {
      stopNfc();
      useNfc();
    } else {
      setBuyer({} as Holder);
      stopNfc();
    }
  }, [cart]);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header style={{ backgroundColor: "white" }}>
          <Appbar.Action icon={"menu"} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />
          <Appbar.Content title="Mamon" />
          {NfcProxy.NFCreading && <Appbar.Action icon="nfc" />}
          <Appbar.Action icon={"account-box"} onPress={() => setBottomSearch(nu => !nu)} />
        </Appbar.Header>
      ),
    });
  }, [cart, NfcProxy.NFCreading]);

  async function getProducts() {
    setRefreshing(true);
    await GET();
    await GET_HOLDER();
    await GET_categories();
    setBuyer({} as Holder);
    setSeller({} as User);
    setRefreshing(false);
  }
  return (
    <>
      <View
        style={[
          { flex: 1 },
          sideBySide && {
            paddingBottom: 50,
            flexDirection: "row-reverse",
          },
        ]}
      >
        <View style={[styles.cartView, !sideBySide && { flex: 1 }]}>
          <View style={{ flex: 3 }}>
            <Cart />
          </View>
          <View style={{ flex: 1 }}>
            <PersonelView />
          </View>
          <View style={{ flex: 1 }}>
            <Cart buttons={true} />
          </View>
        </View>
        <View style={[styles.productView, !sideBySide && { flex: 1 }]}>
          <Text style={styles.text}>Producten</Text>
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.id.toString() as string}
            renderItem={renderProducts}
            numColumns={Math.floor(width / 196)}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getProducts()} />}
          />
        </View>
      </View>
      <BottomSheetHolders placeholder="Kies Lid Hier" />
    </>
  );
};
export default ProductScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: GlobalStyles.colors.textColorDark,
    textAlign: "right",
  },
  cartView: { flex: 1 },
  productView: { flex: 2 },
});
