import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Text, View, StatusBar, useColorScheme } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { useSelector } from 'react-redux'
import { RootState } from './redux'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import colors from './constants/colors'
import rules from './constants/rules'
import MainNavigation from './navigation/MainNavigation'
import { useEffect } from 'react'
import { GetTheme, GetThemeOpposite } from './functions/Functions'
import * as NavigationBar from 'expo-navigation-bar'
import { useDispatch } from 'react-redux'
import { setThemeColor } from './redux/themeColor'

export default function App() {
  const toastConfig = {
    successToast: ({ props }: any) => (
      <View
        style={{
          width: rules.componentWidthPercent,
          backgroundColor: colors.Black,
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.White,
            textAlign: 'left',
          }}
        >
          {props.title}
        </Text>
      </View>
    ),
  }

  function AppComponent() {
    const dispatch = useDispatch()
    const systemTheme = useColorScheme()
    const { theme } = useSelector((state: RootState) => state.theme)
    useEffect(() => {
      NavigationBar.setBackgroundColorAsync(
        GetTheme(systemTheme, theme) === 'dark' ? colors.DarkBG : colors.LightBG
      )
      NavigationBar.setButtonStyleAsync(GetThemeOpposite(systemTheme, theme))
      dispatch(setThemeColor(GetTheme(systemTheme, theme)))
    }, [systemTheme, theme])
    return (
      <>
        <StatusBar
          barStyle={
            GetTheme(systemTheme, theme) === 'dark'
              ? 'light-content'
              : 'dark-content'
          }
          backgroundColor={
            GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkBG
              : colors.LightBG
          }
        />
        <MainNavigation />
      </>
    )
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={DefaultTheme}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.White} />
          <AppComponent />
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </Provider>
  )
}
