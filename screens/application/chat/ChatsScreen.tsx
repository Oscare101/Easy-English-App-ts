import { StatusBar, Text, View } from 'react-native'
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
export default function ChatsScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [user, setUser] = useState<User>({} as User)

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
    GetUserFunc()
  }, [])

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
          marginBottom: 20,
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
          navigation.navigate('GlobalChatScreen', { chatID: '001', user: user })
        }}
      />
    </View>
  )
}
