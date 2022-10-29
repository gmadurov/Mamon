import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@rneui/themed";
import ProductContext from "../context/ProductContext";
import Purchase from "../models/Purchase";

const Purchase = ({ purchase }: { purchase: Purchase }) => {
  const { products } = useContext(ProductContext);
  let total = 0;
  purchase?.orders?.reduce(
    (partialSum, a) =>
      partialSum +
      (products?.find((product) => product.id === a.product)?.price || 0) *
        a.quantity,
    0
  );
  const created = new Date(purchase?.created || 0);
  return (
    <Card>
      <Text>
        {/* {holders?.find((holder) => holder.id === purchase?.buyer).name}  */}
        For a {purchase?.payed ? "payed" : "loged"} total of €
        {total?.toFixed(2).toString()} on {created.toDateString()}{" "}
        {created.toLocaleTimeString("nl-NL")}:
      </Text>
      {purchase?.orders?.map((order) => (
        <View key={"cart product" + order.product}>
          <Text>
            {order.quantity}{" "}
            {products?.find((product) => product.id === order.product)?.name}
            {order.quantity > 1 && "s"}
          </Text>
        </View>
      ))}
    </Card>
  );
};

export default Purchase;

const styles = StyleSheet.create({ container: {} });
