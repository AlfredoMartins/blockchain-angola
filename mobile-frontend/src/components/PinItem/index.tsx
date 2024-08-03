
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ItemPropsNumber = { number: string, key: string, token: string, setToken: any, numCodes: any, setNumCodes: any, setIsRefresh: any };

export function PinItem(prop: ItemPropsNumber) {
  const updatePIN = (len: number) => {
    prop.setNumCodes((prev: any) => {
      const newState = prev;
      for (let i = 0; i < 6; i++) {
        newState[i] = (i < len ? i : i + 11).toString();
      }
      return [...newState];
    });
  };

  const onPressDel = () => {
    const len = prop.token.length;
    if (len == 0) return;
    let oldToken = prop.token.substring(0, len - 1);
    prop.setToken(oldToken);
    updatePIN(len - 1);
  };

  const onPressDig = () => {
    const len = prop.token.length;
    if (len >= 6) return;
    prop.setToken(prop.token + prop.number);
    updatePIN(len + 1);
  };

  if (prop.number === 'del') {
    return (
      <TouchableOpacity style={styles.button} onPress={onPressDel}>
        <View style={styles.container}>
          <Text style={styles.textCode}>
            <Icon name="backspace-outline" size={25} color='#191919' /></Text>
        </View>
      </TouchableOpacity>
    );
  } else
    return (
      <TouchableOpacity style={styles.button} onPress={onPressDig}>
        <View style={styles.container}>
          <Text style={styles.textCode}>{prop.number}</Text>
        </View>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 5,
  },
  textCode: {
    color: '#191919',
    fontSize: 25,
    textAlign: 'center', // Center the text horizontally
    textAlignVertical: 'center',
    fontWeight: '500'
  }, button: {
    backgroundColor: '#FFFFFF',
    width: 40,
    borderRadius: 10,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 3,
  }
});