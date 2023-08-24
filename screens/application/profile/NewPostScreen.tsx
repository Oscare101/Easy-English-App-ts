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
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'

const width = Dimensions.get('screen').width

export default function NewPostScreen({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [post, setPost] = useState<string>(
    route.params.post ? route.params.post.text : ''
  )
  const [loading, setLoading] = useState<boolean>(false)

  async function CreatePostFunc() {
    setLoading(true)
    if (auth.currentUser && auth.currentUser.email && route.params.user) {
      const data = {
        text: post,
        date: new Date().getTime(),
        authorEmail: route.params.user.email,
        id: new Date().getTime() + route.params.user.email.replace('.', ','),
        lastEdited: '',
      }
      await CreatePost(data)
      navigation.goBack()
    } else if (
      auth.currentUser &&
      auth.currentUser.email &&
      route.params.post
    ) {
      const data = {
        text: post,
        date: route.params.post.date,
        authorEmail: route.params.post.authorEmail,
        id: route.params.post.id,
        lastEdited: new Date().getTime(),
      }
      await CreatePost(data)
      navigation.goBack()
    }
  }

  return (
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
        backgroundColor={themeColor === 'dark' ? colors.DarkBG : colors.LightBG}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps={'handled'}
      >
        <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
          <Text
            style={{
              fontSize: 24,
              paddingBottom: 20,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            Create post
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: rules.componentWidthPercent,
              borderColor:
                themeColor === 'dark'
                  ? colors.DarkBorder
                  : colors.LightCommentText,
              borderWidth: 2,
              borderRadius: 8,
              marginVertical: 8,
              overflow: 'hidden',
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              style={{
                fontSize: 18,
                width: '100%',
                color:
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
              editable
              multiline
              maxLength={rules.maxPostLength}
              numberOfLines={4}
              value={post}
              onChangeText={(text) => setPost(text)}
              placeholder="your text here"
              placeholderTextColor={
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText
              }
            />
          </View>
          <Text
            style={{
              textAlign: 'right',
              alignSelf: 'flex-end',
              paddingRight: '4%',
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
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
