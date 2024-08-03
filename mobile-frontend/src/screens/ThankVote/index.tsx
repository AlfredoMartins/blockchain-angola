import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import theme from 'src/theme';
import { StatusBar } from 'react-native';
import wellDoneImg from '@assets/well_done.png';
import EncryptedImage from '@assets/encrypted.png';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';

type ItemProps = { title: string, timestamp: string, people: string, src: string, key: string };

export function ThankVote({ navigation, route }: any) {
    const { data } = route.params;

    const [code, setCode] = useState("0x94857837593950509c38475924cr323242424");
    const [copyText, setCopyText] = useState("copy");
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        setCode(data);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setCopyText("copy");
            setOpacity(1);
        }, 2000);
    }, [copyText]);

    const onPress = () => {
        navigation.navigate('News');
    }

    const onClipBoard = async () => {
        await Clipboard.setStringAsync(code);
        setOpacity(0.5);
        setCopyText("copied");
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerContent}>
                <Image source={wellDoneImg} style={styles.imgCandidate} />
                <Text style={styles.thanksPlacing}>Thank you for placing your vote</Text>
                <Text style={{ textAlign: 'justify', fontSize: 12.7, marginTop: 5, color: 'white' }}>Your vote was encrypted and added successfully to chain.</Text>

                <View style={styles.containerEncrypt}>
                    <Image source={EncryptedImage} style={styles.imageEncry30} />
                    <Image source={EncryptedImage} style={styles.imageEncry50} />
                    <Image source={EncryptedImage} style={styles.imageEncry70} />
                    <Image source={EncryptedImage} style={styles.imageEncry} />
                    <Image source={EncryptedImage} style={styles.imageEncry70} />
                    <Image source={EncryptedImage} style={styles.imageEncry50} />
                    <Image source={EncryptedImage} style={styles.imageEncry30} />
                </View>

                <Text style={{ textAlign: 'justify', fontSize: 14, marginTop: 10, color: 'white' }}>Operation identifier | Confirmation code</Text>
                <View style={{
                    paddingTop: 10
                }}>

                    <TouchableOpacity onPress={onClipBoard} style={{ backgroundColor: 'transparent', alignItems: 'flex-end' }}>
                        <View style={{ backgroundColor: '#3b8150', padding: 4, borderRadius: 6 }}>
                            <Text style={{ color: '#ffffff', padding: 2, fontSize: 10, fontWeight: '500', opacity: opacity }}>{copyText}</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={{ textAlign: 'justify', fontSize: 9.1, marginTop: 0, color: '#ffffff' }} >{code}</Text>
                </View>

                <View style={styles.containerLevel}>
                    <TouchableOpacity style={styles.buttonNotify} onPress={onPress}>
                        <Text style={styles.textNotify}>Notify me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonOK} onPress={onPress}>
                        <Text style={styles.textOK}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#171717',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight
    }, containerContent: {
        backgroundColor: '#339952',
        marginTop: '40%',
        height: '100%',
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center'
    }, containerLevel: {
        width: '100%',
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10,
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
        gap: 15
    }, buttonNotify: {
        width: '75%',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#fbfbfb',
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 60,
        shadowColor: 'black',
        shadowOffset: {
            width: 8,
            height: 6
        }
    }, buttonOK: {
        width: '75%',
        alignItems: 'center',
        backgroundColor: '#202020',
        borderColor: '#171717',
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 55,
        shadowColor: 'black',
        shadowOffset: {
            width: 6,
            height: 6
        }
    }, textNotify: {
        color: '#1b1b1b',
        fontSize: 18,
        textAlign: 'center', // Center the text horizontally
        textAlignVertical: 'center',
        fontWeight: '700'
    }, textOK: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center', // Center the text horizontally
        textAlignVertical: 'center',
        fontWeight: '700'
    }, thanksPlacing: {
        textAlign: 'center',
        fontSize: 20,
        paddingTop: 5,
        fontWeight: '600',
        color: 'white'
    }, imageEncry: {
        resizeMode: 'contain',
        width: 50
    }, imageEncry30: {
        resizeMode: 'contain',
        width: 50,
        opacity: 0.3
    }, imageEncry50: {
        resizeMode: 'contain',
        width: 50,
        opacity: 0.7
    }, imageEncry70: {
        resizeMode: 'contain',
        width: 50,
        opacity: 0.8
    }, containerEncrypt: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        resizeMode: 'contain'
    }, imgCandidate: {
        resizeMode: 'contain',
        height: 200
    }
});