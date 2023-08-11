import {
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

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  async function LogInFunc() {
    const response = await LogIn(email, password)
    if (!response.error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'NavigationApp' }],
      })
    } else {
      setError(response.error)
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
      }}
    >
      <View style={styles.ViewCenter}>
        <StatusBar barStyle="light-content" backgroundColor={colors.Main} />
        <BGCircles type={1} />
        <View style={styles.ViewBetween}>
          <Text style={[styles.text40, styles.textWhite, styles.textTitle]}>
            Login
          </Text>
          <View style={styles.center100}>
            <InputText
              placeholder="email"
              type="email"
              value={email}
              setValue={(value: string) => setEmail(value)}
            />
            <InputText
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
          </View>
          <View></View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
