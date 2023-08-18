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
      <Text>Chats</Text>
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
