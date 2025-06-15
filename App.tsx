import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import AppNavigator from './src/navigation/AppNavigator';
import FormReservasiScreen from './src/screens/FormReservasiScreen';
import RequestScreen from './src/screens/RequestScreen';

import notifee from '@notifee/react-native';
import { setupNotificationChannel } from './src/services/notificationService'; 

export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  FormReservasiScreen: { selectedRoom: string; selectedDate: Date };
  RequestScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Login');

  useEffect(() => {
    const initApp = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) setInitialRoute('MainApp');

      await notifee.requestPermission(); 
      await setupNotificationChannel(); 
    };

    initApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={AppNavigator} />
        <Stack.Screen name="FormReservasiScreen" component={FormReservasiScreen} />
        <Stack.Screen name="RequestScreen" component={RequestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
