import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { News } from '@screens/News';
import { Candidates } from '@screens/Candidates';
import { useAuth } from 'src/context/AuthContext';
import { Credentials } from '@screens/Credentials';
import { loadImages } from 'src/service/firebase';

const Tab = createMaterialBottomTabNavigator();

export declare type Theme_ = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    secondaryContainer: string
  };
};

const theme_: Theme_ = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: 'red',
    background: 'transparent',
    card: '',
    text: '',
    border: '',
    notification: '',
    secondaryContainer: 'rgba(40, 40, 40, 0.4)'
  },
};

export function BottomNavigation({ navigation }: any) {
  const { authState, onLogOut, isLoggedIn } = useAuth();
  const [activeScreen, setActiveScreen] = useState("Login");
  const { imageList, setImageList } = useAuth();

  useEffect(() => {
    isLoggedIn!();
    if (!authState?.authenticated) {
      setActiveScreen("Login");
    }

    loadImages(setImageList);
  }, []);

  return (
    <PaperProvider>
      <Tab.Navigator
        initialRouteName="News"
        activeColor="#c2c2c2"
        inactiveColor="#4e4e4e"
        barStyle={{ backgroundColor: '#010101' }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let size = 23;

            if (route.name === "News") {
              return <Icon name="newspaper-variant-outline" size={size} color={color} />;
            } else if (route.name === "Candidates") {
              return <Icon name="account-group" size={size} color={color} />;
            } else if (route.name === "Data") {
              return <Icon name="database" size={size} color={color} />;
            } if (route.name === "Registration") {
              return <Icon name="database" size={size} color={color} />;
            }

            return <Icon name="login" size={size} color={color} />;
          },
          tabBarInactiveTintColor: '#3d3333',
          tabBarColor: '#0a6100',
          tabBarStyle: {
            background: '#c70b0b',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="News" component={News} />
        <Tab.Screen name="Candidates" component={Candidates} />
        <Tab.Screen name="Data" component={Credentials} />

      </Tab.Navigator>
    </PaperProvider>
  );
}
