import { BottomNavigation } from "@components/BottomNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import { CandidateDetails } from "@screens/CandidateDetails";
import { Login } from "@screens/Login";
import { Registration } from "@screens/Registration";
import { ThankVote } from "@screens/ThankVote";
import { TwoFactor } from "@screens/TwoFactor";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { useAuth } from "src/context/AuthContext";
import { TransitionPresets } from '@react-navigation/stack';
import CameraQR from "@components/CameraQR";


const { Navigator, Screen } = createStackNavigator();

export function AppRoutes() {
    const { authState, onLogOut, isLoggedIn } = useAuth();
    const [activeScreen, setActiveScreen] = useState("Login");

    useEffect(() => {
        isLoggedIn!();
        if (!authState?.authenticated) {
            setActiveScreen("Login");
        } else {
            setActiveScreen("Menu");
        }
    }, []);

    return (
        <Navigator initialRouteName={activeScreen} screenOptions={{
            headerShown: false
        }}>
            <Screen
                name="Login"
                component={Login}
            />

            <Screen
                name="Menu"
                component={BottomNavigation}
                options={{
                    headerLeft: () => <Button onPress={onLogOut}>Logout</Button>,
                }}
            />

            <Screen
                name="Registration"
                component={Registration} />

            <Screen
                name="Thank Vote"
                component={ThankVote}

                options={{
                    title: "Thank Vote",
                    ...TransitionPresets.ScaleFromCenterAndroid,
                }}
            />

            <Screen
                name="TwoFactor"
                component={TwoFactor}
            />

            <Screen
                name="Candidate Details"
                component={CandidateDetails}
            />


            <Screen
                name="CameraQR"
                component={CameraQR}
            />
            
        </Navigator>
    )
}