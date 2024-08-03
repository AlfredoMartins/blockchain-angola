import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AngolaFita from '@assets/angola-flag-colored.png';

export function HeaderElection() {
  return (
    <View style={styles.container}>
      <Image source={AngolaFita} style={styles.image}/>
      <Text style={styles.textElection}>ELECTION 2027</Text>
      <Text style={styles.textDate}>May 20th</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    backgroundColor: '#868686',
    width: '100%',
    maxHeight: 120,
    minHeight: 120,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }, image: {
    flex: 1,
    resizeMode: 'cover',
    width: '120%',
    height: '130%',
    position: 'absolute'
  },
  textElection: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
    height: '80%',
    paddingTop: 5
  }, textDate: {
    color: 'white',
    fontWeight: '700',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  }
});