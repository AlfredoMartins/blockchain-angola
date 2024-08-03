import { CaretLeft, CheckCircle, UsersFour, WarningCircle } from 'phosphor-react-native'
import logoImg from '@assets/flag.png';
import profileImg from '@assets/alfredo_party_75.png';
import fcBarca from '@assets/FC_Barcelona.png';
import theme from 'src/theme';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ItemPropsNumber = { number: number};

export function NumberItem({ number }: ItemPropsNumber) {
    
    const initValue = 9;

    if (number > initValue) {
        return (
          <View style={styles.container}>
              <Text style={styles.textCode} >
                  <Icon name="circle-outline" size={32} color='black' />
              </Text>
          </View>
      );
    } else 

    return (
        <View style={styles.container}>
            <Text style={styles.textCode}>
                <Icon name="checkbox-blank-circle" size={32} color='black' />
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#F6F6F6',
      width: 40,
      borderRadius: 5,
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      padding: 10
    },
    textCode: {
      color: '#7d0707',
      fontSize: 36,
      textAlign: 'center', // Center the text horizontally
      width: '100%',
      textAlignVertical: 'center',
    },
  });