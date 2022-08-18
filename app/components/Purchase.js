import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@rneui/themed";

const Purchase = ({ purchase }) => {
  const { products } = useContext(ProductContext);
  // console.log(purchase);
  let total = 0;
  purchase?.orders?.map(
    (order) =>
      (total +=
        products?.find((product) => product.id === order.product).price *
        order.quantity)
  );
  return (
    <Card style={styles.container}>
      <Text>
        {/* {holders?.find((holder) => holder.id === purchase?.buyer).name}  */}
        For a {purchase?.payed ? "payed" : "loged"} total of €
        {parseFloat(total).toPrecision(total <= 10 ? 3 : total <= 100 ? 4 : 5)}:
      </Text>
      {purchase?.orders?.map((order) => (
        <View key={"cart product" + order.product}>
          <Text>
            {order.quantity}{" "}
            {products?.find((product) => product.id === order.product).name}
            {order.quantity > 1 && "s"}
          </Text>
        </View>
      ))}
    </Card>
  );
};

export default Purchase;

const styles = StyleSheet.create({ container: {} });
