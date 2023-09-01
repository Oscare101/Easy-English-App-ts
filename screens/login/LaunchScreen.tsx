import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native'
import colors from '../../constants/colors'
import { styles } from '../../constants/styles'
import MainButton from '../../components/MainButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GetApplicationInfo, GetUser, LogIn } from '../../functions/Actions'
import { User } from '../../constants/interfaces'
import BGCircles from '../../components/BGCircles'
import { setAuthentication } from '../../redux/authentication'
import { useDispatch } from 'react-redux'
import * as LocalAuthentication from 'expo-local-authentication'
import { setTheme } from '../../redux/theme'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { compareVersions } from 'compare-versions'
import { getDatabase, onValue, ref } from 'firebase/database'
import app from '../../app.json'
import { setTechnicalPause } from '../../redux/technicalPause'

export default function LaunchScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const dispatch = useDispatch()
  const [loadingData, setLoadingData] = useState<boolean>(true)
  async function GetUserStorage() {
    const email = await AsyncStorage.getItem('email')
    const password = await AsyncStorage.getItem('password')
    const authentication = await AsyncStorage.getItem('authentication')
    const theme = await AsyncStorage.getItem('theme')
    if (theme) {
      dispatch(setTheme(theme))
    }

    const hasBiometric = await LocalAuthentication.hasHardwareAsync()
    if (authentication) {
      dispatch(setAuthentication(authentication))
    }

    if (
      authentication === 'biometric' &&
      email !== null &&
      password !== null &&
      hasBiometric
    ) {
      setLoadingData(false)

      const user = await LocalAuthentication.authenticateAsync()

      if (user.success) {
        setLoadingData(true)
        const responseLogin = await LogIn(email, password)
        const responseUser: any = await GetUser(email)
        if (!responseLogin.error) {
          if (responseUser && responseUser.name) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'NavigationApp' }],
            })
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'NewUserScreen' }],
            })
          }
        } else {
          setLoadingData(false)
        }
      }
    } else if (authentication === 'auto' && email && password) {
      const responseLogin = await LogIn(email, password)

      const responseUser: any = await GetUser(email)
      if (!responseLogin.error) {
        if (responseUser && responseUser.name) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'NavigationApp' }],
          })
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'NewUserScreen' }],
          })
        }
      } else {
        setLoadingData(false)
      }
    } else {
      setLoadingData(false)
    }
    setLoadingData(false)
  }

  useEffect(() => {
    GetUserStorage()
  }, [])

  return (
    <View style={styles.ViewCenter}>
      <StatusBar
        barStyle={themeColor === 'dark' ? 'dark-content' : 'light-content'}
        backgroundColor={
          themeColor === 'dark' ? colors.DarkTextBlue : colors.LightTextBlue
        }
      />
      <BGCircles type={2} />

      {loadingData ? (
        <View style={styles.ViewAbsolute}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <></>
      )}
      <View style={styles.ViewBetween}>
        <Text
          style={{
            fontSize: 40,
            letterSpacing: 1,
            fontWeight: '700',
            color: themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
          }}
        >
          Hello
        </Text>
        <View style={styles.center100}>
          <MainButton
            title="Login"
            action={() => {
              navigation.navigate('LoginScreen')
            }}
            style={{ opacity: loadingData ? 0 : 1 }}
          />
          <SecondaryButton
            title="Registration"
            action={() => {
              navigation.navigate('RegistrationScreen')
            }}
            style={{ marginTop: 16, opacity: loadingData ? 0 : 1 }}
          />
        </View>
        <View></View>
      </View>
    </View>
  )
}
