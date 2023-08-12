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
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    GetMessages()
  }, [])

  function RenderChatItem({ item }: any) {
    const userMessage = auth.currentUser?.email === item.authorEmail
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: userMessage ? 'flex-end' : 'flex-start',
          width: '100%',
          padding: 5,
        }}
      >
        <View
          style={{
            maxWidth: width * 0.8,
            backgroundColor: userMessage
              ? colors.userMessage
              : colors.otherMessage,
            padding: 10,
            borderRadius: 16,
            borderBottomRightRadius: userMessage ? 0 : 16,
            borderBottomLeftRadius: userMessage ? 16 : 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: userMessage ? 'flex-end' : 'flex-start',
          }}
        >
          <Text style={{ fontSize: 14, color: colors.DarkGrey }}>
            {item.author}
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
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{}}
          data={messages}
          inverted
          // getItemLayout={(data, index) => ({
          //   length: 120,
          //   offset: 120 * index,
          //   index,
          // })}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          renderItem={({ item }: any) => <RenderChatItem item={item} />}
        />
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
