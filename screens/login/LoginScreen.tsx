import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import colors from '../../constants/colors'
import { styles } from '../../constants/styles'
import MainButton from '../../components/MainButton'
import SecondaryButton from '../../components/SecondaryButton'
import InputText from '../../components/InputText'
import { useState } from 'react'
import rules from '../../constants/rules'
import { LogIn } from '../../functions/Actions'
import text from '../../constants/text'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BGCircles from '../../components/BGCircles'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'

export default function LoginScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function LogInFunc() {
    setLoading(true)
    const response = await LogIn(email, password)
    if (!response.error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'NavigationApp' }],
      })
    } else {
      setError(response.error)
      setLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
      }}
    >
      <View
        style={[
          styles.ViewCenter,
          {
            backgroundColor:
              themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
          },
        ]}
      >
        <StatusBar
          barStyle={themeColor === 'dark' ? 'dark-content' : 'light-content'}
          backgroundColor={
            themeColor === 'dark' ? colors.DarkTextBlue : colors.LightTextBlue
          }
        />
        <BGCircles type={1} />
        <View style={styles.ViewBetween}>
          <Text
            style={{
              fontSize: 40,
              letterSpacing: 1,
              fontWeight: '700',
              color: themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
            }}
          >
            Login
          </Text>
          <View style={styles.center100}>
            <InputText
              colorState={1}
              placeholder="email"
              type="email"
              value={email}
              setValue={(value: string) => setEmail(value)}
            />
            <InputText
              colorState={1}
              placeholder="password"
              type="password"
              value={password}
              setValue={(value: string) => setPassword(value)}
            />
            {error ? (
              <Text style={styles.ErrorText}>{text[error]}</Text>
            ) : (
              <></>
            )}

            {loading ? (
              <View
                style={{
                  height: 60,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator size={'large'} />
              </View>
            ) : (
              <MainButton
                title="Login"
                disable={
                  !(
                    rules.email.test(email) &&
                    password.length >= rules.passwordMinLengh
                  )
                }
                action={() => {
                  LogInFunc()
                }}
              />
            )}
          </View>
          <View></View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
