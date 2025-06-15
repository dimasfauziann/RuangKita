import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import RequestScreen from '../screens/RequestScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const iconMap: Record<string, any> = {
  Home: require('../assets/images/home.png'),
  Requests: require('../assets/images/requests.png'),
  Profile: require('../assets/images/profile.png'),
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <Image
            source={iconMap[route.name]}
            style={{
              width: 24,
              height: 24,
              tintColor: focused ? '#007AFF' : '#8E8E93', 
            }}
            resizeMode="contain"
          />
        ),
        tabBarShowLabel: true,  
        headerShown: false,     
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Requests" component={RequestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
