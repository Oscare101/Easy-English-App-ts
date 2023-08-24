import React, { useEffect } from 'react'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import LaunchScreen from '../screens/login/LaunchScreen'
import LoginScreen from '../screens/login/LoginScreen'
import RegistrationScreen from '../screens/login/RegistrationScreen'
import ProfileScreen from '../screens/application/profile/ProfileScreen'
import NewUserScreen from '../screens/login/NewUserScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TouchableOpacity, View, useColorScheme } from 'react-native'
import CoursesScreen from '../screens/application/courses/CoursesScreen'
import { Ionicons } from '@expo/vector-icons'
import colors from '../constants/colors'
import rules from '../constants/rules'
import ProfileSettings from '../screens/application/profile/ProfileSettings'
import CoursePage from '../screens/application/courses/CoursePage'
import PersonalInfoSettings from '../screens/application/profile/PersonalInfoSettings'
import NewPostScreen from '../screens/application/profile/NewPostScreen'
import FriendsScreen from '../screens/application/friends/FriendsScreen'
import ChatsScreen from '../screens/application/chat/ChatsScreen'
import GlobalChatScreen from '../screens/application/chat/GlobalChatScreen'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import PDFScreen from '../screens/application/pdf/PDFScreen'
import TestPage from '../screens/application/courses/TestPage'
import ForceUpdateScreen from '../screens/login/ForceUpdateScreen'
import PostsScreen from '../screens/application/post/PostsScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export default function MainNavigation() {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  function TabBar({ state, navigation }: any) {
    const bottomTabData = [
      {
        title: '',
        iconActive: 'person-circle-sharp',
        iconInactive: 'person-circle-outline',
        action: () => {
          navigation.navigate('ProfileNavigation', {
            screen: 'ProfileScreen',
            initial: false,
          })
        },
      },
      {
        title: '',
        iconActive: 'book',
        iconInactive: 'book-outline',
        action: () => {
          navigation.navigate('CoursesNavigation', {
            screen: 'CoursesScreen',
            initial: false,
          })
        },
      },
      {
        title: '',
        iconActive: 'ios-chatbubble-ellipses-sharp',
        iconInactive: 'ios-chatbubble-ellipses-outline',
        action: () => {
          navigation.navigate('ChatNavigation', {
            screen: 'ChatsScreen',
            initial: false,
          })
        },
      },
      {
        title: '',
        iconActive: 'grid',
        iconInactive: 'grid-outline',
        action: () => {
          navigation.navigate('PostNavigation', {
            screen: 'PostsScreen',
            initial: false,
          })
        },
      },
    ]

    return (
      <View
        style={{
          flexDirection: 'row',
          height: rules.bottomTabHeight,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            themeColor === 'dark'
              ? colors.DarkBGComponent
              : colors.LightBGComponent,
          elevation: 5,
          borderTopWidth: 1,
          borderColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
        }}
      >
        {bottomTabData.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              item.action()
            }}
            activeOpacity={0.8}
            style={{
              width: '25%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 10,
              height: '100%',
            }}
          >
            {state.index === index ? (
              <Ionicons
                name={item.iconActive}
                size={24}
                color={
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                }
              />
            ) : (
              <Ionicons
                name={item.iconInactive}
                size={24}
                color={
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                }
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  function ProfileNavigation() {
    return (
      <Stack.Navigator>
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

  function CoursesNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="CoursesScreen"
          component={CoursesScreen}
        />
      </Stack.Navigator>
    )
  }

  function ChatNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ChastScreen"
          component={ChatsScreen}
        />
      </Stack.Navigator>
    )
  }

  function PostNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="PostsScreen"
          component={PostsScreen}
        />
      </Stack.Navigator>
    )
  }

  function NavigationApp() {
    return (
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          name="ProfileNavigation"
          component={ProfileNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="CoursesNavigation"
          component={CoursesNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="ChatNavigation"
          component={ChatNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="PostNavigation"
          component={PostNavigation}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
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
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
        name="ForceUpdateScreen"
        component={ForceUpdateScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
        name="NavigationApp"
        component={NavigationApp}
      />
      {/* other screens then must apear without bottom tab navigation */}
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'vertical',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
        name="ProfileSettings"
        component={ProfileSettings}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="CoursePage"
        component={CoursePage}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="TestPage"
        component={TestPage}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="PersonalInfoSettings"
        component={PersonalInfoSettings}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'vertical',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
        name="NewPostScreen"
        component={NewPostScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="GlobalChatScreen"
        component={GlobalChatScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="PDFScreen"
        component={PDFScreen}
      />
    </Stack.Navigator>
  )

  return <>{navigationLogIn}</>
}
