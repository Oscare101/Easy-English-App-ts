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
import { Registration } from '../../functions/Actions'
import text from '../../constants/text'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BGCircles from '../../components/BGCircles'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'

export default function RegistrationScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [email, setEmail] = useState<string>('')
  const [password1, setPassword1] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function RegistrationFunc() {
    setLoading(true)
    const response: any = await Registration(email, password1)
    if (!response.error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'NewUserScreen' }],
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
      <View style={styles.ViewCenter}>
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
            Registration
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
              value={password1}
              setValue={(value: string) => setPassword1(value)}
            />
            <InputText
              colorState={1}
              placeholder="password"
              type="password"
              value={password2}
              setValue={(value: string) => setPassword2(value)}
            />
            {error ? (
              <Text
                style={{
                  fontSize: 16,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkDangerText
                      : colors.LightDangerText,
                }}
              >
                {text[error]}
              </Text>
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
                title="Registration"
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
            )}
          </View>
          <View></View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
