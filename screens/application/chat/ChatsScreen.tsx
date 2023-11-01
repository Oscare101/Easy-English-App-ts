import { FlatList, StatusBar, Text, View } from 'react-native'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import { getDatabase, onValue, ref } from 'firebase/database'
import { User } from '../../../constants/interfaces'
import { auth } from '../../../firebase'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import colors from '../../../constants/colors'
import text from '../../../constants/text'
import rules from '../../../constants/rules'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
export default function ChatsScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [users, setUsers] = useState<any>()

  const [chats, setChats] = useState<any>({})

  function GetUsersFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `user`)
      onValue(data, (snapshot) => {
        setUsers(snapshot.val() as User)
      })
    }
  }

  function GetChatsFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `chat`)
      onValue(data, (snapshot) => {
        setChats(snapshot.val())
      })
    }
  }

  useEffect(() => {
    GetUsersFunc()
    GetChatsFunc()
  }, [])

  function findAtSymbols(inputString: string) {
    const atSymbolIndices = []
    for (let i = 0; i < inputString.length; i++) {
      if (inputString[i] === '@') {
        atSymbolIndices.push(i)
      }
    }
    return atSymbolIndices
  }

  function RenderChatItem({ item }: any) {
    let frientEmail: string = (
      item.slice(0, findAtSymbols(item)[1]) +
      item.slice(findAtSymbols(item)[1] + 1)
    ).replace(`${auth.currentUser?.email?.replace('.', ',')}`, '')

    return (
      <MainButton
        title={users[frientEmail] ? users[frientEmail].name : 'Deleted Chat'}
        disable={false}
        action={() => {
          if (users[frientEmail]) {
            navigation.navigate('PersonalChatScreen', {
              chatID: item,
              user: users[frientEmail],
            })
          } else {
            Toast.show({
              type: 'ToastMessage',
              props: {
                title: `This chat may be deleted`,
              },
              position: 'bottom',
            })
          }
        }}
        style={{ width: '100%' }}
      />
    )
  }

  return (
    <View
      style={[
        styles.ViewStart,
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
          width: rules.componentWidthPercent,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          backgroundColor:
            themeColor === 'dark'
              ? colors.DarkBGComponent
              : colors.LightBGComponent,
          borderRadius: 8,
          marginVertical: 20,
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
          {text.BePoliteInChat}
        </Text>
      </View>
      <MainButton
        title="Global chat"
        disable={false}
        action={() => {
          if (auth.currentUser && auth.currentUser.email) {
            navigation.navigate('GlobalChatScreen', {
              chatID: '001',
              user: users[auth.currentUser.email?.replace('.', ',')],
            })
          }
        }}
      />
      {Object.keys(chats).filter((i: any) =>
        i.includes(auth.currentUser?.email?.replace('.', ','))
      ).length > 0 ? (
        <>
          <View
            style={{
              width: rules.componentWidthPercent,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor:
                themeColor === 'dark'
                  ? colors.DarkBGComponent
                  : colors.LightBGComponent,
              borderRadius: 8,
              marginVertical: 20,
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
              {text.PersonalChatsTitle}
            </Text>
          </View>
          <FlatList
            style={{ width: rules.componentWidthPercent }}
            data={Object.keys(chats).filter((i: any) =>
              i.includes(auth.currentUser?.email?.replace('.', ','))
            )}
            renderItem={RenderChatItem}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  )
}
