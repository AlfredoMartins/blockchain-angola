import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import profileImg from '@assets/alfredo_party_50.png';
import { CandidateItem } from '@components/CandidateItem';
import { useAuth } from 'src/context/AuthContext';

import axios from 'src/api/axios';

export function CandidatesList({ navigation }: any) {
  const [candidates, setCandidates] = useState([]);

  const [xTexts, setXtexts] = useState<string[]>([]);
  const [selected, setSelected] = useState(-1);

  const { imageList, setImageList } = useAuth();

  const onPressLoadCandidates = () => {
    axios.get('/blockchain/candidates')
      .then(response => {
        const candidates = response.data.candidates;
        if (candidates) {
          const newData = candidates.map((element: any, index: number) => {
            const candidatePhotoName = element.name.toLowerCase().split(' ').join('.');
            const partyPhotoName = element.party.toLowerCase().split(' ').join('.');

            return ({
              id: index + 1,
              code: element.code,
              name: element.name,
              party: element.party,
              acronym: element.acronym,
              photo: imageList[candidatePhotoName] ?? 'default',
              src: imageList[partyPhotoName],
              status: element.status
            })
          });

          setCandidates(newData);
        }
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    onPressLoadCandidates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textCandidates}>Candidates</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={candidates}
          renderItem={({ item, index }) => <CandidateItem id={item.id} name={item.name} party={item.party} acronym={item.acronym} photo={item.photo} src={item.src}
            selected={selected} setSelected={setSelected}
            xTexts={xTexts} setXtexts={setXtexts}
            isFactor={false}
            key={index}
            navigation={navigation}
          />}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: 'auto',
    gap: 10,
    marginTop: 10
  }, textCandidates: {
    fontSize: 18,
    fontWeight: '600'
  }, listContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'flex-start'
  }, scrollViewContainer: {
    flex: 1,
    backgroundColor: '#a1195d',
    marginVertical: 0,
    paddingVertical: 0
  }
});