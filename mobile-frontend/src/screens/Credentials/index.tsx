import { EyeClosed, Eye } from 'phosphor-react-native';
import { StyleSheet, View, Text, Linking, TouchableOpacity, Platform } from 'react-native';
import theme from 'src/theme';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { GenerateSaveAndLoad } from '@components/GenerateSaveAndLoad';
import { useCameraPermissions } from 'expo-camera';
import * as DocumentPicker from 'expo-document-picker';

interface ErrorHash {
  electoralId?: string;
  name?: string,
  email?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
}

export function Credentials({ navigation }: any) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [secret, setSecret] = useState<string>("x34o43nfkktj");

  const onPressEyes = () => {
    setEyesOn(!eyeOn);
  }

  const onPressVerify = () => {
    navigation.navigate('CameraQR', 
    { secret });
  }

  const [eyeOn, setEyesOn] = useState<boolean>(false);
  const eyeSize = 45;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
          <TouchableOpacity onPress={onPressEyes}>
            {eyeOn ? <Eye size={eyeSize} /> : <EyeClosed size={eyeSize} />}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ gap: 4, marginTop: 5, marginLeft: 10, marginRight: 10, flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between' }}>
        <View>

          <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: '600' }}>Credentials</Text>
          <Text>Please generate a pair of keys If you did not yet, or load it. Thank you!</Text>

          <View style={{ gap: 5, paddingTop: 10 }}>
            <GenerateSaveAndLoad secret={secret} setSecret={setSecret} eyeOn={eyeOn}/>
          </View>
        </View>
        <View>

          <View style={styles.verifyContainer}>
            <TouchableOpacity style={styles.buttonStyleVerify} onPress={onPressVerify}>
              <Text style={styles.textButtonVerify}>Scan QR and Verify</Text>
            </TouchableOpacity>
          </View>
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
  }, textTitleInput: {
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
    height: 50
  }, containerLevel: {
    width: '100%',
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    flex: 1
  }, buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '90%',
    gap: 9,
    paddingBottom: 10,
    paddingTop: 5
  }, button: {
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#a9a9a9',
    borderColor: '#a8a8a8',
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
  }, textConfirm: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center', // Center the text horizontally
    textAlignVertical: 'center',
    fontWeight: '700'
  }, topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginRight: 10,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  }, errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonStyleVerify: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderColor: '#171717',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    elevation: 55,
    shadowColor: 'black',
    shadowOffset: {
      width: 6,
      height: 6
    }
  }, textButtonVerify: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center', // Center the text horizontally
    textAlignVertical: 'center',
    fontWeight: '700',
    justifyContent: 'center'
  }, verifyContainer: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
});