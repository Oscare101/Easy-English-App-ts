import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import InputText from '../../../components/InputText'
import { useEffect, useState } from 'react'
import { User } from '../../../constants/interfaces'
import { auth } from '../../../firebase'
import { get, getDatabase, onValue, ref } from 'firebase/database'
import { UpdateUser } from '../../../functions/Actions'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import rules from '../../../constants/rules'

const width = Dimensions.get('screen').width

export default function PersonalInfoSettings({ navigation }: any) {
  const [name, setName] = useState<string>('')
  const [surname, setSurname] = useState<string>('')
  const [birthDate, setBirthdate] = useState<any>('')
  const [gender, setGender] = useState<any>('')
  const [description, setDescription] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)

  function GetUserFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const dataRef = ref(
        getDatabase(),
        `user/` + auth.currentUser.email.replace('.', ',')
      )

      get(dataRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setName(snapshot.val().name)
            setSurname(snapshot.val().surname)
            setDescription(snapshot.val().description)
            setGender(snapshot.val().gender)
          } else {
            // dont reread data if it updates on server
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }

  async function UpdateUserFunc() {
    setLoading(true)
    if (auth.currentUser && auth.currentUser.email) {
      const data = {
        name: name,
        surname: surname,
        gender: gender,
        description: description,
      }
      await UpdateUser(auth.currentUser?.email, data)
      navigation.goBack()
    }
  }

  useEffect(() => {
    GetUserFunc()
  }, [])

  const genders = [
    {
      title: 'male',
      icon: 'male',
      action: () => {
        if (gender === 'male') {
          setGender('')
        } else {
          setGender('male')
        }
      },
    },
    {
      title: 'other',
      icon: 'male-female',
      action: () => {
        if (gender === 'other') {
          setGender('')
        } else {
          setGender('other')
        }
      },
    },
    {
      title: 'female',
      icon: 'female',
      action: () => {
        if (gender === 'female') {
          setGender('')
        } else {
          setGender('female')
        }
      },
    },
  ]

  return (
    <View style={styles.ViewCenter}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        keyboardShouldPersistTaps={'handled'}
      >
        <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
          <Text style={{ fontSize: 24, paddingBottom: 20 }}>
            ProfileSettings
          </Text>
          <InputText
            type="name"
            value={name}
            setValue={(value: string) => setName(value)}
            placeholder="name *"
          />
          <InputText
            type="name"
            value={surname}
            setValue={(value: string) => setSurname(value)}
            placeholder="surname"
          />
          <Text
            style={{
              fontSize: 18,
              color: colors.DarkGrey,
              textAlign: 'left',
              alignSelf: 'flex-start',
              paddingLeft: '4%',
            }}
          >
            Gender
          </Text>
          <View
            style={{
              width: rules.componentWidthPercent,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {genders.map((item: any, index: number) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => item.action()}
                key={index}
                style={{
                  width: (width * rules.componentWidth - 32) / 3,
                  borderWidth: 2,
                  borderColor:
                    gender === item.title
                      ? item.title === 'male'
                        ? colors.Main
                        : item.title === 'female'
                        ? colors.Purple
                        : colors.Green
                      : colors.Border,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                  marginVertical: 8,
                  opacity: gender === item.title ? 1 : 0.3,
                }}
              >
                <Ionicons name={item.icon} size={24} color="black" />
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: rules.componentWidthPercent,
              borderColor: colors.Border,
              borderWidth: 2,
              borderRadius: 8,
              marginVertical: 8,
              overflow: 'hidden',
              paddingHorizontal: 10,
              minHeight: 60,
            }}
          >
            <TextInput
              style={{ fontSize: 18, width: '100%' }}
              editable
              multiline
              maxLength={rules.maxBioLength}
              numberOfLines={4}
              value={description}
              onChangeText={(text) => setDescription(text)}
              placeholder="description"
            />
          </View>
          <Text
            style={{
              textAlign: 'right',
              alignSelf: 'flex-end',
              paddingRight: '4%',
              color: colors.DarkGrey,
            }}
          >
            {description.length}/{rules.maxBioLength}
          </Text>
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
            <MainButton title="Save" disable={!name} action={UpdateUserFunc} />
          )}
        </View>
      </ScrollView>
    </View>
  )
}
