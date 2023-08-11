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
import { Registration } from '../../functions/Actions'
import text from '../../constants/text'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BGCircles from '../../components/BGCircles'

export default function RegistrationScreen({ navigation }: any) {
  const [email, setEmail] = useState<string>('')
  const [password1, setPassword1] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')
  const [error, setError] = useState<string>('')

  async function RegistrationFunc() {
    const response: any = await Registration(email, password1)
    if (!response.error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'NewUserScreen' }],
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
            Registration
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
              value={password1}
              setValue={(value: string) => setPassword1(value)}
            />
            <InputText
              placeholder="password"
              type="password"
              value={password2}
              setValue={(value: string) => setPassword2(value)}
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
                  password1.length >= rules.passwordMinLengh &&
                  password1 === password2
                )
              }
              action={() => {
                RegistrationFunc()
              }}
            />
          </View>
          <View></View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
