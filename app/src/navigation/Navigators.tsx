import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type AppParamsList = {
    LoginPage: undefined;
    Drawer: undefined;
    ProductsPage: undefined;
    AuthenticatedStack: undefined;
};

export const Stack = createNativeStackNavigator<AppParamsList>();

export type DrawerParamList = {
    LoginPage: undefined;
    ProductsPage: undefined;
    WalletUpgrateScreen: undefined;
    Settings: undefined;
    [key: string]: undefined | object; //remove if it doesnt cause any other ts-errors
};
export const Drawer = createDrawerNavigator<DrawerParamList>();
