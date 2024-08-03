import { Header } from '@components/Header';
import { TextT, Video } from 'phosphor-react-native';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TextInput, TouchableOpacity, Platform } from 'react-native';
import * as Progress from 'react-native-progress';
import { NewsItem } from '@components/NewsItem';
import { ProgressHeader } from '@components/ProgressHeader';
import theme from 'src/theme';
import { useEffect, useState } from 'react';
import { CaretLeft } from 'phosphor-react-native';
import { StatusBar } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

type ItemProps = { title: string, timestamp: string, people: string, src: string, key: string };

interface HashMap<T> {
  [key: string]: T;
}

interface ErrorHash {
  electoralId?: string;
  name?: string,
  email?: string;
  address?: string;
  province?: string;
  password?: string;
  confirmPassword?: string;
}

const isValidElectoralId = (str: string) => {
  const tmp = /^[A-Z0-9]+$/;
  return tmp.test(str);
}

const isValidEmail = (str: string) => {
  const tmp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return tmp.test(str);
}

const areEqualPasses = (str1: string, str2: string) => {
  str1 = str1.trim();
  str2 = str2.trim();
  // console.log(str1, ' ', str2);
  return str1.localeCompare(str2) === 0;
}

const isValidProvince = (str: string) => {
  const provinces = [
    "Bengo",
    "Benguela",
    "Bié",
    "Cabinda",
    "Cuando Cubango",
    "Cuanza Norte",
    "Cuanza Sul",
    "Cunene",
    "Huambo",
    "Huíla",
    "Luanda",
    "Lunda Norte",
    "Lunda Sul",
    "Malanje",
    "Moxico",
    "Namibe",
    "Uíge",
    "Zaire"
  ];

  // console.log(str in provinces);

  return provinces.find(x => x === str);
}

export function Registration({ navigation }: any) {
  // ==== FIELDS ====
  const [electoralId, setElectoralId] = useState<string>(""); // ABC123
  const [name, setName] = useState<string>(""); // Alfredo Martins
  const [email, setEmail] = useState<string>(""); // heiopo@inf.elte.hu
  const [address, setAddress] = useState<string>(""); // Luanda, 1332
  const [province, setProvince] = useState<string>(""); // Luanda
  const [password, setPassword] = useState<string>(""); // ABC123
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // ABC123
  // ==== END FIELDS ====

  // ==== SET DEFAULT VALUES ====
  // ==== END VALUES ====

  const onPressBack = () => {
    navigation.navigate('Login');
  }

  const [errors, setErrors] = useState<ErrorHash>({});

  const formValidation = () => {
    let errorHash: ErrorHash = {};

    if (!electoralId) errorHash.electoralId = "Electoral ID required.";
    if (!isValidElectoralId(electoralId)) errorHash.electoralId = "Invalid electoral ID.";
    if (!name) errorHash.name = "Name required.";
    if (!email) errorHash.email = "E-mail required.";
    if (!isValidEmail(email)) errorHash.email = "Invalid e-mail.";
    if (!address) errorHash.address = "Address required.";
    if (!province) errorHash.province = "Province required.";
    if (!isValidProvince(province)) errorHash.province = "Invalid province.";

    if (password.trim().length == 0 || confirmPassword.trim().length == 0) {
      if (!password) errorHash.password = "Password required.";
      if (!confirmPassword) errorHash.confirmPassword = "Password confirmation required.";
    } else if (!areEqualPasses(password, confirmPassword)) {
      errorHash.password = "Mismatch: Passwords do not match!";
      errorHash.confirmPassword = errorHash.password;
    }

    setErrors(errorHash);
    return Object.keys(errorHash).length === 0;
  }


  const handleSubmit = () => {
    if (formValidation()) {
      console.log("Submitted ", electoralId, email, address, province, password, confirmPassword);

      setIsLoading(true);

      const body = JSON.stringify({
        electoralId: electoralId,
        name: name,
        email: email,
        address: address,
        province: province,
        password: password,
      });

      const URL = 'http://192.168.0.38:3010/api/committee/register-voter';
      const method = 'POST';

      fetch(URL, {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: body,
      },).then(response => {
        setIsLoading(false);
        navigation.navigate('Login');
      }).catch(error => {
        console.log(error);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
    }
  }

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onPressBack}>
          <CaretLeft size={32} />
        </TouchableOpacity>
        <ProgressHeader number='2' key='1' />
      </View>
      <View style={{ gap: 4, marginTop: 25, marginLeft: 10, marginRight: 10, flex: 1, backgroundColor: 'transparent' }}>
        <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: '600', paddingTop: 10 }}>Registration Information</Text>
        <Text>Confirm and/or enter your personal details to register.</Text>

        <View style={{ gap: 5, paddingTop: 10 }}>
          <Text style={styles.textTitleInput}>Electoral ID</Text>
          <TextInput style={styles.textInput} placeholder='Ex.: 12345AVSDSDSER'
            onChangeText={text => {
              setElectoralId(text.trim());
            }}
            value={electoralId}
          />
          {errors.electoralId ? <Text style={styles.errorText}>{errors.electoralId}</Text> : null}

          <Text style={styles.textTitleInput}>Name</Text>
          <TextInput style={styles.textInput} placeholder='Ex.: Alfredo Martins'
            onChangeText={text => {
              setName(text);
            }}
            value={name}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={styles.textTitleInput}>E-mail</Text>
          <TextInput style={styles.textInput} placeholder='Ex.: alfredo.martins@hotmail.com'
            onChangeText={text => {
              setEmail(text);
            }}
            value={email}
          />

          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.textTitleInput}>Address</Text>
          <TextInput style={styles.textInput} placeholder='Ex.: Maianga, Luanda, Angola'
            onChangeText={text => {
              setAddress(text);
            }}
            value={address}
          />

          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

          <Text style={styles.textTitleInput}>Province</Text>
          <TextInput style={styles.textInput} placeholder='Ex.: Luanda'
            onChangeText={text => {
              setProvince(text);
            }}
            value={province}
          />

          {errors.province ? <Text style={styles.errorText}>{errors.province}</Text> : null}


          <Text style={styles.textTitleInput}>Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Ex.: xxxxxxxxxx'
            onChangeText={text => {
              setPassword(text);
            }}
            value={password}
            secureTextEntry={true}
            autoComplete="off"
            textContentType="none"
          />


          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Text style={styles.textTitleInput}>Confirm password</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Ex.: xxxxxxxxxx'
            onChangeText={text => {
              setConfirmPassword(text);
            }}
            value={confirmPassword}
            secureTextEntry={true}
            autoComplete="off"
            textContentType="none"
          />


          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

        </View>

        <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', marginTop: 5 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5, height: '100%' }}>
            {isLoading ? <ActivityIndicator size="small" color="#969696" /> : null}
          </View>
        </View>

        <View style={styles.containerLevel}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.textConfirm}>Submit</Text>
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
    height: 40
  }, containerLevel: {
    width: '100%',
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
    position: 'absolute',
    bottom: 0,
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
    gap: 2,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 45,
    height: 20
  }, errorText: {
    color: 'red',
    marginBottom: 10,
  }
});