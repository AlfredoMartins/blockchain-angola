import { Header } from '@components/Header';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { NewsItem } from '@components/NewsItem';
import { useAuth } from 'src/context/AuthContext';
import axios from 'src/api/axios';
import Video_election_commentary from 'src/assets/video/election_commentary.mp4';
import { Video, ResizeMode } from 'expo-av';
import ImageTalks from 'src/assets/news/talks.png';
import Polling from 'src/assets/news/polling.png';
import Results from 'src/assets/news/results.png';
import { ProgressBar, MD3Colors } from 'react-native-paper';


import { Audio } from 'expo-av';

type ItemProps = { title: string, timestamp: string, people: string, src: string, key: string };

export function News({ navigation }: any) {
  useEffect(() => {
    const call = async () => {

      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
      }
    }

    call();
  }, []);

  const [news, setNews] = useState([
    {
      title: 'Ongoing Electoral Process: Discussion Forum in Luanda Conducted by the National Electoral Commission (CNE)',
      timestamp: '2h ago',
      people: '13K',
      src: ImageTalks,
      key: '1'
    },
    {
      title: 'Examining the Outdated Practices in Polling Procedures and the Essential Role of Election Observers',
      timestamp: '1h ago',
      people: '12K',
      src: Polling,
      key: '2'
    },
    {
      title: 'The National Electoral Commission (CNE) Holds Ground: No Intention to Expedite Result Disclosure Deadline',
      timestamp: '2h ago',
      people: '13K',
      src: Results,
      key: '3'
    },
    {
      title: 'Ongoing Electoral Process: Discussion Forum in Luanda Conducted by the National Electoral Commission (CNE)',
      timestamp: '2h ago',
      people: '13K',
      src: ImageTalks,
      key: '4'
    },
    {
      title: 'Examining the Outdated Practices in Polling Procedures and the Essential Role of Election Observers',
      timestamp: '1h ago',
      people: '12K',
      src: Polling,
      key: '5'
    },
    {
      title: 'The National Electoral Commission (CNE) Holds Ground: No Intention to Expedite Result Disclosure Deadline',
      timestamp: '2h ago',
      people: '13K',
      src: Results,
      key: '6'
    },
  ]);

  const { authState } = useAuth();
  const [activeScreen, setActiveScreen] = useState("Login");
  const [percentage, setPercentage] = useState<number>();

  useEffect(() => {
    if (!authState?.authenticated) {
      setActiveScreen("Login");
    } else {
      onPressLoadResultsComputed()
    }

  }, []);


  const onPressLoadResultsComputed = () => {
    axios.get('/blockchain/get-results-computed')
      .then(response => {
        const results = response.data;

        if (results !== undefined) {

          const total_expected: number = parseInt(results.expectedTotalVotes);
          const total_received: number = parseInt(results.totalVotesReceived);
          let perc: number = (total_received * 100) / total_expected;
          perc = Number(perc.toFixed(2));

          setPercentage(perc);
        }
      })
      .catch(error => console.error(error));
  }

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header navigation={navigation} />
      </View>
      <View style={styles.containerVideo}>

        <Video
          ref={video}
          style={styles.video}
          source={Video_election_commentary}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          isMuted={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />

      </View>
      <View style={styles.electionBreakingContainer}>
        <View style={styles.containerElectionFeed}>
          <Text style={{ fontSize: 30 }}>Election Feed</Text>
          <Text>Last update: Sunday, February 18, 2024 (GMT+1)</Text>

          <ProgressBar progress={!percentage ? 0 : percentage / 100} color='grey' style={{height:25}}/>

          <Text style={{ fontSize: 14 }}>{!percentage ? 0 : percentage}% eligible Angolans have voted</Text>
        </View>
        <View style={styles.containerBreaking}>
          <Text style={{ fontSize: 30 }}>Breaking News</Text>

          <SafeAreaView>
            <FlatList
              data={news}
              renderItem={({ item }) => <NewsItem title={item.title} timestamp={item.timestamp} people={item.people} src={item.src} />}
              keyExtractor={item => item.key}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
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
    flexDirection: 'column',
    gap: 5
  },
  containerVideo: {
    marginTop: 10,
    margin: 10,
    backgroundColor: '#d8d8d8',
    width: '95%',
    borderRadius: 20,
    height: 130,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerContainer: {

  },
  progressBar: {
    width: '100%'
  },
  containerElectionFeed: {

  },
  electionBreakingContainer: {
    backgroundColor: 'transparent',
    width: '95%'
  },
  containerBreaking: {

  },
  title: {
    color: '#FFF',
    fontSize: 32,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    width: '100%',
    marginVertical: 8,
    marginHorizontal: 0,
    justifyContent: 'center',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }, video: {
    backgroundColor: '#d8d8d8',
    width: '100%',
    borderRadius: 10,
    height: '100%',
  }
});