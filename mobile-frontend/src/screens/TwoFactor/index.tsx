import { CaretLeft } from 'phosphor-react-native';
import { StyleSheet, View, Text, FlatList, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NumberItem } from '@components/NumberItem';
import { CandidateItem } from '@components/CandidateItem';
import { PinItem } from '@components/PinItem';
import { LOCALHOST, TOKEN_KEY, useAuth } from 'src/context/AuthContext';
import * as FileSystem from 'expo-file-system';
import axios from 'src/api/axios';
import axios_ from 'axios';
import * as SecureStore from 'expo-secure-store';

const TRANSACTION_URL = '/blockchain/transaction';
const VERIFY_OTP_URL = '/committee/verify-otp';

const writeFile = async (token: string) => {
    const fileUri = `${FileSystem.documentDirectory}/certificate.cert`;
    await FileSystem.writeAsStringAsync(fileUri, token);
    console.log('File written successfully.');
    // console.log('URL: ', fileUri);
};

export function TwoFactor({ navigation, route }: any) {
    const { id, name, party, acronym, photo, src, isFactor } = route.params;

    const numColumns = 6;
    const [candidates, setCandidates] = useState([
        {
            name: name,
            party: party,
            photo: photo,
            acronym: acronym,
            src: src,
            key: id
        }]);

    const [numCodes, setNumCodes] = useState([11, 12, 13, 14, 15, 16]);

    const [numbers, setNumbers] = useState([
        {
            number: '1',
            key: '1'
        },
        {
            number: '2',
            key: '2'
        },
        {
            number: '3',
            key: '3'
        },
        {
            number: '4',
            key: '4'
        },
        {
            number: '5',
            key: '5'
        },
        {
            number: '6',
            key: '6'
        },
        {
            number: '7',
            key: '7'
        },
        {
            number: '8',
            key: '8'
        },
        {
            number: '9',
            key: '9'
        },
        {
            number: ' ',
            key: '10'
        },
        {
            number: '0',
            key: '11'
        }, {
            number: 'del',
            key: '12'
        }
    ]);


    const [xTexts, setXtexts] = useState<string[]>(["X"]);
    const [selected, setSelected] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { authState, onLogOut } = useAuth();
    const [activeScreen, setActiveScreen] = useState("Login");

    useEffect(() => {
        // alert("Check authentication :)");
        if (!authState?.authenticated || !authState?.electoralId) {
            onLogOut!();
            setActiveScreen("Login");
        }
    }, []);

    const onPressBack = () => {
        navigation.navigate('Candidates');
    }

    const openThankYou = async (data: string) => {
        const token = authState?.token || "";
        await writeFile(token);
        navigation.navigate('Thank Vote', { data });
    }

    const placeVote = async (): Promise<string> => {
        const URL = LOCALHOST + authState?.port + '/api' + TRANSACTION_URL;
        console.log("URL: ", URL);
        const body = { identifier: authState?.electoralId, choiceCode: (id + 1), secret: authState?.token };
        const response = await axios_.post(URL, body);
        const statusCode = response.status;

        if (statusCode === 201) {
            const transactionHash = response.data.details.transactionHash;
            return transactionHash;
        }

        return "";
    }

    const resetValues = () => {
        setOtpCode("");
        setXtexts(["X"]);
        setSelected(0);
    }

    const verifyToken = async () => {
        try {

            if (!axios.defaults.headers.common['Authorization']) {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['Cookie'] = `jwt=${token}`;
                }
            }

            const body = { email: authState?.email, token: authState?.token, otpCode: otpCode };
            console.log("URI: ", VERIFY_OTP_URL);

            const response = await axios.post(VERIFY_OTP_URL, body);
            const data = await placeVote();

            const statusCode = response.status; // 200 for testing reasons

            console.log("response: ", response);
            console.log("code: ", statusCode);

            if (statusCode === 200 && data.length > 0) {
                console.log("Transaction? = ", data);
                openThankYou(data);
            } else {
                onPressBack();
            }

        } catch (error) {
            onPressBack();
            console.log(error);
        }
    }

    const [otpCode, setOtpCode] = useState<string>("");

    useEffect(() => {
        setIsRefreshing(true);

        if (otpCode.length === 6) {
            verifyToken();
            resetValues();
        }
    }, [otpCode])

    return (
        <View style={styles.container}>

            <View style={styles.containerHeader}>

                <View style={styles.topBar}>
                    <TouchableOpacity onPress={onPressBack}>
                        <CaretLeft size={32} />
                    </TouchableOpacity>
                </View>

                <View style={styles.topTitle}>
                    <Text style={styles.textFactor}>Two-factor authentication</Text>
                </View>

            </View>

            <View style={styles.containerVerification}>
                <Text style={styles.textVerification}>TOTP Verification Code</Text>
                <Text>Please enter the code you got.</Text>
                <Text>It is about to expire in less than 5 minutes.</Text>

                <View style={styles.containerCode}>
                    <FlatList
                        data={numCodes}
                        renderItem={({ item }) => <NumberItem number={item} />}
                        keyExtractor={item => item.toString()}
                        extraData={numCodes}
                        showsVerticalScrollIndicator={false}
                        alwaysBounceVertical={false}
                        numColumns={numColumns}
                        refreshing={isRefreshing}
                    />
                </View>
            </View>
            <Text style={styles.textResend} /*onPress={openThankYou}*/>Resend OTP</Text>
            <View style={styles.containerDigits}>
                <View style={styles.containerPIN}>
                    <FlatList
                        data={numbers}
                        renderItem={({ item }) => <PinItem number={item.number} key={item.key} token={otpCode} setToken={setOtpCode} numCodes={numCodes} setNumCodes={setNumCodes} setIsRefresh={setIsRefreshing} />}
                        keyExtractor={item => item.key}
                        showsVerticalScrollIndicator={false}
                        alwaysBounceVertical={false}
                        numColumns={3}
                    />
                </View>

                <View style={styles.containerCandidate}>
                    <FlatList
                        data={candidates}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ paddingTop: 20 }}>
                                    <Text style={styles.textVoting}>Voting for</Text>
                                    <CandidateItem
                                        id={item.key}
                                        name={item.name} party={item.party} photo={item.photo} src={item.src} acronym={item.acronym}
                                        selected={selected} setSelected={setSelected}
                                        xTexts={xTexts} setXtexts={setXtexts}
                                        isFactor={true}
                                        navigation={navigation}
                                    />
                                </View>
                            );
                        }}
                        keyExtractor={item => item.key}
                        showsVerticalScrollIndicator={false}
                        alwaysBounceVertical={false}
                        style={styles.containerFlatCandidate}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }, containerHeader: {
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 45,
        backgroundColor: 'transparent',
        width: '100%',
        maxHeight: 100,
        alignItems: 'center',
        alignContent: 'center',
    },
    topBar: {
        height: '100%',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        zIndex: 2 // Set a higher zIndex for the topBar
    },
    topTitle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'transparent',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1 // Set a lower zIndex for the topTitle
    },
    textFactor: {
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '500'
    }, containerVerification: {
        flex: 1,
        backgroundColor: 'transparent',
        width: '100%',
        padding: 15,
    }, textVerification: {
        fontWeight: '600',
        paddingBottom: 2.5
    }, textResend: {
        textAlign: 'center',
        fontWeight: '600',
        textAlignVertical: 'bottom',
        bottom: 0,
        fontSize: 14
    }, containerCode: {
        backgroundColor: 'transparent',
    }, containerDigits: {
        flex: 3,
        backgroundColor: '#F6F6F6',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 2
    }, containerCandidate: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        paddingTop: 0
    }, containerPIN: {
        height: '100%',
        paddingBottom: 100
    }, textVoting: {
        textAlign: 'center',
/*        fontWeight: '600',
*/        textAlignVertical: 'bottom',
        bottom: 5,
        fontSize: 14
    }, containerFlatCandidate: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0
    },
});