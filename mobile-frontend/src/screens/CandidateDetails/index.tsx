import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { useEffect, useState } from 'react';

export function CandidateDetails({ navigation, route }: any) {
    const { name, party, photo, src } = route.params;

    const [candidatePhoto, setCandidatePhoto] = useState(photo);

    const onPressOK = () => {
        navigation.goBack();
    }

    const onPressBack = () => {
        navigation.navigate('Candidates');
    }

    return (
        <View style={styles.container}>

            <View style={styles.topBar}>
                <TouchableOpacity onPress={onPressBack}>
                    <CaretLeft size={32} />
                </TouchableOpacity>
            </View>
            <View style={styles.containerContent}>
                <Image source={{ uri: candidatePhoto }} width={200} style={styles.imgCandidate} />

                <Text style={styles.textCandidate}>{name}</Text>
                <Text style={{ textAlign: 'justify', fontSize: 18, marginTop: 5, color: 'black' }}>{party}</Text>

                <Image source={{ uri: src }} width={100}  style={styles.imgParty} />


                <View style={styles.containerLevel}>
                    <TouchableOpacity style={styles.buttonOK} onPress={onPressOK}>
                        <Text style={styles.textOK}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
    }, containerContent: {
        backgroundColor: '#ffffff',
        height: '100%',
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center'
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
    }, textCandidate: {
        textAlign: 'center',
        fontSize: 36,
        paddingTop: 5,
        fontWeight: '600',
        color: 'black'
    }, containerEncrypt: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        resizeMode: 'contain'
    }, imgCandidate: {
        resizeMode: 'contain',
        height: 200,
        borderRadius: 50,
    }, imgParty: {
        resizeMode: 'contain',
        height: 80
    }, topBar: {
        gap: 2,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 45,
    },
});