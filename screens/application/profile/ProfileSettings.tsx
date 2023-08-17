import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { User } from '../../../constants/interfaces'
import { auth } from '../../../firebase'
import { Ionicons } from '@expo/vector-icons'
import { getDatabase, onValue, ref } from 'firebase/database'
import colors from '../../../constants/colors'
import { DeleteUser, LogOut } from '../../../functions/Actions'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import text from '../../../constants/text'
import rules from '../../../constants/rules'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import { useDispatch } from 'react-redux'
import { setAuthentication } from '../../../redux/authentication'
import * as LocalAuthentication from 'expo-local-authentication'

export default function ProfileSettings({ navigation }: any) {
  const dispatch = useDispatch()
  const { authentication } = useSelector(
    (state: RootState) => state.authentication
  )
  const [hasBiometric, setHasBiometric] = useState<boolean>(false)
  const [bottomSheetContent, setBottomSheetContent] = useState<string>('')
  const [user, setUser] = useState<User>({} as User)
  const [confirmDeletingAccount, setConfirmDeletingAccount] =
    useState<boolean>(false)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [400], [])

  async function GetBiometricData() {
    const has = await LocalAuthentication.hasHardwareAsync()
    setHasBiometric(has)
  }

  const settingsData = [
    { type: 'title', title: 'Account' },
    {
      type: 'button',
      title: 'Edit personal info',
      icon: 'chevron-forward',
      color: colors.Black,
      action: () => {
        navigation.navigate('PersonalInfoSettings')
      },
    },
    {
      type: 'button',
      title: user && user.photo ? 'Change photo' : 'Set photo',
      icon: 'chevron-forward',
      color: colors.Black,
      action: () => {
        // navigation.navigate('PersonalInfoSettings')
      },
    },
    { type: 'title', title: 'Security' },
    {
      type: 'button',
      title: 'Security settings',
      icon: 'lock-open-outline',
      color: colors.Black,
      action: () => {
        // if (hasBiometric) {
        //   dispatch(setBiometric(!biometric))
        //   AsyncStorage.setItem('biometric', (!biometric).toString())
        // }
        setBottomSheetContent('securityZone')

        bottomSheetModalRef.current?.present()
      },
    },
    { type: 'title', title: 'Action' },
    {
      type: 'button',
      title: 'LogOut',
      icon: 'log-out-outline',
      color: colors.Error,
      action: () => {
        LogOutFunc()
      },
    },
    {
      type: 'button',
      title: 'Danger zone',
      icon: '',
      color: colors.Black,
      action: () => {
        setBottomSheetContent('dangerZone')
        bottomSheetModalRef.current?.present()
      },
    },
  ]

  async function DeleteAccountFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      await DeleteUser(auth.currentUser.email)

      navigation.reset({
        index: 0,
        routes: [{ name: 'LaunchScreen' }],
      })
    }
  }

  async function LogOutFunc() {
    const response = await LogOut()
    if (!response.error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LaunchScreen' }],
      })
    } else {
    }
  }

  function GetUserFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(
        getDatabase(),
        `user/` + auth.currentUser.email.replace('.', ',')
      )
      onValue(data, (snapshot) => {
        setUser(snapshot.val() as User)
      })
    }
  }

  useEffect(() => {
    GetBiometricData()

    GetUserFunc()
  }, [])

  const securityRules = [
    {
      state: 'password',
      title: 'Password',
      description:
        'Use your email and password for every login. This method is the most secure',
      icon: 'lock-open-outline',
      needBiometric: false,
    },
    {
      state: 'biometric',
      title: 'Biometric',
      description: 'Use the biometric sensors of your device',
      icon: 'finger-print',
      needBiometric: true,
    },
    {
      state: 'auto',
      title: 'Auto login',
      description: "Don't ask for a password and login automatically",
      icon: 'log-in-outline',
      needBiometric: false,
    },
  ]

  function RenderSettingsItem({ item }: any) {
    const title = (
      <View
        style={{
          width: '100%',
          opacity: 0.5,
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 16, color: colors.Black }}>{item.title}</Text>
      </View>
    )
    const button = (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => item.action()}
        style={{
          borderColor: colors.LightGrey,
          borderBottomWidth: 1,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: item.icon ? 'space-between' : 'center',
          padding: 15,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 20, color: item.color }}>{item.title}</Text>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </TouchableOpacity>
    )

    return <>{item.type === 'title' ? title : button}</>
  }

  function DangerZone() {
    return (
      <View style={{ backgroundColor: colors.White, flex: 1 }}>
        <View
          style={{
            borderColor: colors.LightGrey,
            borderBottomWidth: 1,
            width: '100%',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              paddingVertical: 10,
            }}
          >
            Dange Zone
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            paddingVertical: 10,
            color: colors.Black,
          }}
        >
          {text.ConfirmDeletingAccount}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setConfirmDeletingAccount(!confirmDeletingAccount)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            width: '100%',
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: confirmDeletingAccount ? colors.Black : colors.Grey,
            }}
          >
            I confirm
          </Text>
          <View
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              borderWidth: 2,
              borderColor: confirmDeletingAccount ? colors.Black : colors.Grey,
            }}
          >
            {confirmDeletingAccount ? (
              <Ionicons name="checkmark-sharp" size={24} color="black" />
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={DeleteAccountFunc}
          style={{
            width: rules.componentWidthPercent,
            opacity: confirmDeletingAccount ? 1 : 0.5,
            marginTop: 20,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: colors.Error,
            height: 60,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.White, fontSize: 20 }}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  function SecurityZone() {
    return (
      <View style={{ backgroundColor: colors.White, flex: 1 }}>
        <View
          style={{
            borderColor: colors.LightGrey,
            borderBottomWidth: 1,
            width: '100%',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              paddingVertical: 10,
            }}
          >
            Security
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            paddingVertical: 10,
            color: colors.Black,
          }}
        >
          {text.SecurityRulesText}
        </Text>
        {securityRules
          .filter((i: any) =>
            i.needBiometric ? hasBiometric : !i.needBiometric
          )
          .map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                width: '100%',
                paddingHorizontal: 20,
                opacity: authentication === item.state ? 1 : 0.5,
              }}
              onPress={async () => {
                dispatch(setAuthentication(item.state))
                AsyncStorage.setItem('authentication', item.state)
              }}
            >
              <Ionicons name={item.icon} size={24} color={colors.Black} />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ fontSize: 18, color: colors.Black }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 10, color: colors.DarkGrey }}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.ViewCenter}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.White} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
        >
          <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
            <View
              style={{
                borderColor: colors.LightGrey,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 24, color: colors.Black }}>
                {user ? user.name : ''}
              </Text>
              <Text style={{ fontSize: 18, color: colors.DarkGrey }}>
                {user ? user.email : ''}
              </Text>
            </View>

            <FlatList
              style={{ flex: 1, width: '100%' }}
              scrollEnabled={false}
              data={settingsData}
              renderItem={RenderSettingsItem}
            />

            {/* BottomSheet */}
            <BottomSheetModal
              backgroundStyle={{ backgroundColor: colors.White }}
              ref={bottomSheetModalRef}
              snapPoints={snapPoints}
              backdropComponent={({ style }) => (
                <TouchableWithoutFeedback
                  onPress={() => bottomSheetModalRef.current?.dismiss()}
                >
                  <View style={[style, { backgroundColor: colors.ShadowBG }]}>
                    <StatusBar backgroundColor={colors.ShadowBG} />
                  </View>
                </TouchableWithoutFeedback>
              )}
            >
              {bottomSheetContent === 'dangerZone' ? (
                <DangerZone />
              ) : (
                <SecurityZone />
              )}
            </BottomSheetModal>
          </View>
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  )
}
