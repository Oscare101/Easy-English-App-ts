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
import { useEffect, useState } from 'react'
import { GetTheme, GetThemeOpposite } from './functions/Functions'
import * as NavigationBar from 'expo-navigation-bar'
import { useDispatch } from 'react-redux'
import { setThemeColor } from './redux/themeColor'
import TechnicalPauseScreen from './screens/login/TechnicalPauseScreen'
import { getDatabase, onValue, ref } from 'firebase/database'
import { setTechnicalPause } from './redux/technicalPause'
import { compareVersions } from 'compare-versions'
import app from './app.json'
import ForceUpdateScreen from './screens/login/ForceUpdateScreen'
import { setTheme } from './redux/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const toastConfig = {
    ToastMessage: ({ props }: any) => (
      <View
        style={{
          width: rules.componentWidthPercent,
          backgroundColor: colors.RealBlack,
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
          borderRadius: 4,
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
    const { themeColor } = useSelector((state: RootState) => state.themeColor)
    const dispatch = useDispatch()
    const systemTheme = useColorScheme()
    const { theme } = useSelector((state: RootState) => state.theme)
    const { technicalPause } = useSelector(
      (state: RootState) => state.technicalPause
    )
    const [update, setUpdate] = useState<boolean>(false)

    async function GetTechnicalPauseStatus() {
      const data = ref(getDatabase(), `info/`)
      onValue(data, (snapshot) => {
        dispatch(setTechnicalPause(snapshot.val().technicalPause))
        if (compareVersions(snapshot.val().version, app.expo.version) === 1) {
          setUpdate(true)
        } else {
          setUpdate(false)
        }
      })
    }

    async function GetThemeFunc() {
      const theme = await AsyncStorage.getItem('theme')
      if (theme) {
        dispatch(setTheme(theme))
      }
    }

    useEffect(() => {
      GetThemeFunc()
      GetTechnicalPauseStatus()

      dispatch(setThemeColor(GetTheme(systemTheme, theme)))
      NavigationBar.setBackgroundColorAsync(
        GetTheme(systemTheme, theme) === 'dark' ? colors.DarkBG : colors.LightBG
      )
      NavigationBar.setButtonStyleAsync(GetThemeOpposite(systemTheme, theme))
    }, [systemTheme, theme])
    if (technicalPause) {
      return <TechnicalPauseScreen />
    } else if (update) {
      return <ForceUpdateScreen />
    }
    return (
      <NavigationContainer
        theme={themeColor === 'dark' ? DarkTheme : DefaultTheme}
      >
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
      </NavigationContainer>
    )
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppComponent />
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </Provider>
  )
}
