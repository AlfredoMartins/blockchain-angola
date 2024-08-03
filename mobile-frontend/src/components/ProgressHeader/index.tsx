import { CaretLeft, CheckCircle, UsersFour, WarningCircle } from 'phosphor-react-native'
import logoImg from '@assets/flag.png';
import profileImg from '@assets/alfredo_party_75.png';
import fcBarca from '@assets/FC_Barcelona.png';
import theme from 'src/theme';
import { Image, StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ItemPropsNumber = { number: string, key: string };
type ItemType = { number: boolean };


export function Item(x: ItemType) {
    if (x.number) { return (<View style={styles.flatView1}/>); } 
    else return (<View style={styles.flatView2}/>);
};

export function ProgressHeader({ number }: ItemPropsNumber) {
    const list = [1, 2, 3, 4, 15];
    const listOfObjects = list.map((item, index) => ({ index: index, value: item }));
    const numColumns = 5;

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <FlatList
                    data={listOfObjects}
                    renderItem={({ item }) => <Item number={item.value <= parseInt(number)}/>}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                    numColumns={numColumns}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        marginTop: StatusBar.currentHeight,
        flexDirection: 'column',
        
    }, flatView1: {
        flex: 1,
        backgroundColor: '#010101',
        width: 50,
        height: 10,
        margin: 5
    }, flatView2: {
        flex: 1,
        backgroundColor: '#b0b0b0',
        width: 50,
        height: 10,
        margin: 5
    }
});