import React, { useState, useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
// import Entypo from '@expo/vector-icons/Entypo';
import * as Font from 'expo-font';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  SpaceMono_400Regular,
  SpaceMono_400Regular_Italic,
  SpaceMono_700Bold,
  SpaceMono_700Bold_Italic,
} from '@expo-google-fonts/space-mono';

// SplashScreen.preventAutoHideAsync();

type CountDownProps = {
  remainingTime: number,
}

const Countdown = ({ remainingTime }: CountDownProps) => {
  const [sec, setSec] = useState<number>(remainingTime); // Initial time in seconds
  let [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_400Regular_Italic,
    SpaceMono_700Bold,
    SpaceMono_700Bold_Italic,
  });

  const [componentIsReady, setComponentIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setComponentIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSec(prevSec => {
        if (prevSec === 0) {
          clearInterval(timer);
          return prevSec;
        } else {
          return prevSec - 1;
        }
      });
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Run effect only once on component mount

  const days: number = parseInt(Math.floor(sec / (3600 * 24)));
  const hours: number = parseInt(Math.floor((sec % (3600 * 24)) / 3600));
  const minutes: number = parseInt(Math.floor((sec % 3600) / 60));
  const seconds: number = parseInt(sec % 60);

  const dec = (x: number) => x < 10 ? '0' + x : x;

  let fontSize = 28;

  const style = {
    flex: 1,
    fontSize,
    fontFamily: fontsLoaded ? 'SpaceMono_400Regular' : '',
    fontWeight: '600',
    justifyContent: 'center',
    textAlign: 'center',
  }

  if (!componentIsReady) {
    return null;
  }

  return (
    <View>
      <Text style={style}>{dec(days)}:{dec(hours)}:{dec(minutes)}:{dec(seconds)}</Text>
    </View>
  );
};

export default Countdown;
