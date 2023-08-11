import React, { useState } from 'react'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import LaunchScreen from '../screens/login/LaunchScreen'
import LoginScreen from '../screens/login/LoginScreen'
import RegistrationScreen from '../screens/login/RegistrationScreen'
import ProfileScreen from '../screens/application/ProfileScreen'
import NewUserScreen from '../screens/login/NewUserScreen'

const Stack = createStackNavigator()

export default function MainNavigation() {
  function NavigationApp() {
    return (
      <Stack.Navigator initialRouteName="ProfileScreen">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ProfileScreen"
          component={ProfileScreen}
        />
      </Stack.Navigator>
    )
  }

  const navigationLogIn = (
    <Stack.Navigator initialRouteName="LaunchScreen">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="LaunchScreen"
        component={LaunchScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="RegistrationScreen"
        component={RegistrationScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="NewUserScreen"
        component={NewUserScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
        name="NavigationApp"
        component={NavigationApp}
      />
    </Stack.Navigator>
  )

  return <>{navigationLogIn}</>
}
