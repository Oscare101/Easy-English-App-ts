import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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
import { useEffect, useMemo, useState } from 'react'
import { User } from '../../../constants/interfaces'
import { auth } from '../../../firebase'
import { get, getDatabase, onValue, ref } from 'firebase/database'
import {
  CreateMessage,
  CreatePost,
  UpdateUser,
} from '../../../functions/Actions'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import rules from '../../../constants/rules'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'

const width = Dimensions.get('screen').width

export default function GlobalChatScreen({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [messages, setMessages] = useState<any>([])
  const [users, setUsers] = useState<any>({})
  const [newMessage, setNewMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function CreateMessageFunc() {
    setLoading(true)
    if (auth.currentUser && auth.currentUser.email && route.params.user) {
      const data = {
        text: newMessage,
        date: new Date().getTime(),
        author: route.params.user.name,
        authorEmail: route.params.user.email,
        id: new Date().getTime() + route.params.user.email.replace('.', ','),
      }
      setNewMessage('')

      await CreateMessage(route.params.chatID, data)
    }
    setLoading(false)
  }

  async function GetMessages() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `chat/` + route.params.chatID)
      onValue(data, (snapshot) => {
        if (snapshot.val()) {
          setMessages(Object.values(snapshot.val()).reverse())
        }
      })
    }
  }

  async function GetUsers() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `user/`)
      onValue(data, (snapshot) => {
        if (snapshot.val()) {
          setUsers(snapshot.val())
          GetMessages()
        }
      })
    }
  }

  useEffect(() => {
    GetUsers()
  }, [])

  const RenderChatItem = ({ item, email }: any) => {
    const userMessage = email === item.authorEmail
    return (
      <View
        style={[
          styles.messageBlock,
          {
            justifyContent: userMessage ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <View
          style={[
            styles.messageItem,
            {
              backgroundColor: userMessage
                ? themeColor === 'dark'
                  ? colors.DarkBGBlue
                  : colors.LightBGBlue
                : themeColor === 'dark'
                ? colors.DarkBGModal
                : colors.LightBGModal,

              borderBottomRightRadius: userMessage ? 0 : 16,
              borderBottomLeftRadius: userMessage ? 16 : 0,

              alignItems: userMessage ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              color: users[item.authorEmail.replace('.', ',')]
                ? themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText
                : themeColor === 'dark'
                ? colors.DarkDangerText
                : colors.LightDangerText,
              opacity: users[item.authorEmail.replace('.', ',')] ? 1 : 0.5,
            }}
          >
            {users
              ? users[item.authorEmail.replace('.', ',')]
                ? users[item.authorEmail.replace('.', ',')].name
                : 'deleted user'
              : ''}
          </Text>
          <Text
            style={{
              alignSelf: userMessage ? 'flex-start' : 'flex-end',
              fontSize: 20,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            {item.text}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
            }}
          >
            {new Date(item.date).toLocaleString()}
          </Text>
        </View>
      </View>
    )
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
              themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText
            }
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          Chat
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor:
            themeColor === 'dark'
              ? colors.DarkBGComponent
              : colors.LightBGComponent,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {users && messages ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ width: '100%' }}
            data={messages}
            inverted
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            windowSize={5}
            renderItem={({ item }: any) => (
              <RenderChatItem item={item} email={auth.currentUser?.email} />
            )}
          />
        ) : (
          <></>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: width * rules.componentWidth - 40,
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
            borderWidth: 2,
            borderRadius: 8,
            marginVertical: 8,
            overflow: 'hidden',
            paddingHorizontal: 10,
            maxHeight: 120,
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
            value={newMessage}
            onChangeText={(text) => {
              if (!loading) {
                setNewMessage(text)
              }
            }}
            placeholder="your text here"
            placeholderTextColor={
              themeColor === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText
            }
          />
        </View>

        <TouchableOpacity
          style={{
            height: 60,
            width: 60,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.5 : 1,
          }}
          disabled={!newMessage || loading}
          onPress={CreateMessageFunc}
        >
          <Ionicons
            name="send-outline"
            size={24}
            color={
              !newMessage || loading
                ? themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText
                : themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
