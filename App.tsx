import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import CheckInScreen from './screens/CheckInScreen';
import InsightsScreen from './screens/InsightsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: '400',
            },
            tabBarActiveTintColor: '#4a90e2',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#e5e5e5',
            },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen 
            name="CheckIn" 
            component={CheckInScreen}
            options={{
              tabBarLabel: 'Check-In',
            }}
          />
          <Tab.Screen 
            name="Insights" 
            component={InsightsScreen}
            options={{
              tabBarLabel: 'Insights',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
