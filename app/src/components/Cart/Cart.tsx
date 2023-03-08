import { Button, Divider, TouchableRipple } from "react-native-paper";
import CartContext, { CartItems, PaymentType } from "../../context/CartContext";
import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import CartItem from "./CartItem";
import { FlatList } from "react-native";
import FullContext from "../../context/FullContext";
import { GlobalStyles } from "../../constants/styles";
import Holder from "../../models/Holder";
import IconButton from "../ui/IconButton";

export const Cart = ({ sell, buttons = false }: { sell?: boolean; buttons?: boolean }) => {
  const { cart, setCart, buy_cart, buyer, setBuyer, seller } = useContext(CartContext);

  const [disabled, setDisabled] = useState<boolean>(true);
  // let total equal the sum of the products in the cart multiplied by the quantity
  let total = cart?.reduce((partialSum, a) => partialSum + a.price * a.quantity, 0);
  // console.log(users);
  function renderProducts(cartItem: CartItems) {
    return (
      <CartItem
        quantity={cartItem.quantity}
        product={
          ({
            price: cartItem.price,
            name: cartItem.name,
            quantity: cartItem.quantity,
            product: cartItem,
            id: cartItem.id,
          } as unknown as CartItems) || ({} as CartItems)
        }
      />
    );
  }
  async function buy(payment: PaymentType) {
    await buy_cart(buyer, payment);
    setBuyer({} as Holder);
  }
  useEffect(() => {
    function checkStand() {
      // this has a change for double spending highly unlikely but still need to fix
      if (buyer?.stand > total && total > 0.5 && seller.id) {
        setDisabled(!true);
      } else {
        setDisabled(!false);
      }
    }
    checkStand();
    // eslint-disable-next-line
  }, [buyer, total, seller]);

  if (buttons) {
    return (
      <View style={styles.view}>
        {/* <TouchableRipple // was View
          onPress={() => {
            setCart([] as CartItems[]);
            setBuyer({} as Holder);
          }}
          style={[{ backgroundColor: "red" }, styles.button]}
        >
          <Button
            // android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
            // style={styles.EmptyButton}
            color="white"
            onPress={() => {
              setCart([] as CartItems[]);
              setBuyer({} as Holder);
            }}
          >
            Leegmaken
          </Button>
        </TouchableRipple> */}

        {disabled && (
          <>
            <TouchableRipple // was View
              onPress={() => {
                buy("pin");
              }}
              style={[{ backgroundColor: "black" }, styles.button]}
            >
              <Button
                color="white"
                onPress={() => {
                  buy("pin");
                }}
              >
                Pin
              </Button>
            </TouchableRipple>
          </>
        )}
        {buyer.id && seller.id && total > 0 && (
          <TouchableRipple // was View
            onPress={() => {
              buy("balance");
            }}
            disabled={disabled}
            style={[
              disabled ? { backgroundColor: "grey" } : { backgroundColor: GlobalStyles.colors.thetaGeel, width: "100%" },
              styles.button,
            ]}
          >
            <Button
              color={GlobalStyles.colors.thetaBrown}
              disabled={disabled}
              onPress={() => {
                buy("balance");
              }}
            >
              {disabled ? "Geen Saldo" : "Afrekenen"}
            </Button>
          </TouchableRipple>
        )}
        {disabled && (
          <>
            <TouchableRipple // was View
              onPress={() => {
                buy("cash");
              }}
              disabled={disabled}
              style={[{ backgroundColor: "green" }, styles.button]}
            >
              <Button
                color="white"
                onPress={() => {
                  buy("cash");
                }}
              >
                Cash
              </Button>
            </TouchableRipple>
          </>
        )}
      </View>
    );
  } else {
    return (
      <View style={[styles.gridItem]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{buyer.id ? "Koper: " + buyer.name : "Cart"}</Text>
            <Text style={styles.headerText}>
              Total: ${total.toFixed(2).toString()}
              <IconButton
                name={"close-circle-outline"}
                style={styles.input}
                color={GlobalStyles.colors.textColorDark}
                onPressFunction={() => {
                  setCart([] as CartItems[]);
                  setBuyer({} as Holder);
                }}
              />
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: "grey" }} />
          {/* </View>
        <View style={[styles.innerContainer, !(cart.length > 0) && { alignItems: "center" }]}> */}
          {!(cart.length > 0) ? (
            <Text style={{ flex: 1, textAlign: "center", textAlignVertical: "center", fontSize: 20, color: "grey" }}>
              Cart is leeg
            </Text>
          ) : (
            <FlatList
              data={cart}
              keyExtractor={(item) => "cart product" + item.id}
              renderItem={({ item }) => renderProducts(item)}
              ItemSeparatorComponent={Divider}
              numColumns={1}
            />
          )}
        </View>
      </View>
    );
  }
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.26,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  innerContainer: {
    flex: 5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.26,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gridItem: {
    flex: 1,
    margin: 16,
    // height: 150,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: GlobalStyles.colors.primary3,
    shadowColor: GlobalStyles.colors.shadowColor,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  button: {
    borderRadius: 20,
  },
  EmptyButton: {
    maxWidth: 4,
    backgroundColor: "red",
    textColor: "white",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  // innerContainer: {
  //   flex: 1,
  //   padding: 16,
  //   borderRadius: 8,
  //   justifyContent: "center",
  //   backgroundColor: GlobalStyles.colors.offwhite,
  // },
  view: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "10%",
    borderRadius: 20,
  },
  input: {
    paddingTop: 10,
    marginTop: 10,
    fontSize: 18,
    height: 35,
    color: GlobalStyles.colors.textColorDark,
  },
});
