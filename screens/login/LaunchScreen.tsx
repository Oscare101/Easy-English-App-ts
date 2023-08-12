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
import { GetUser, LogIn } from '../../functions/Actions'
import { User } from '../../constants/interfaces'
import BGCircles from '../../components/BGCircles'

export default function LaunchScreen({ navigation }: any) {
  const [loadingData, setLoadingData] = useState<boolean>(true)

  async function GetUserStorage() {
    const email = await AsyncStorage.getItem('email')
    const password = await AsyncStorage.getItem('password')
    if (email && password) {
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
  }

  useEffect(() => {
    GetUserStorage()
  }, [])

  return (
    <View style={styles.ViewCenter}>
      <StatusBar barStyle="light-content" backgroundColor={colors.Main} />
      <BGCircles type={2} />

      {loadingData ? (
        <View style={styles.ViewAbsolute}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <></>
      )}
      <View style={styles.ViewBetween}>
        <Text style={[styles.text40, styles.textWhite, styles.textTitle]}>
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
