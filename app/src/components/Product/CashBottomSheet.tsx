import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { Divider, Surface } from 'react-native-paper';
import { GlobalStyles } from '../../constants/styles';
import FullContext from '../../context/FullContext';
import { Report } from '../../screens/ReportScreen';
const { width } = Dimensions.get("screen");

export default function CashBottomSheet({ report, setReport }: { report: Report, setReport: React.Dispatch<React.SetStateAction<Report>> }) {
    const { cashBottomSheet, setCashBottomSheet } = useContext(FullContext)
    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
    const handleSheetChange = useCallback(async (index: number) => {
        if (index === -1) {
            setCashBottomSheet(false);
        }
    }, []);
    const cash_options = [
        { id: 1, amount: 0.01, name: '1 cent', foto: require('../../assets/cash/1-cent.jpg') },
        { id: 12, amount: 0.05, name: '5 cents', foto: require('../../assets/cash/5-cent.jpg') },
        { id: 2, amount: 0.1, name: '10 cents', foto: require('../../assets/cash/10-cent.jpg') },
        { id: 3, amount: 0.2, name: '20 cents', foto: require('../../assets/cash/20-cent.jpeg') },
        { id: 4, amount: 0.5, name: '50 cents', foto: require('../../assets/cash/50-cent.jpg') },
        { id: 5, amount: 1, name: '€1', foto: require('../../assets/cash/1-euro.png') },
        { id: 6, amount: 5, name: '€5', foto: require('../../assets/cash/5-euro.jpg') },
        { id: 7, amount: 10, name: '€10', foto: require('../../assets/cash/10-euro.jpg') },
        { id: 8, amount: 20, name: '€20', foto: require('../../assets/cash/20-euro.jpg') },
        { id: 9, amount: 50, name: '€50', foto: require('../../assets/cash/50-euro.jpeg') },
        { id: 10, amount: 100, name: '€100', foto: require('../../assets/cash/100-euro.webp') },
        { id: 11, amount: 200, name: '€200', foto: require('../../assets/cash/200-euro.jpg') },
    ]

    const renderItem = ({ item }: { item: { id: number, amount: number, name: string, foto: string } }) => {
        return (
            <Surface style={[styles.gridItem, { elevation: 2 }]}>
                <Pressable
                    android_ripple={{ color: GlobalStyles.colors.androidRippleColor }}
                    style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : { flex: 1 }]}
                    onPress={() => {
                        // @ts-ignore
                        setReport({ ...report, total_cash: parseFloat((report.total_cash + item.amount).toFixed(3)) });
                    }}
                >
                    <View style={styles.innerContainer}>
                        {/* @ts-ignore */}
                        <Image source={item.foto} style={styles.avatar} />
                        <Text style={styles.title}>{item?.name}</Text>
                    </View>
                </Pressable>
            </Surface >
        );
    }
    if (cashBottomSheet) {
        return (
            <BottomSheet
                snapPoints={snapPoints}
                enablePanDownToClose
                ref={sheetRef}
                index={0}
                onChange={handleSheetChange}
            // keyboardDismissMode="on-drag"
            >
                {/* <View style={styles.contentContainer}> */}
                <BottomSheetFlatList
                    style={{ flex: 1 }}
                    numColumns={Math.floor(width / 196)}
                    data={cash_options}
                    keyExtractor={(item) => item.id.toString() as string}
                    ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
                    // renderItem={({ item }) => showHolder(item)}
                    showsVerticalScrollIndicator={false}
                />
                {/* </View> */}
            </BottomSheet>
        );
    } else {
        return <></>;
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignSelf: "stretch",
        alignItems: "flex-start",
    }, gridItem: {
        flex: 2,
        margin: 16,
        height: 150,
        borderRadius: 8,
        elevation: 4,
        backgroundColor: GlobalStyles.colors.primary1,
        shadowColor: GlobalStyles.colors.shadowColor,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        overflow: Platform.OS === "android" ? "hidden" : "visible",
    },
    button: {
        flex: 1,
    },
    buttonPressed: {
        opacity: 0.5,
    },
    innerContainer: {
        flex: 4,
        padding: 16,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 15,
        zIndex: 1,
        // position: 'absolute',
    },
    avatar: {
        width: 124,
        height: 124,
        borderRadius: 62,
        borderWidth: 0,
        opacity: 0.9,
        position: "absolute",
        marginBottom: 10,
    },
})