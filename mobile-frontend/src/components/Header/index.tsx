import { SignOut, UserFocus, WarningCircle } from 'phosphor-react-native'
import logoImg from '@assets/logo.png';
import profileImg from '@assets/alfredo_party_50.png';
import theme from 'src/theme';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from 'src/context/AuthContext';
import { useState } from 'react';


export function Header({ navigation }: any) {
    const { onLogOut } = useAuth();

    const onPressLogOut = () => {
        onLogOut!();
        navigation.navigate('Login');
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            height: 20,
            maxHeight: 60,
            marginTop: 60,
            marginBottom: 10,
            paddingRight: 10,
        }}>

            <View style={styles.logOut}>
                <TouchableOpacity onPress={onPressLogOut}>
                    <SignOut size={32} />
                    <Text style={{ fontSize: 9 }}>LogOut</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.leftContainer}>
                <Image source={logoImg} style={styles.logo} />
            </View>
            <View style={styles.container}>
                <View style={styles.rightContainer}>
                    <View style={styles.alertContainer}>
                        <WarningCircle size={32} />
                        <Text style={{ fontSize: 12 }}>Alert</Text>
                    </View>
                    <View >
                        <UserFocus size={45} />
                   </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 25,
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    leftContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        position: 'relative',
        height: '100%',
        backgroundColor: 'transparent'
    }, logOut: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        alignItems: 'center',
        position: 'relative',
        height: '100%',
        backgroundColor: 'transparent'
    },
    logo: {
        flexDirection: 'row',
        width: 46,
        height: 46,
        justifyContent: 'center',
        resizeMode: 'contain'
    },
    profileContainer: {
        borderWidth: 2,
        borderColor: '#1d1c1c',
        borderRadius: 50
    },
    alertContainer: {
        textAlign: 'center',
        alignItems: 'center'
    }
});