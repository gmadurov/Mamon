import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  FlatList,
  RefreshControl,
} from "react-native";
import AuthContext from "../context/AuthContext";
import { GlobalStyles } from "../constants/styles";
import HolderContext from "../context/HolderContext";
import { useNavigation } from "@react-navigation/native";
import { Block, Text, theme } from "galio-framework";
import { Button } from "@rneui/base";
import PurchaseContext from "../context/PurchaseContext";
import Purchase from "../components/Purchase";
import ApiContext from "../context/ApiContext";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
let HeaderHeight = 100;

const AccountScreen = () => {
  const { user, authTokens } = useContext(AuthContext);
  const { holders, PUT } = useContext(HolderContext);
  const navigation = useNavigation();
  const holder = holders?.find((holder) => holder.id === user?.user_id);
  const { GET, purchases } = useContext(PurchaseContext);
  const [refreshing, setRefreshing] = useState(false);
  function renderItem(itemData) {
    return <Purchase purchase={itemData.item} />;
  }
  async function refresh() {
    setRefreshing(true);
    await GET();
    setRefreshing(false);
  }

  let totalBier = 0;
  purchases?.map((purchase) =>
    purchase?.orders?.map((order) =>
      order.product === 1
        ? (totalBier += order.quantity)
        : order.product === 4
        ? (totalBier += order.quantity * 6)
        : 0
    )
  );
  let totalHappen = 0;
  purchases?.map((purchase) =>
    purchase?.orders?.map(
      (order) => order.product === 3 && (totalHappen += order.quantity)
    )
  );

  async function ChangeStand(mutation) {
    await PUT({ ...holder, stand: holder?.stand + mutation });
  }
  // useLayoutEffect(() => {
  //   navigation.setOptions({ title: "My Account" + holder?.stand });
  // }, [navigation]);
  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={require("../assets/HeroImage.jpg")}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: "25%" }}
          > */}
          <Block flex style={styles.profileCard}>
            <Block middle style={styles.avatarContainer}>
              <Image
                source={require("../assets/user-default.jpg")}
                style={styles.avatar}
              />
            </Block>
            <Block style={styles.info}>
              <Block
                middle
                row
                space="evenly"
                style={{ marginTop: 20, paddingBottom: 24 }}
              >
                <Button
                  small
                  style={{ backgroundColor: GlobalStyles.colors.primary1 }}
                  onPress={() => ChangeStand(10)}
                >
                  add €10
                </Button>
                <Button
                  small
                  style={{ backgroundColor: GlobalStyles.colors.primary1 }}
                  onPress={() => ChangeStand(-10)}
                >
                  remove €10
                </Button>
              </Block>
            </Block>
            <Block flex style={styles.info}>
              <Block middle style={styles.nameInfo}>
                <Text bold size={28} color="#32325D">
                  {holder?.name}
                </Text>
                <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                  €{holder?.stand}
                </Text>
              </Block>
              <Block row space="between">
                <Block middle>
                  <Text
                    bold
                    size={18}
                    color="#525F7F"
                    style={{ marginBottom: 4 }}
                  >
                    {purchases.length}
                  </Text>
                  <Text size={12} color={GlobalStyles.colors.textColorDark}>
                    Orders
                  </Text>
                </Block>
                <Block middle>
                  <Text
                    bold
                    color="#525F7F"
                    size={18}
                    style={{ marginBottom: 4 }}
                  >
                    {totalBier}
                  </Text>
                  <Text size={12} color={GlobalStyles.colors.textColorDark}>
                    Biers
                  </Text>
                </Block>
                <Block middle>
                  <Text
                    bold
                    color="#525F7F"
                    size={18}
                    style={{ marginBottom: 4 }}
                  >
                    {totalHappen}
                  </Text>
                  <Text size={12} color={GlobalStyles.colors.textColorDark}>
                    Happen
                  </Text>
                </Block>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block row space="between">
                <Text bold size={16} color="#525F7F" style={{ marginTop: 12 }}>
                  Purchases
                </Text>
                <Button
                  small
                  color="transparent"
                  textStyle={{
                    color: "#5E72E4",
                    fontSize: 12,
                    marginLeft: 24,
                  }}
                >
                  View all
                </Button>
              </Block>
              <FlatList
                data={purchases}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => refresh()}
                  />
                }
              />
            </Block>
          </Block>
          {/* </ScrollView> */}
        </ImageBackground>
      </Block>
      {/* <ScrollView showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{ flex: 1, width, height, zIndex: 9000, backgroundColor: 'red' }}>
        <Block flex style={styles.profileCard}>
          <Block middle style={styles.avatarContainer}>
            <Image
              source={{ uri: Images.ProfilePicture }}
              style={styles.avatar}
            />
          </Block>
          <Block style={styles.info}>
            <Block
              middle
              row
              space="evenly"
              style={{ marginTop: 20, paddingBottom: 24 }}
            >
              <Button small style={{ backgroundColor: argonTheme.COLORS.INFO }}>
                CONNECT
              </Button>
              <Button
                small
                style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
              >
                MESSAGE
              </Button>
            </Block>

            <Block row space="between">
              <Block middle>
                <Text
                  bold
                  size={12}
                  color="#525F7F"
                  style={{ marginBottom: 4 }}
                >
                  2K
                </Text>
                <Text size={12}>Orders</Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 4 }}>
                  10
                </Text>
                <Text size={12}>Photos</Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 4 }}>
                  89
                </Text>
                <Text size={12}>Comments</Text>
              </Block>
            </Block>
          </Block>
          <Block flex>
              <Block middle style={styles.nameInfo}>
                <Text bold size={28} color="#32325D">
                  Jessica Jones, 27
                </Text>
                <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                  San Francisco, USA
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Text size={16} color="#525F7F" style={{ textAlign: "center" }}>
                  An artist of considerable range, Jessica name taken by
                  Melbourne …
                </Text>
                <Button
                  color="transparent"
                  textStyle={{
                    color: "#233DD2",
                    fontWeight: "500",
                    fontSize: 16
                  }}
                >
                  Show more
                </Button>
              </Block>
              <Block
                row
                style={{ paddingVertical: 14, alignItems: "baseline" }}
              >
                <Text bold size={16} color="#525F7F">
                  Album
                </Text>
              </Block>
              <Block
                row
                style={{ paddingBottom: 20, justifyContent: "flex-end" }}
              >
                <Button
                  small
                  color="transparent"
                  textStyle={{ color: "#5E72E4", fontSize: 12 }}
                >
                  View all
                </Button>
              </Block>
              <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                <Block row space="between" style={{ flexWrap: "wrap" }}>
                  {Images.Viewed.map((img, imgIndex) => (
                    <Image
                      source={{ uri: img }}
                      key={`viewed-${img}`}
                      resizeMode="cover"
                      style={styles.thumb}
                    />
                  ))}
                </Block>
              </Block>
          </Block>
        </Block>
                  </ScrollView>*/}
    </Block>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
    marginTop: "25%",
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
});
