import logoImg from '@assets/logo.png';
import background from '@assets/compressed/Background-min.png';
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import theme from 'src/theme';
import { TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { useAuth } from 'src/context/AuthContext';

interface ErrorHash {
    electoralId?: string;
    password?: string;
}

const isValidElectoralId = (str: string) => {
    const tmp = /^[A-Z0-9]+$/;
    return tmp.test(str);
}

export function Login({ navigation }: any) {
    // ==== FIELDS ====
    const [electoralId, setElectoralId] = useState<string>("") // ABC123
    const [password, setPassword] = useState<string>(""); // ABC123
    // ==== END FIELDS ====
    const { onLogin, onRegister } = useAuth();

    const [error, setError] = useState("");

    const formValidation = () => {
        let error: string = "";

        if (electoralId.trim().length === 0 || !isValidElectoralId(electoralId) || password.trim().length === 0) {
            error = "Something went wrong.";
        }

        setError(error);

        return error.length === 0;
    }

    const resetValues = () => {
        setElectoralId("");
        setPassword("");
        setError("");
    }

    const handleSubmit = async () => {
        // console.log("Clicked ...");
        if (formValidation()) {
            // console.log("Submitted ", electoralId, password);

            // resetValues()
            setIsLoading(true);

            const result = await onLogin!(electoralId, password);
            if (result && result.error) {
                alert(result.msg);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            } else {
                setIsLoading(false);
                navigation.navigate('Menu');
            }
        } else {
            setTimeout(() => {
                setError("");
                setIsLoading(false);
            }, 2000);
        }
    }

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }, []);


    const onPressRegistration = () => {
        onLogOut!();
        navigation.navigate('Registration');
    }

    // PRE-EXECUTION STEPS:
    const { authState, onLogOut, isLoggedIn } = useAuth();

    useEffect(() => {
        isLoggedIn!();
        if (!authState?.authenticated) {
            onLogOut!();
        } else {
            navigation.navigate("Menu");
        }
    }, [])

    return (
        <View>
            <View style={styles.container}>
                <ImageBackground source={background} style={styles.image} />
                <View style={styles.imgView}>
                    <Image source={logoImg} style={styles.imgLogo} />
                </View>

                <Text style={styles.welcomeText}> Welcome to Ango-vote </Text>
                <Text style={styles.sloganMessage}>Let's make a fair and transparent election. Decide “who” you wish to vote for.</Text>

                <View style={styles.containerLevel3}>
                    <TextInput style={styles.inputText} placeholder='Identifier' value={electoralId}
                        onChangeText={text => {
                            setElectoralId(text);
                        }} />
                    <TextInput style={styles.inputText} placeholder='Password' secureTextEntry={true}
                        value={password}
                        onChangeText={text => {
                            setPassword(text);
                        }}
                    />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <View style={styles.buttonView}>

                            <TouchableOpacity style={styles.button1} onPress={handleSubmit}>
                                <Text style={styles.textLogin}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button2} onPress={onPressRegistration}>
                                <Text style={styles.textRegistration}>Registration</Text>
                            </TouchableOpacity>
                        </View>

                </View>

                <Text style={styles.technicalText}>Notifications about when and where to vote will be displayed on the app.</Text>
                <Text style={styles.technicalText}>No requests for money. NO SPAM!</Text>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, height: 'auto' }}>
                    {isLoading ? <ActivityIndicator size="small" color="#969696" /> : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: 'transparent',
        gap: 5,
        marginTop: 40,
        height: '100%',
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 1,
    },
    inputText: {
        width: '80%',
        borderRadius: 7,
        color: '#666666',
        fontSize: 15,
        borderColor: theme.COLORS.GRAY_BORDER_INPUT_TEXT,
        paddingLeft: 15,
        borderWidth: 0.4,
        height: 60
    },
    buttonContainer: {
        height: 50,
        marginVertical: 5,
        borderWidth: 1,
    },
    imgView: {
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        marginTop: -100
    },
    imgLogo: {
        width: 115,
        height: 180,
        resizeMode: 'contain',
    },
    content: {
        fontSize: 22
    },
    angoVote: {
        color: '#323232',
        fontSize: 40,
        alignSelf: 'center'
    },
    welcomeText: {
        color: '#323232',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: '700'
    },
    sloganMessage: {
        color: '#323232',
        fontSize: 14,
        alignSelf: 'center',
        width: '90%',
        textAlign: 'center'
    },
    technicalText: {
        color: '#323232',
        fontSize: 14,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    },
    containerLevel3: {
        width: '100%',
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        alignContent: 'space-between',
        gap: 10,
    }, textCode: {
        color: '#191919',
        fontSize: 20,
        textAlign: 'center', // Center the text horizontally
        textAlignVertical: 'center',
        fontWeight: '500'
    }, button1: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#FF6C6C',
        borderColor: '#e08f8f',
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 55,
        shadowColor: 'black',
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.12
    }, button2: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#666262',
        borderColor: 'transparent',
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 55,
        shadowColor: 'black',
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.1
    }, buttonView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '80%',
        gap: 9,
        paddingBottom: 10,
        paddingTop: 5
    }, textLogin: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center', // Center the text horizontally
        textAlignVertical: 'center',
        fontWeight: '700'
    }, textRegistration: {
        color: '#E1E1E6',
        fontSize: 20,
        textAlign: 'center', // Center the text horizontally
        textAlignVertical: 'center',
        fontWeight: '500'
    }, errorText: {
        color: 'red',
    }
})