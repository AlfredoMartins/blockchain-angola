import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import profileImg from '@assets/alfredo_party_50.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import Countdown from './CountDown';
import { useAuth } from 'src/context/AuthContext';
// import CountDown from 'react-native-countdown-component';

interface Announcement {
  startTimeVoting: Date,
  endTimeVoting: Date,
  dateResults: Date,
  numOfCandidates: number,
  numOfVoters: number,
  dateCreated?: Date
}

function getVotingClosure(date: Date | undefined): string {
  if (!date) {
    return 'Voting closure date is not provided';
  }

  if (date === undefined) {
    return "Voting closes 3 PM 3rd Nov, 2024";
  }

  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return `Voting closes ${date.toLocaleDateString('en-US', options)}`;
}

export function LiveProjection() {
  const [announcement, setAnnouncement] = useState<Announcement>({
    startTimeVoting: new Date('2022-01-19T23:00:00.000Z'),
    endTimeVoting: new Date('2027-03-03T23:00:00.000Z'),
    dateResults: new Date('2024-04-30T22:00:00.000Z'),
    dateCreated: new Date('2024-04-21T03:45:37.815Z'),
    numOfCandidates: 5,
    numOfVoters: 1006
  });

  const [sec, setSec] = useState<number>(5000);
  const [isReadyCountDown, setIsReadCountDown] = useState(false);
  const [data, setData] = useState();
  const { imageList } = useAuth();

  useEffect(() => {
    const x = async () => {
      await loadAnnouncement();
      await onPressLoadResultsComputed();
    }
    x()
  }, []);

  const loadAnnouncement = async () => {
    await axios.get('http://192.168.0.38:3010/api/committee/announcement')
      .then(response => {
        const res = response.data.announcement;
        if (res) {

          const data: Announcement = {
            startTimeVoting: new Date(res.startTimeVoting),
            endTimeVoting: new Date(res.endTimeVoting),
            dateResults: new Date(res.dateResults),
            dateCreated: new Date(res.dateCreated),
            numOfCandidates: parseInt(res.numOfCandidates),
            numOfVoters: parseInt(res.numOfVoters)
          };

          setAnnouncement(data);
          const x = (data.endTimeVoting.getTime() - data.startTimeVoting.getTime()) / 1000;
          setSec(x);
          setIsReadCountDown(true);
        }
      })
      .catch(error => console.error(error));
  }

  const onPressLoadResultsComputed = async () => {
    await axios.get('http://192.168.0.38:3010/api/blockchain/get-results-computed')
      .then(response => {
        const results = response.data;
        if (results) {
          let newDataCandidates = results.candidatesResult.map((x: any, index: any) => {
            const candidatePhotoName = x.candidate.name.toLowerCase().split(' ').join('.');

            return ({
              id: index + 1,
              party: x.candidate.party,
              name: x.candidate.name,
              acronym: x.candidate.acronym,
              percentage: x.percentage,
              src: imageList[candidatePhotoName],
            });
          });

          newDataCandidates = newDataCandidates.sort((a, b) => b.percentage - a.percentage).slice(0, 2);
          setData(newDataCandidates);
        }
      })
      .catch(error => console.error(error));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textLive}>Live Projection</Text>
      <View style={styles.containerCandidates}>

        <View style={styles.candidateLeft}>

          <Image
            source={data ? { uri: data[0].src } : null}
            width={40}
            style={{ borderRadius: 30 }}
          />

          <View style={styles.candidateLeftText}>
            <Text style={styles.textName}>{(data ? data[0].name : "Alfredo Martins")}</Text>
            <Text style={styles.textParty}>{(data ? data[0].acronym : "Party A")}</Text>
          </View>

        </View>
        <View style={styles.candidateRight}>
          <View style={styles.candidateRightText}>
            <Text style={styles.textName}>{(data ? data[1].name : "Alfredo Martins")}</Text>
            <Text style={styles.textParty}>{(data ? data[1].acronym : "Party B")}</Text>
          </View>

          <Image
            source={data ? { uri: data[1].src } : null}
            width={40}
            style={{ borderRadius: 30, alignContent: 'flex-start' }}
          />

        </View>
      </View>

      <View style={styles.progressParties}>
        <View style={styles.progresses}>
          <View style={styles.progresses1}>
            <Progress.Bar progress={(data ? data[0].percentage : 0.001 )} width={100} height={7} unfilledColor='#ffffff' color='#CAA448' borderRadius={0} style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} />
          </View>

          <View style={styles.progresses2}>
            <Progress.Bar progress={(data ? data[0].percentage : 0.007 )} width={100} height={7} unfilledColor='#ffffff'  color='#D62A2A' borderRadius={0} style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5,     transform: 'rotate(180deg)' }} />
          </View>
        </View>

        <View style={styles.timerContainer}>

          <Icon name="clock-outline" size={45} color='#1b1b1b' />
          {isReadyCountDown ? <Countdown remainingTime={sec} /> : null}

        </View>
        <Text style={styles.textClose}>{getVotingClosure(announcement?.endTimeVoting)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: '100%',
    maxHeight: 160,
    gap: 5
  }, textLive: {
    color: '#0f0f0f',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'transparent'
  }, containerCandidates: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  }, candidateLeft: {
    flex: 2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  }, candidateRight: {
    flex: 2,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  }, candidateLeftText: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
    gap: 3
  }, textName: {
    color: '#262626',
    fontSize: 14
  }, textParty: {
    color: '#262626',
    fontSize: 14
  }, candidateRightText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5,
    gap: 3,
    backgroundColor: 'transparent'
  }, progressParties: {

  },
  timerContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    gap: 2
  }, textTimer: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 25,
    fontWeight: '500',
    justifyContent: 'center',
    width: 50,
    textAlign: 'center',
  }, textClose: {
    paddingTop: 5,
    textAlign: 'center'
  }, progresses: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 5
  }, progresses1: {
    flex: 2,
    width: '100%',
    borderColor: '#fff',
    alignItems: 'flex-start',
  }, progresses2: {
    flex: 2,
    width: '100%',
    alignItems: 'flex-end',
    alignContent: 'flex-end'
  }
});