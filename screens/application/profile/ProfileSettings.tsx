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
import { auth, storage } from '../../../firebase'
import { Ionicons } from '@expo/vector-icons'
import { getDatabase, onValue, ref } from 'firebase/database'
import colors from '../../../constants/colors'
import {
  DeleteUser,
  LogOut,
  SetUserPhotoUpdate,
} from '../../../functions/Actions'
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
import {
  connectAuthEmulator,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from 'firebase/auth'
import {
  ref as refStorage,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import Toast from 'react-native-toast-message'
import SwipeToDelete from '../../../components/SwipeToDelete'

export default function ProfileSettings({ navigation, route }: any) {
  const dispatch = useDispatch()
  const { authentication } = useSelector(
    (state: RootState) => state.authentication
  )
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const { theme } = useSelector((state: RootState) => state.theme)
  const [image, setImage] = useState<any>('')
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

  async function ResetPasswordFunc() {
    if ((auth.currentUser && auth, auth.currentUser?.email)) {
      sendPasswordResetEmail(auth, auth.currentUser?.email)
    }
  }

  async function convertToJPEGFunc(
    imageUri: any,
    height: number,
    width: number
  ) {
    try {
      const jpgImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: width, height: height } }],
        { format: SaveFormat.JPEG, compress: 0.8 }
      )

      return jpgImage
    } catch (error) {}
  }

  async function OpenGallery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    })

    if (
      !result.canceled &&
      result.assets[0].width > 0 &&
      result.assets[0].height > 0
    ) {
      bottomSheetModalRef.current?.dismiss()

      if (
        result.assets[0].uri.split('.').slice(-1).join() !== 'jpeg' ||
        'jpg'
      ) {
        const imageJPG = await convertToJPEGFunc(
          result.assets[0].uri,
          result.assets[0].height,
          result.assets[0].width
        )
        if (imageJPG && imageJPG.uri) {
          setImage(imageJPG.uri)
        }
      } else {
        setImage(result.assets[0].uri)
      }
    } else {
    }
  }

  async function OpenCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })

    if (!result.canceled) {
      bottomSheetModalRef.current?.dismiss()

      setImage(result.assets[0].uri)
    }
  }

  const uriToBlob = (uri: string) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', uri, true)

      xhr.send(null)
    })
  }

  async function EditUserPhoto() {
    if (auth.currentUser && auth.currentUser.email && image) {
      const fileBlob: any = await uriToBlob(image)
      const storageRef = refStorage(storage, `user/${auth.currentUser?.email}`)
      uploadBytes(storageRef, fileBlob).then((snapshot) => {
        Toast.show({
          type: 'ToastMessage',
          props: {
            title: `Profile photo has been changed`,
          },
          position: 'bottom',
        })
        bottomSheetModalRef.current?.dismiss()
        if (auth.currentUser && auth.currentUser.email && image) {
          SetUserPhotoUpdate(
            auth.currentUser?.email,
            new Date().getTime().toString()
          )
        }
      })
    }
  }

  async function DeletePhoto() {
    if (auth.currentUser && auth.currentUser.email) {
      const storageRef = refStorage(storage, `user/${auth.currentUser?.email}`)

      deleteObject(storageRef).then(() => {
        Toast.show({
          type: 'ToastMessage',
          props: {
            title: `Profile photo has been deleted`,
          },
          position: 'bottom',
        })
        bottomSheetModalRef.current?.dismiss()
        if (auth.currentUser && auth.currentUser.email) {
          SetUserPhotoUpdate(auth.currentUser?.email, '')
        }
      })
    }
  }

  useEffect(() => {
    EditUserPhoto()
  }, [image])

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
      icon: 'image',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        setBottomSheetContent('imageZone')
        bottomSheetModalRef.current?.present()
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
    {
      type: 'button',
      title: 'Application info',
      icon: 'information-outline',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        navigation.navigate('ApplicationInfoScreen')
      },
    },
    {
      type: 'button',
      title: 'Reset password',
      icon: 'cog',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        setBottomSheetContent('resetPassword')
        bottomSheetModalRef.current?.present()
      },
    },
    {
      type: 'button',
      title: 'Personal TODO list',
      icon: 'chevron-forward',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        navigation.navigate('PersonalTodoScreen')
      },
    },
    { type: 'title', title: 'Security' },
    {
      type: 'button',
      title: 'Security settings',
      icon:
        authentication === 'auto'
          ? 'repeat'
          : authentication === 'biometric'
          ? 'finger-print'
          : 'lock-open-outline',
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
    if (route.params && route.params.setImage) {
      setBottomSheetContent('imageZone')
      bottomSheetModalRef.current?.present()
    }
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
      icon: 'repeat',
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

  const imageOptions = [
    {
      action: () => OpenCamera(),
      title: 'Camera',
      description: "Use your device's camera to take photo",
      icon: 'camera-outline',
    },
    {
      action: () => OpenGallery(),
      title: 'Gallery',
      description: 'Use your gallery and choose a photo',
      icon: 'images-outline',
    },
    {
      action: () => DeletePhoto(),
      title: 'Delete photo',
      description: 'Remove photo from your ptofile',
      icon: 'trash-outline',
      delete: true,
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
        {confirmDeletingAccount ? (
          <SwipeToDelete
            title="Swipe to confirm"
            action={DeleteAccountFunc}
            icon="person-remove-outline"
          />
        ) : (
          <View
            style={{
              width: rules.componentWidthPercent,
              opacity: 0.5,
              marginTop: 20,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#00000000',
              height: 60,
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor:
                themeColor === 'dark'
                  ? colors.DarkDangerText
                  : colors.LightDangerText,
              paddingHorizontal: '6%',
            }}
          >
            <View></View>
            <Text
              style={{
                color:
                  themeColor === 'dark'
                    ? colors.DarkDangerText
                    : colors.LightDangerText,
                fontSize: 20,
              }}
            >
              {'<<<'} Swipe to confirm
            </Text>
            <Ionicons
              name="person-remove-outline"
              size={24}
              color={
                themeColor === 'dark'
                  ? colors.DarkDangerText
                  : colors.LightDangerText
              }
            />
          </View>
        )}
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

  function PasswordZone() {
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
            Reset password
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
            {text.MailForPasswordReset}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
            width: rules.componentWidthPercent,
            paddingHorizontal: 20,
            borderWidth: 2,
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
            alignSelf: 'center',
            borderRadius: 8,
            marginTop: 20,
          }}
          onPress={async () => {
            ResetPasswordFunc()
            Toast.show({
              type: 'ToastMessage',
              props: {
                title: `The mail was sent to ${auth.currentUser?.email}`,
              },
              position: 'bottom',
            })
          }}
        >
          <Ionicons
            name="mail-unread-outline"
            size={24}
            color={
              themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText
            }
          />

          <Text
            style={{
              fontSize: 18,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
              paddingLeft: 10,
            }}
          >
            Get a mail
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  function ImageZone() {
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
            Photo
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
            {text.ImageText}
          </Text>
        </View>

        {imageOptions
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
                opacity: item.delete && !user.photo ? 0.5 : 1,
              }}
              disabled={item.delete && !user.photo}
              onPress={() => {
                item.action()
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.goBack()
                  }}
                  style={{
                    height: 50,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText
                    }
                  />
                </TouchableOpacity>
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
                <View style={{ width: 50 }} />
              </View>

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
              ) : bottomSheetContent === 'imageZone' ? (
                <ImageZone />
              ) : bottomSheetContent === 'resetPassword' ? (
                <PasswordZone />
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
