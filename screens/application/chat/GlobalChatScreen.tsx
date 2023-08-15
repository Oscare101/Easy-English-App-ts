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

const width = Dimensions.get('screen').width

export default function GlobalChatScreen({ navigation, route }: any) {
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
        key: new Date().getTime() + route.params.user.email.replace('.', ','),
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
                ? colors.userMessage
                : colors.otherMessage,

              borderBottomRightRadius: userMessage ? 0 : 16,
              borderBottomLeftRadius: userMessage ? 16 : 0,

              alignItems: userMessage ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          <Text style={styles.messageAuthor}>
            {users ? users[item.authorEmail.replace('.', ',')].name : ''}
          </Text>
          <Text
            style={{
              alignSelf: userMessage ? 'flex-start' : 'flex-end',
              fontSize: 20,
              color: colors.Black,
            }}
          >
            {item.text}
          </Text>
          <Text style={{ fontSize: 12, color: colors.Grey }}>
            {new Date(item.date).toLocaleString()}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.ViewCenter}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.White} />

      <Text style={{ fontSize: 20, paddingVertical: 10 }}>Chat</Text>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: colors.RealWhite,
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
            borderColor: colors.Border,
            borderWidth: 2,
            borderRadius: 8,
            marginVertical: 8,
            overflow: 'hidden',
            paddingHorizontal: 10,
            maxHeight: 120,
          }}
        >
          <TextInput
            style={{ fontSize: 18, width: '100%' }}
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
          <Ionicons name="send-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}