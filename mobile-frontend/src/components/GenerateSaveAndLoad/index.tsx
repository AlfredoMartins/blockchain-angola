import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import theme from 'src/theme';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';

type ItemProps = { title: string, timestamp: string, people: string, src: string, key: string };

interface ErrorHash {
    secret?: string,
    publicKey?: string,
    committeePublicKey?: string
}

export function GenerateSaveAndLoad({ secret, setSecret, eyeOn }: any) {
    // ==== FIELDS ====
    const [committeePublicKey, setcommitteePublicKey] = useState<string>("pfjufh34o43nfkktj");
    const [directorySave, setDirectorySave] = useState<string>("c:/blockchain/certificate.cert");
    // ==== END FIELDS ====

    const [errors, setErrors] = useState<ErrorHash>({});

    const readFile = async (uri: string) => {
        console.log("URL: ", uri);

        try {
            const content = await FileSystem.readAsStringAsync(uri);
            console.log('File content:', content);
            setSecret(content);
            setDirectorySave(uri);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };

    const resetValues = () => {
        setSecret("");
        setDirectorySave("");
        setErrors({});
    }

    const onPress = () => {
        // navigation.navigate('News');
    }

    const [pickedDocument, setPickedDocument] = useState(null);

    const onPressFindAndLoadCertificate = async () => {
        try {
            const document: any = await DocumentPicker.getDocumentAsync();

            console.log("Doc details: ", document);
            if (document) {
                console.log("Assets details: ", document);
                console.log("URI: ", document.assets[0].uri);
                const uri = document.assets[0].uri;
                setPickedDocument(document);
                readFile(uri);
            } else {
                setPickedDocument(null);
            }
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    const onPressLoadCertificate = async () => {
        try {
            const fileUri = `${FileSystem.documentDirectory}/certificate.cert`;
            readFile(fileUri);
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.containerLevel}>
                <TouchableOpacity style={styles.buttonTyle} onPress={onPressLoadCertificate}>
                    <Text style={styles.textButton}>Load Certificate</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonTyle} onPress={onPressFindAndLoadCertificate}>
                    <Text style={styles.textButton}>Find and load certificate</Text>
                </TouchableOpacity>
            </View>

            <View style={{ gap: 5, paddingTop: 5 }}>
                <Text style={styles.textTitleInput}>Secret</Text>
                <TextInput style={styles.textInput} placeholder='Ex.: 12345AVSDSDSER'
                    onChangeText={text => {
                        setSecret(text.trim());
                    }}
                    value={secret} secureTextEntry={!eyeOn}
                />
                {errors.secret ? <Text style={styles.errorText}>{errors.secret}</Text> : null}

                <Text style={styles.textTitleInput}>Certificate's directory</Text>
                <Text style={styles.textCertificate} // Adjust style to visually indicate it's disabled
                >{eyeOn ? directorySave : "*".repeat(directorySave.length)}</Text>

            </View>

            <View style={{ gap: 5, paddingTop: 20 }}>
                <Text style={styles.textTitleInput}>Transaction Hash</Text>
                <TextInput style={styles.textInput} placeholder='Ex.: '
                    onChangeText={text => {
                        setcommitteePublicKey(text.trim());
                    }}
                    value={committeePublicKey} secureTextEntry={!eyeOn}
                />
                {errors.committeePublicKey ? <Text style={styles.errorText}>{errors.committeePublicKey}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: 'auto',
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
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        gap: 5
    }, buttonTyle: {
        flex: 1,
        width: 'auto',
        alignItems: 'center',
        backgroundColor: '#202020',
        borderColor: '#171717',
        padding: 4,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 55,
        shadowColor: 'black',
        shadowOffset: {
            width: 6,
            height: 6
        }
    }, textButton: {
        color: '#ffffff',
        fontSize: 14,
        textAlign: 'center', // Center the text horizontally
        textAlignVertical: 'center',
        fontWeight: '700'
    },
    textTitleInput: {
        color: '#969696',
        fontWeight: '500'
    }, textInput: {
        width: '100%',
        borderRadius: 7,
        color: '#666666',
        fontSize: 15,
        borderColor: theme.COLORS.GRAY_BORDER_INPUT_TEXT,
        paddingLeft: 15,
        borderWidth: 0.7,
        height: 40
    }, errorText: {
        color: 'red',
        marginBottom: 10,
    }, textCertificate: {

    }
});