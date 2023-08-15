import {
  ActivityIndicator,
  Dimensions,
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
import { CreatePost, UpdateUser } from '../../../functions/Actions'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import rules from '../../../constants/rules'

const width = Dimensions.get('screen').width

export default function NewPostScreen({ navigation, route }: any) {
  const [post, setPost] = useState<string>('')
  const [surname, setSurname] = useState<string>('')
  const [birthDate, setBirthdate] = useState<any>('')
  const [gender, setGender] = useState<any>('')
  const [description, setDescription] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)

  async function CreatePostFunc() {
    setLoading(true)
    if (auth.currentUser && auth.currentUser.email && route.params.user) {
      const data = {
        text: post,
        date: new Date().getTime(),
        author: route.params.user.name,
        authorEmail: route.params.user.email,
        key: new Date().getTime() + route.params.user.email.replace('.', ','),
      }
      await CreatePost(auth.currentUser?.email, data)
      navigation.goBack()
    }
  }

  return (
    <View style={styles.ViewCenter}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.White} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps={'handled'}
      >
        <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
          <Text style={{ fontSize: 24, paddingBottom: 20 }}>
            ProfileSettings
          </Text>

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
            }}
          >
            <TextInput
              style={{ fontSize: 18, width: '100%' }}
              editable
              multiline
              maxLength={rules.maxPostLength}
              numberOfLines={4}
              value={post}
              onChangeText={(text) => setPost(text)}
              placeholder="your text here"
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
            {post.length}/{rules.maxPostLength}
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
            <MainButton title="Save" disable={!post} action={CreatePostFunc} />
          )}
        </View>
      </ScrollView>
    </View>
  )
}
