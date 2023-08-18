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
import { DeleteUser, Registration, UpdateUser } from '../../functions/Actions'
import text from '../../constants/text'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth } from '../../firebase'
import DangerousButton from '../../components/DangerousButton'
import BGCircles from '../../components/BGCircles'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'

export default function NewUserScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [name, setName] = useState<string>('')
  const [surname, setSurname] = useState<string>('')
  const [birthDate, setBirthdate] = useState<any>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function SetNewUserDataFunc() {
    setLoading(true)
    const data = {
      name: name,
      surname: surname,
      birthDate: birthDate,
    }
    if (auth.currentUser && auth.currentUser.email) {
      await UpdateUser(auth.currentUser.email, data)
      navigation.reset({
        index: 0,
        routes: [{ name: 'NavigationApp' }],
      })
    }
  }

  async function DeleteUserFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      await DeleteUser(auth.currentUser.email)
      navigation.reset({
        index: 0,
        routes: [{ name: 'LaunchScreen' }],
      })
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
            Create user
          </Text>
          <View style={styles.center100}>
            <InputText
              colorState={1}
              placeholder="name *"
              type="name"
              value={name}
              setValue={(value: string) => setName(value)}
            />
            <InputText
              colorState={1}
              placeholder="surname"
              type="name"
              value={surname}
              setValue={(value: string) => setSurname(value)}
            />
            <InputText
              colorState={1}
              placeholder="birthdate"
              type="date"
              value={birthDate}
              setValue={(value: string) => setBirthdate(value)}
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
                title="Save"
                disable={!name.trim()}
                action={() => {
                  SetNewUserDataFunc()
                }}
              />
            )}
          </View>
          <DangerousButton
            title="Cancel and delete account"
            disable={!name}
            action={() => {
              DeleteUserFunc()
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
