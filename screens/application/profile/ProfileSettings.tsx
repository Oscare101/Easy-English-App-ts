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
import { setTheme } from '../../../redux/theme'

export default function ProfileSettings({ navigation }: any) {
  const dispatch = useDispatch()
  const { authentication } = useSelector(
    (state: RootState) => state.authentication
  )
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const { theme } = useSelector((state: RootState) => state.theme)

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
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        navigation.navigate('PersonalInfoSettings')
      },
    },
    {
      type: 'button',
      title: user && user.photo ? 'Change photo' : 'Set photo',
      icon: 'chevron-forward',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        // navigation.navigate('PersonalInfoSettings')
      },
    },
    {
      type: 'button',
      title: 'Theme',
      icon: themeColor === 'dark' ? 'moon-outline' : 'sunny-outline',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        setBottomSheetContent('themeZone')
        bottomSheetModalRef.current?.present()
      },
    },
    { type: 'title', title: 'Security' },
    {
      type: 'button',
      title: 'Security settings',
      icon: 'lock-open-outline',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        setBottomSheetContent('securityZone')
        bottomSheetModalRef.current?.present()
      },
    },
    { type: 'title', title: 'Action' },
    {
      type: 'button',
      title: 'LogOut',
      icon: 'log-out-outline',
      color:
        themeColor === 'dark' ? colors.DarkDangerText : colors.DarkDangerText,
      action: () => {
        LogOutFunc()
      },
    },
    {
      type: 'button',
      title: 'Danger zone',
      icon: '',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        setBottomSheetContent('dangerZone')
        bottomSheetModalRef.current?.present()
      },
    },
  ]

  async function DeleteAccountFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      await DeleteUser(auth.currentUser.email)
      dispatch(setAuthentication('auto'))
      AsyncStorage.setItem('authentication', 'auto')

      navigation.reset({
        index: 0,
        routes: [{ name: 'LaunchScreen' }],
      })
    }
  }

  async function LogOutFunc() {
    const response = await LogOut()
    if (!response.error) {
      dispatch(setAuthentication('auto'))
      AsyncStorage.setItem('authentication', 'auto')
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
      description: 'Use your email and password for every login',
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

  const themeRules = [
    {
      state: 'system',
      title: 'System',
      description: "Use your device's theme",
      icon: 'phone-portrait-outline',
    },
    {
      state: 'light',
      title: 'Light',
      description: 'Always use light theme',
      icon: 'sunny-outline',
    },
    {
      state: 'dark',
      title: 'Dark',
      description: 'Always use dark theme',
      icon: 'moon-outline',
    },
  ]

  function RenderSettingsItem({ item }: any) {
    const title = (
      <View
        style={{
          width: rules.componentWidthPercent,
          alignSelf: 'center',
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color:
              themeColor === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
          }}
        >
          {item.title}
        </Text>
      </View>
    )
    const button = (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => item.action()}
        style={{
          borderColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
          borderBottomWidth: 1,
          width: rules.componentWidthPercent,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: item.icon ? 'space-between' : 'center',
          paddingVertical: 15,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: item.color,
          }}
        >
          {item.title}
        </Text>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </TouchableOpacity>
    )

    return <>{item.type === 'title' ? title : button}</>
  }

  function DangerZone() {
    return (
      <View
        style={{
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBGModal : colors.LightBGModal,
          flex: 1,
        }}
      >
        <View
          style={{
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
            borderBottomWidth: 1,
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
            width: '100%',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              paddingVertical: 10,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            Dange Zone
          </Text>
        </View>
        <View
          style={{
            width: rules.componentWidthPercent,
            alignSelf: 'center',
            marginTop: 16,
            borderRadius: 8,
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
            padding: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              paddingVertical: 10,
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
            }}
          >
            {text.ConfirmDeletingAccount}
          </Text>
        </View>

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
            opacity: confirmDeletingAccount ? 1 : 0.5,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
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
              borderColor:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            {confirmDeletingAccount ? (
              <Ionicons
                name="checkmark-sharp"
                size={24}
                color={
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                }
              />
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!confirmDeletingAccount}
          onPress={() => {
            if (confirmDeletingAccount) {
              DeleteAccountFunc()
            }
          }}
          style={{
            width: rules.componentWidthPercent,
            opacity: confirmDeletingAccount ? 1 : 0.5,
            marginTop: 20,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: confirmDeletingAccount
              ? themeColor === 'dark'
                ? colors.DarkBGDanger
                : colors.LightBGDanger
              : '#00000000',
            height: 60,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor:
              themeColor === 'dark'
                ? colors.DarkDangerText
                : colors.LightDangerText,
          }}
        >
          <Text
            style={{
              color:
                themeColor === 'dark'
                  ? colors.DarkDangerText
                  : colors.LightDangerText,
              fontSize: 20,
            }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  function SecurityZone() {
    return (
      <View
        style={{
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBGModal : colors.LightBGModal,
          flex: 1,
        }}
      >
        <View
          style={{
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
            borderBottomWidth: 1,
            width: '100%',
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              paddingVertical: 10,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            Security
          </Text>
        </View>
        <View
          style={{
            width: rules.componentWidthPercent,
            alignSelf: 'center',
            marginTop: 16,
            borderRadius: 8,
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
            padding: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              paddingVertical: 10,
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
            }}
          >
            {text.SecurityRulesText}
          </Text>
        </View>

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
              <Ionicons
                name={item.icon}
                size={24}
                color={
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                }
              />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkCommentText
                        : colors.LightCommentText,
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    )
  }

  function ThemeZone() {
    return (
      <View
        style={{
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBGModal : colors.LightBGModal,
          flex: 1,
        }}
      >
        <View
          style={{
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
            borderBottomWidth: 1,
            width: '100%',
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              paddingVertical: 10,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            Theme
          </Text>
        </View>
        <View
          style={{
            width: rules.componentWidthPercent,
            alignSelf: 'center',
            marginTop: 16,
            borderRadius: 8,
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
            padding: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              paddingVertical: 10,
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
            }}
          >
            {text.ThemeRulesText}
          </Text>
        </View>

        {themeRules
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
                opacity: theme === item.state ? 1 : 0.5,
              }}
              onPress={async () => {
                dispatch(setTheme(item.state))
                AsyncStorage.setItem('theme', item.state)
              }}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                }
              />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkCommentText
                        : colors.LightCommentText,
                  }}
                >
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
          barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={
            themeColor === 'dark' ? colors.DarkBG : colors.LightBG
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
        >
          <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
            <View
              style={{
                borderColor:
                  themeColor === 'dark'
                    ? colors.DarkBorder
                    : colors.LightBorder,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkMainText
                      : colors.LightMainText,
                }}
              >
                {user ? user.name : ''}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                }}
              >
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
              backgroundStyle={{
                backgroundColor:
                  themeColor === 'dark'
                    ? colors.DarkBGComponent
                    : colors.LightBGComponent,
              }}
              ref={bottomSheetModalRef}
              snapPoints={snapPoints}
              backdropComponent={({ style }) => (
                <TouchableWithoutFeedback
                  onPress={() => bottomSheetModalRef.current?.dismiss()}
                >
                  <View
                    style={[
                      style,
                      {
                        backgroundColor:
                          themeColor === 'dark'
                            ? colors.DarkShadow
                            : colors.LightShadow,
                      },
                    ]}
                  >
                    <StatusBar
                      backgroundColor={
                        themeColor === 'dark'
                          ? colors.DarkBG
                          : colors.LightShadow
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            >
              {bottomSheetContent === 'dangerZone' ? (
                <DangerZone />
              ) : bottomSheetContent === 'themeZone' ? (
                <ThemeZone />
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
